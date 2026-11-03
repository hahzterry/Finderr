# TikTok story upgrade

- Post Bill supports a canonical public TikTok video URL and consent checkbox.
- A written story or a valid TikTok URL is required.
- Discovery cards embed public TikTok videos with an external fallback link.
- Sharing uses native share or clipboard and links to the application with a bill query parameter. The query parameter does not yet select a specific bill on initial load; add routing/deep-link support before promoting it as a direct-to-bill link.
- Submissions remain pending review and are not publicly displayed until verified.
- Storage remains local JSON and is **not durable on serverless Vercel**. A production Supabase migration, authentication, moderation, bill verification, and secure settlement are still required.
- TikTok may prevent some embeds or remove videos; links still work when the video is publicly accessible.
