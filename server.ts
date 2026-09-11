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
        systemInstruction: `You are Finderr's Housing Preference Extraction Engine.
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
        systemInstruction: `You are Finderr's Match Explainer.
Write a 2-sentence conversational "Finderr's take" explaining why this fits what the user values (especially learned choices like quietness and natural light) and highlighting the genuine trade-off.
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
    advisory: 'Finderr strongly advises against sending deposits or private identification prior to an in-person viewing and verified lease agreement.'
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
        systemInstruction: `You are Finderr Scam Shield AI.
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

// FEATURE 4: Landlord AI Listing Drafter & DNA Analyzer
app.post('/api/landlord/generate-listing', async (req, res) => {
  const { notes, area, baseRent } = req.body;

  const fallback = {
    title: 'Sunny Garden Double Room in Glasnevin',
    area: area || 'Glasnevin',
    monthlyRent: Number(baseRent) || 860,
    utilitiesEstimate: 45,
    description: notes?.trim() || 'Bright, tranquil double bedroom overlooking private rear garden. South-facing window provides generous natural sunlight. Includes large study desk, ergonomic chair, and wardrobe.',
    quietnessScore: 88,
    naturalLightScore: 92,
    roomSizeScore: 78,
    socialScore: 40,
    publicTransportScore: 82,
    desk: true,
    furnished: true,
    amenities: ['High-speed Wi-Fi', 'Garden Access', 'Study Desk', 'Washing Machine', 'Bicycle Storage'],
    tradeOff: 'Strict quiet hours after 10 PM; kitchen is shared with 2 other postgraduate residents.',
    targetStudentProfile: 'Ideal for postgraduate or final-year university student seeking undisturbed study space.'
  };

  try {
    const ai = getGeminiClient();
    if (!ai || !notes?.trim()) {
      return res.json({ listing: fallback, source: 'deterministic_fallback' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are Finderr's Landlord Assistant. Convert these informal landlord rental notes into a polished student rental listing with objective housing metrics:
Notes: "${notes}"
Area hint: ${area || 'Dublin'}
Rent hint: €${baseRent || 860}`,
      config: {
        systemInstruction: `Extract and synthesize a structured listing draft for the Dublin student rental market.
Generate realistic numerical scores (0 to 100) for quietnessScore, naturalLightScore, roomSizeScore, socialScore, publicTransportScore based on the description clues.
Also provide a realistic tradeOff (e.g. compact kitchen, quiet hours rule, or stairs) to ensure transparency for student renters.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            area: { type: Type.STRING },
            monthlyRent: { type: Type.NUMBER },
            utilitiesEstimate: { type: Type.NUMBER },
            description: { type: Type.STRING },
            quietnessScore: { type: Type.NUMBER },
            naturalLightScore: { type: Type.NUMBER },
            roomSizeScore: { type: Type.NUMBER },
            socialScore: { type: Type.NUMBER },
            publicTransportScore: { type: Type.NUMBER },
            desk: { type: Type.BOOLEAN },
            furnished: { type: Type.BOOLEAN },
            amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
            tradeOff: { type: Type.STRING },
            targetStudentProfile: { type: Type.STRING }
          },
          required: ['title', 'area', 'monthlyRent', 'description', 'quietnessScore', 'naturalLightScore', 'desk', 'amenities', 'tradeOff']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ listing: parsed.title ? parsed : fallback, source: 'gemini' });
  } catch (err: any) {
    console.warn('Landlord listing generation error, using fallback:', err?.message || err);
    return res.json({ listing: fallback, source: 'fallback_on_error' });
  }
});

// FEATURE 5: Landlord Portal Stats & Profile
app.get('/api/landlord/profile', (req, res) => {
  res.json({
    landlord: {
      id: 'landlord_elena',
      display_name: 'Elena Gallagher',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      description: 'DCU alumna & local home owner in Glasnevin. Renting quiet, sunlit rooms to respectful postgraduate students for 6 years.',
      contact: {
        email: 'elena.glasnevin@finderr-verified.ie',
        phone: '+353 1 837 0122'
      },
      verified: true,
      prtb_registration: 'RTB-2024-88492-V',
      response_rate: '98%',
      avg_response_time: '1.4 hours'
    },
    metrics: {
      activeListingsCount: 1,
      totalApplicants: 4,
      highCompatibilityCount: 2, // 90%+ compatibility
      scheduledViewings: 1
    }
  });
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
    console.log(`Finderr server listening at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
