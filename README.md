# Toolslify

Premium multi-tool SaaS platform built with Next.js App Router.

## Included tools

- AI Humanizer
- Assignment Answer Generator
- Meeting Notes to Summary Converter
- Voice Note to Text Converter
- PDF to All Format Converter

## SEO routes

The app also ships with 10 intent-focused SEO landing pages:

- `/humanize-ai-text`
- `/ai-humanizer-free`
- `/ai-paraphraser`
- `/rewrite-ai-text`
- `/ai-rewriter-tool`
- `/ai-detector-free`
- `/undetectable-ai-writer`
- `/ai-content-humanizer`
- `/humanize-essay-ai`
- `/ai-text-improver`

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` and configure as needed:

```bash
NEXT_PUBLIC_SITE_URL=https://www.toolslify.com
OPENAI_API_KEY=
```

Notes:

- `NEXT_PUBLIC_SITE_URL` controls canonical and structured-data URLs.
- `OPENAI_API_KEY` enables uploaded audio transcription in the voice tool API route.
- Live browser speech recognition can still work without `OPENAI_API_KEY` on supported browsers.

## Production features

- Multi-tool SaaS information architecture
- Tailwind-based premium design system
- Dark mode and basic language toggle
- Local history stored in browser storage
- Input sanitization for text and uploads
- Rate limiting at 10 requests per minute per IP
- Security headers via `next.config.mjs`
- Structured data for homepage, tools, and SEO pages
- Sitemap, robots, legal pages, favicon, and manifest

## Build

```bash
npm run build
npm run start
```

## Deployment notes

- Deploy on Vercel or any Node-compatible platform that supports Next.js App Router.
- Set `OPENAI_API_KEY` only if you want uploaded audio transcription enabled.
- PDF conversion currently targets text-based PDFs. OCR for image-only PDFs can be added as a future enhancement.
