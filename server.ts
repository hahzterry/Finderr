import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const app = express();

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// FEATURE 1: Extract Housing Preferences from Natural Language
app.post('/api/extract-preferences', async (req, res) => {
  const { prompt } = req.body;
  const userText = (prompt || '').trim();

  // Deterministic fallback structure
  const fallback = {
    budgetMax: 900,
    destination: 'DCU',
    maxCommuteMinutes: 35,
    weights: {
      affordability: 0.95,
      commute: 0.90,
      quietness: 0.70,
      naturalLight: 0.40,
      desk: 0.80,
      space: 0.30,
      socialAtmosphere: 0.25,
      publicTransport: 0.85
    },
    dealbreakers: ['smoking_indoors'],
    summary: 'Looking for an affordable, quiet student home with strong transport links and a desk near DCU.'
  };

  try {
    const ai = getGeminiClient();
    if (!ai) {
      console.log('Gemini API key not configured, returning deterministic preference extraction.');
      return res.json({ preferences: fallback, source: 'deterministic_fallback' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Extract housing preferences from this student/renter description into structured JSON:
"${userText}"`,
      config: {
        systemInstruction: `You are NestMate's Housing Preference Extraction Engine.
Extract the user's budget ceiling in Euros (numeric), destination college or area, maximum acceptable commute in minutes, and normalized importance weights (0.0 to 1.0) for dimensions: affordability, commute, quietness, naturalLight, desk, space, socialAtmosphere, publicTransport.
Also include dealbreakers (e.g. smoking, pets) and a concise summary sentence.
If values are not mentioned, infer sensible defaults for a Dublin student (budget around 900, commute around 35).`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            budgetMax: { type: Type.NUMBER, description: 'Maximum monthly budget in EUR' },
            destination: { type: Type.STRING, description: 'Destination university, workplace or central area' },
            maxCommuteMinutes: { type: Type.NUMBER, description: 'Maximum travel time in minutes' },
            weights: {
              type: Type.OBJECT,
              properties: {
                affordability: { type: Type.NUMBER },
                commute: { type: Type.NUMBER },
                quietness: { type: Type.NUMBER },
                naturalLight: { type: Type.NUMBER },
                desk: { type: Type.NUMBER },
                space: { type: Type.NUMBER },
                socialAtmosphere: { type: Type.NUMBER },
                publicTransport: { type: Type.NUMBER }
              },
              required: ['affordability', 'commute', 'quietness', 'naturalLight', 'desk', 'space', 'socialAtmosphere', 'publicTransport']
            },
            dealbreakers: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: { type: Type.STRING }
          },
          required: ['budgetMax', 'destination', 'maxCommuteMinutes', 'weights', 'summary']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.budgetMax || !parsed.weights) {
      return res.json({ preferences: fallback, source: 'fallback_validation' });
    }

    return res.json({ preferences: parsed, source: 'gemini' });
  } catch (err: any) {
    console.warn('Gemini preference extraction error, using fallback:', err?.message || err);
    return res.json({ preferences: fallback, source: 'deterministic_fallback_on_error' });
  }
});

// FEATURE 2: Explain Matches & Trade-offs
app.post('/api/explain-match', async (req, res) => {
  const { property, preferences, dna, matchScore } = req.body;

  const fallbackTake = property?.id === 'prop_e'
    ? 'You’re giving up some kitchen space, but this strongly matches what you’ve consistently chosen: exceptional quietness, natural light, and a reliable 28-min commute to DCU.'
    : `Offers a solid +${matchScore?.breakdown?.budgetScore || 22} Budget alignment and convenient transport, with the main trade-off being ${property?.tradeOff || 'commute distance'}.`;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ explanation: fallbackTake, source: 'deterministic_fallback' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Explain why this property matches the user and clarify the trade-off.
Property data:
Title: ${property.title}
Area: ${property.area}
Rent: €${property.monthlyRent} (User Budget: €${preferences?.budgetMax || 900})
Commute: ${property.commuteMinutes} min to ${preferences?.destination || 'DCU'}
Quietness score: ${property.quietnessScore}/100 (User learned weight: ${dna?.quietness || 90}/100)
Natural light score: ${property.naturalLightScore}/100 (User learned weight: ${dna?.naturalLight || 80}/100)
Trade-off: ${property.tradeOff || 'none'}
Overall match: ${matchScore?.score || 96}%`,
      config: {
        systemInstruction: `You are NestMate's Match Explainer.
Write a 2-sentence conversational "NestMate's take" explaining why this fits what the user values (especially learned choices like quietness and natural light) and highlighting the genuine trade-off.
CRITICAL: Only reference facts from the property data provided. Never invent features. Keep it warm, objective, and under 45 words.`
      }
    });

    const text = (response.text || '').trim();
    return res.json({ explanation: text || fallbackTake, source: 'gemini' });
  } catch (err: any) {
    console.warn('Gemini explanation error, using fallback:', err?.message || err);
    return res.json({ explanation: fallbackTake, source: 'fallback_on_error' });
  }
});

// FEATURE 3: Risk Analysis (Scam Shield)
app.post('/api/analyze-risk', async (req, res) => {
  const { property } = req.body;

  const fallback = {
    riskSummary: 'Scam Shield flagged multiple critical risk indicators: unusually low pricing for central Dublin, urgency to transfer a deposit today, lack of physical viewing, and communications routed off-platform to an unverified number.',
    advisory: 'NestMate strongly advises against sending deposits or private identification prior to an in-person viewing and verified lease agreement.'
  };

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ analysis: fallback, source: 'deterministic_fallback' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Analyze rental listing description for safety signals and pressure tactics:
Listing: "${property?.title}" - €${property?.monthlyRent}/mo
Description: "${property?.description}"
Known flags: ${JSON.stringify(property?.riskSignals || [])}`,
      config: {
        systemInstruction: `You are NestMate Scam Shield AI.
Analyze the listing text for urgency language, suspicious payment terms, or evasion tactics.
CRITICAL SAFETY DIRECTIVE:
1. Never definitively accuse anyone of fraud or crime (do NOT say "This is a scam").
2. Use professional consumer protection terminology: "elevated risk", "suspicious signals", "unusual urgency indicators", "verify before paying".
3. Provide a clear 2-sentence summary of the detected signals.`
      }
    });

    return res.json({
      analysis: {
        riskSummary: response.text?.trim() || fallback.riskSummary,
        advisory: fallback.advisory
      },
      source: 'gemini'
    });
  } catch (err: any) {
    console.warn('Gemini risk analysis error, using fallback:', err?.message || err);
    return res.json({ analysis: fallback, source: 'fallback_on_error' });
  }
});

// Vite middleware or Static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NestMate server listening at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
