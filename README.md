# Better Auth Starter

Production‑ready authentication & account management starter for
[Next.js 15](https://nextjs.org) (App Router) using
[Better Auth](https://better-auth.com),
[Drizzle ORM](https://orm.drizzle.team) (PostgreSQL),
[Tailwind CSS](https://tailwindcss.com) v4, [shadcn/ui](https://ui.shadcn.com),
and prebuilt flows from
[@daveyplate/better-auth-ui](https://better-auth-ui.com/).

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/your-org/better-auth-starter.git
   cd better-auth-starter
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create `.env.local`
   ```bash
   cp .env.example .env.local
   # then fill:
   # DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DB
   # GOOGLE_CLIENT_ID=...
   # GOOGLE_CLIENT_SECRET=...
   ```
4. (If using Neon) Create a new Neon project and copy the pooled connection string into `DATABASE_URL`.
5. Push the schema to your database (creates auth tables)
   ```bash
   npm run db:push
   ```
6. (Optional) Open Drizzle Studio to inspect tables
   ```bash
   npm run db:studio
   ```
7. Start the dev server
   ```bash
   npm run dev
   ```
8. Visit `http://localhost:3000/auth/sign-in` and use Google sign‑in.

Next steps: add more OAuth providers, enable email/password, or extend the `user` table.

## Stack

| Layer                | Tech                          | Notes                                                      |
| -------------------- | ----------------------------- | ---------------------------------------------------------- |
| Framework            | Next.js 15 (App Router, RSC)  | TurboPack dev server enabled                               |
| Auth Core            | better-auth                   | Google social login enabled; credentials-ready (commented) |
| Auth UI              | @daveyplate/better-auth-ui    | Prebuilt sign-in / sign-up / reset / account views         |
| DB / ORM             | Drizzle ORM + Postgres (Neon) | Typed schema + migrations (drizzle-kit)                    |
| Styling              | Tailwind CSS v4 + next-themes | Dark / light mode                                          |
| Component Primitives | shadcn/ui + Radix             | Headless accessible components                             |

## Features

- Social login: Google (easy to add more providers)
- (Optional) email + password flow scaffolded (commented – enable when ready)
- Account management pages (profile, sessions, security) pre-rendered statically
- Protected routes via Next.js Middleware cookie check
- Fully typed Drizzle schema for auth tables (`user`, `session`, `account`, `verification`)
- Server auth instance (`auth`)
- Light / dark theme toggle
- Ready for serverless Postgres (Neon) out of the box

## Project Structure

```
src/
	app/
		auth/[path]/page.tsx        # Auth flows (sign-in, sign-up, reset, etc.) generated from UI lib
		account/[path]/page.tsx     # Account management routes
		layout.tsx                  # Root layout & providers
		page.tsx                    # Example landing page
	auth/
		index.ts                    # better-auth server configuration
		client.ts                   # better-auth React client helpers
	db/
		schema.ts                   # Drizzle schema definitions
		index.ts                    # Drizzle init (Postgres driver)
	middleware.ts                 # Protect selected routes
	components/                   # Shared UI (header, theme toggle, primitives)
	lib/utils.ts                  # Utility functions
```

Auth & account routes are static‑param generated for pre-rendering. `generateStaticParams()`
enumerates allowed path segments from the UI library exports (`authViewPaths`,
`accountViewPaths`).

## Environment Variables

Create a `.env.local` (never commit) with:

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DB"
GOOGLE_CLIENT_ID="your-google-oauth-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

Recommended (Neon): copy the pooled connection string for serverless usage.

If you later enable email/password or magic links you may need additional SMTP variables (not included yet).

## Database & Drizzle

Generate / push schema (Drizzle uses the TypeScript schema as source of truth):

```bash
npm run db:push     # Push schema to database
npm run db:studio   # Visual schema browser
```

Tables defined:

- `user`: core profile & metadata
- `session`: active sessions (token, expiry, ip, userAgent)
- `account`: OAuth provider accounts + tokens
- `verification`: short‑lived verifications (email, password reset, etc.)

## Auth Configuration (Server)

Defined in `src/auth/index.ts`:

```ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
});
```

Uncomment the `emailAndPassword` block to add credentials flow.

## Protecting Routes

`src/middleware.ts` checks for a session cookie and redirects unauthenticated users to `/auth/sign-in?redirectTo=...` for paths matched by:

```ts
export const config = { matcher: ["/auth/settings"] };
```

Add more paths (e.g. `/dashboard`, `/billing`) as you build private areas.

Server components can also call `auth.session()` (or similar helper) directly; client components can use hooks from `better-auth/react`.

## Theming

Powered by `next-themes` and Tailwind CSS v4. The `mode-toggle` component switches between `light` and `dark`.

## Local Development

Follow the steps in Getting Started. Then visit http://localhost:3000/auth/sign-in.

## Adding Another OAuth Provider

Add provider credentials (e.g. GitHub) then extend `socialProviders` in `src/auth/index.ts`. Add corresponding env vars and restart.

## Troubleshooting

| Issue                   | Fix                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| OAuth redirect mismatch | Ensure exact redirect URI in provider console matches deployed URL + `/api/auth/callback/google` |
| Sessions not persisting | Check domain / path of cookie; verify `nextCookies()` plugin included last                       |
| DB errors on startup    | Confirm `DATABASE_URL` & run `npm run db:push` to create tables                                  |
| Provider button absent  | Ensure provider configured & env vars present at build time                                      |

## License

MIT – use freely in commercial or personal projects.

---

Happy building! PRs & improvements welcome.
