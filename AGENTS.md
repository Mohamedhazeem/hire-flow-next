<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This repository is a Next.js 16 app directory project with TypeScript, Tailwind CSS, and the `next/font` app router.

## Key guidance for AI coding agents

- Use this file as the primary agent customization file for repository-specific behavior.
- Treat `app/` as the main application area. `app/page.tsx` is the current root route.
- Preserve the existing app directory conventions and generated sample structure when making incremental changes.
- Prefer `npm` commands from `package.json`:
  - `npm run dev`
  - `npm run build`
  - `npm run start`
  - `npm run lint`
- There is no separate backend service or API route folder in this starter repository.
- `public/` is available for static assets and images.
- Use TypeScript typings and the app router (`next/navigation`, route groups, server components) appropriate to Next.js 16.
- Do not assume a legacy `pages/` router or older Next.js behavior.

## References

- Base project README: `README.md`
- Next.js docs: https://nextjs.org/docs

<!-- END:nextjs-agent-rules -->
