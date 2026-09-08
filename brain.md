# HAVN Brain

> **Source of truth for AI coding agents working on HAVN.**
>
> Product branding is currently **HAVN**. The repository/project directory and several internal/package/README references still use **CloudForge**. Do not perform a global rename unless explicitly requested.

---

## 1. Project Identity

**Current product name:** HAVN

**Repository / codebase name:** CloudForge

**Original tagline:** `From Code to Cloud.`

**Product category:** Developer deployment platform / DevOps platform

**Product inspiration:** Vercel, Railway, Render, Coolify

**Core vision:** Let a developer connect a Git repository, build it, deploy it, inspect deployment logs, and use an AI assistant to understand deployment/build problems.

HAVN is intended to be a portfolio-grade, production-style project rather than a simple CRUD college project.

## Current Development Status

As of the latest verified milestone:

```text
Authentication (email/password + email verification)   DONE
Project CRUD + PostgreSQL persistence                  DONE
GitHub repository OAuth integration                   DONE
Real repository fetching                              DONE
Real branch fetching                                  DONE
Dashboard project integration                         DONE
Professor-demo polish                                 CURRENT
GitHub Login                                           PENDING
Google Login                                           PENDING
Developer profile                                     PENDING
Project delete UI                                     PENDING
Mock Dashboard cleanup                                PENDING
Docker build engine                                   PLANNED
Deployment engine                                     PLANNED
Deployment logs                                       PLANNED
AI deployment-log assistant                           PLANNED
```

The current Dashboard deployment/build animation is a simulation. It is not a real Docker deployment.


---

## 2. September 15 MVP Scope

The hard MVP scope for September 15 is:

1. Authentication
2. Dashboard
3. Git Integration
4. Docker Build
5. Deployment
6. Deployment Logs
7. AI Assistant Logs (USP)

### Current development strategy

Complete modules sequentially up to Git Integration first.

Do **not** start Docker, deployment, deployment logs, or AI Assistant implementation until the Dashboard + Git Integration milestone is complete and polished.

Target flow:

```text
User
  ↓
Authentication
  ↓
Dashboard
  ↓
Create Project
  ↓
Connect GitHub
  ↓
Fetch Repositories
  ↓
Select Repository
  ↓
Select Branch
  ↓
Link Repository to HAVN Project
```

After this milestone, polish authentication, dashboard, Git integration, error states, loading states, security, and code quality before starting the Docker/deployment pipeline.

---

## 3. Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- Lucide React
- Motion
- GSAP
- Axios
- `@google/genai` is installed for future AI functionality

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma 6.16.2
- PostgreSQL
- bcrypt
- jsonwebtoken
- Axios
- Resend
- Zod
- CORS
- dotenv

### Planned DevOps stack

- Docker
- AWS
- Kubernetes
- GitHub Actions
- Deployment logs
- AI deployment-log assistant

---

## 4. Repository Structure

```text
cloudforge/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── landing/
│   │   ├── layout/
│   │   └── ui/
│   ├── constants/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 5. Runtime Architecture

### Frontend

Development server:

```text
http://localhost:3000
```

Frontend API client:

```text
http://localhost:5000/api
```

`src/services/api.ts` uses Axios and automatically attaches:

```text
Authorization: Bearer <JWT>
```

when a token exists in `localStorage`.

### Backend

Development server:

```text
http://localhost:5000
```

Main Express app:

```text
backend/src/app.ts
```

Server entry:

```text
backend/src/server.ts
```

Routes:

```text
/api/health
/api/auth
```

---

## 6. Backend Architecture Rules

Use the existing architecture:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Prisma
```

Do not introduce a second authentication architecture.

### Important existing utilities

Prisma singleton:

```ts
import prisma from "../lib/prisma";
```

JWT utility:

```ts
import { generateToken, verifyToken } from "../utils/jwt";
```

Do not create `new PrismaClient()` in controllers/services when the existing singleton can be used.

Do not create another JWT implementation.

---

## 7. Database

Current database:

**PostgreSQL**

Current Prisma version:

**6.16.2**

Current models:

### User

```text
User
├── id
├── name
├── email
├── password?
├── avatar?
├── provider
├── emailVerified
├── verificationTokens
├── createdAt
└── updatedAt
```

Important fields:

```text
email        unique
password     nullable
provider     defaults to "credentials"
emailVerified defaults to false
```

### EmailVerificationToken

```text
EmailVerificationToken
├── id
├── tokenHash
├── userId
├── expiresAt
└── createdAt
```

`tokenHash` is unique.

The token has a relation to `User` with cascade delete.

---

## 8. Authentication Status

### Core email/password authentication

**DONE**

Implemented:

- Registration
- Duplicate email protection
- bcrypt password hashing
- Login
- Invalid email/password handling
- JWT generation
- JWT verification
- Protected `/auth/me`
- Protected Dashboard
- Logout
- Registration input validation
- Email verification
- Expiring verification tokens
- Hashed verification tokens
- Single-use verification tokens
- Blocking login for unverified users

### Email verification flow

```text
Signup
  ↓
Create User
  ↓
emailVerified = false
  ↓
Generate random verification token
  ↓
Hash token
  ↓
Store hash + 30 minute expiry
  ↓
Send email through Resend
  ↓
Frontend /verify-email?token=...
  ↓
Backend hashes received token
  ↓
Find token record
  ↓
Check expiry
  ↓
Set emailVerified = true
  ↓
Delete token
```

The frontend uses a `useRef` guard in `VerifyEmail.tsx` to prevent duplicate verification requests caused by React StrictMode.

### Current authentication routes

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/auth/verify-email
POST /api/auth/test-email
```

### Protected route

`src/components/auth/ProtectedRoute.tsx`

The route calls `/auth/me`.

If the token is invalid/expired or the request fails:

```text
localStorage.removeItem("token")
→ redirect to /login
```

---

## 9. JWT

Current payload shape:

```ts
{
  id: user.id,
  email: user.email
}
```

Current JWT generation is handled by:

```text
backend/src/utils/jwt.ts
```

Current configured expiry:

```text
7d
```

Do not replace the existing JWT implementation without a clear reason.

### Security note

The current local development JWT secret is not production-grade.

Before production deployment:

- generate a strong random JWT secret
- keep it backend-only
- never commit `.env`
- never expose secrets to frontend code

---

## 10. Validation

Registration currently uses Zod.

Current registration validation:

```text
name:
  trimmed
  minimum 2 characters
  maximum 50 characters

email:
  trimmed
  valid email
  lowercased

password:
  minimum 8 characters
  maximum 128 characters

unknown fields:
  rejected
```

Validation middleware:

```text
backend/src/middleware/validation.middleware.ts
```

Do not remove validation when adding new routes.

---

## 11. OAuth Status

OAuth is currently a separate, incomplete feature.

### Frontend initiation

`src/pages/Login.tsx` contains:

```text
GitHub → http://localhost:5000/api/auth/github
Google → http://localhost:5000/api/auth/google
```

### Backend initiation routes

Currently present:

```text
GET /api/auth/github
GET /api/auth/google
```

The routes redirect to the provider authorization pages.

### GitHub

Current state:

```text
GitHub authorization page: WORKING
GitHub callback/login flow: NOT COMPLETE
```

Callback planned:

```text
http://localhost:5000/api/auth/github/callback
```

### Google

Current development-session state:

```text
Google authorization page: WORKING
Google account authentication: WORKING
Google callback/user login flow: IN PROGRESS
```

Planned callback:

```text
http://localhost:5000/api/auth/google/callback
```

Planned frontend callback:

```text
http://localhost:3000/oauth/callback
```

### Important OAuth rule

Do not confuse:

```text
OAuth provider authorization
```

with:

```text
HAVN application authentication
```

The provider callback must eventually:

```text
Google/GitHub
  ↓
authorization code
  ↓
exchange for provider access token
  ↓
fetch provider profile
  ↓
find/create HAVN user
  ↓
generate existing HAVN JWT
  ↓
return to frontend
  ↓
store JWT
  ↓
Dashboard
```

OAuth is optional for the current core-auth milestone and must not break email/password authentication.

---

## 12\. Dashboard Status

Dashboard UI exists and the project/repository portion is now connected to real backend data.

### Implemented

- Dashboard protected by existing authentication
- Real project list from `GET /api/projects`
- Real project creation through `POST /api/projects`
- Real GitHub connection status
- Real GitHub repository listing
- Real GitHub branch listing
- Real repository + branch selection
- Selected repository linked to a PostgreSQL Project
- Project data persists after Dashboard refresh

### Remaining mock/demo behavior

`src/data/mockData.ts` still contains mock:

```text
MOCK_PROJECTS
MOCK_DEPLOYMENTS
MOCK_REPOSITORIES
SIMULATED_BUILD_STEPS
```

The GitHub repository flow no longer uses `MOCK_REPOSITORIES`.

The Dashboard still contains mock/demo concepts for deployment history, deployment metrics, build progress, databases, environment variables, and AI assistant.

### Immediate Dashboard polish tasks

- Remove leftover mock projects/repositories such as `dev-master`
- Remove fake deployment metrics and activity
- Remove fake Live URLs
- Replace mock/demo copy with real user/project data
- Add Delete Project UI using `DELETE /api/projects/:id`
- Add project update/rename UI where appropriate
- Add proper empty states
- Add loading/error states
- Add real developer profile information
- Keep planned/unimplemented features clearly separated from real functionality

## 13. Git Integration: Immediate Next Module

This is the current development priority.

### MVP definition

Git Integration is complete when:

1. User can connect GitHub.
2. HAVN can authenticate with GitHub.
3. HAVN can fetch the user's repositories.
4. User can see repositories in the dashboard.
5. User can select a repository.
6. User can select a branch.
7. Repository is linked to a HAVN project.
8. Repository/project relationship is stored in PostgreSQL.
9. User can reconnect/disconnect GitHub safely.
10. Users cannot access another user's repositories/projects through HAVN APIs.

### Scope

**GitHub only.**

Do not add GitLab or Bitbucket for the September 15 MVP.

---

## 14\. Project Management Direction

A real `Project` Prisma model and CRUD API now exist.

Implemented routes:

```text
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

Every project query is scoped to the authenticated `userId`.

The Dashboard can create and fetch real projects, and project data persists in PostgreSQL.

### Remaining project-management work

- Add Delete Project UI
- Add confirmation before deletion
- Add Rename/Edit Project UI where useful
- Add project empty state
- Remove remaining mock project data
- Keep deployment fields honest until a real Deployment model exists

## 15. Planned DevOps Pipeline

Do not implement these until Git Integration is complete and polished.

### Docker Build

Target:

```text
GitHub repository
  ↓
clone repository
  ↓
detect project
  ↓
build Docker image
  ↓
return build status/logs
```

For MVP, prioritize Node.js projects first rather than trying to support every language immediately.

### Deployment

Target:

```text
Docker image
  ↓
container
  ↓
running application
```

AWS/EC2 can become the first real cloud deployment target.

### Deployment Logs

Target:

```text
[time] Cloning repository...
[time] Installing dependencies...
[time] Running build...
[time] Docker image created
[time] Starting container...
[time] Deployment successful
```

Deployment logs should eventually be associated with deployments in the database.

### AI Assistant Logs

This is the primary USP.

The AI should operate on real deployment/build logs.

Beginner mode:

```text
What happened?
Why did it happen?
How do I fix it?
```

Expert mode:

```text
Root cause
Relevant log lines
Technical diagnosis
Recommended fix
```

The AI should explain actual failures rather than act as a generic chatbot.

---

## 16. Current Frontend Routing

Current routes include:

```text
/
 /login
 /signup
 /verify-email
 /dashboard
```

`/dashboard` is protected.

A future OAuth callback route is planned:

```text
/oauth/callback
```

---

## 17. Current Frontend Authentication Services

`src/services/auth.service.ts` provides:

```text
register()
login()
getCurrentUser()
logout()
verifyEmail()
```

Login stores the returned JWT:

```text
localStorage["token"]
```

The Axios API client automatically attaches that token as a Bearer token.

---

## 18. Mock Data

`src/data/mockData.ts` contains mock:

- repositories
- projects
- deployments
- build steps
- product/marketing data

Do not accidentally use mock data in new backend functionality.

When a real module is implemented, replace the corresponding mock behavior intentionally.

---

## 19. Development Commands

### Frontend

Install:

```bash
npm install
```

Run:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Type-check:

```bash
npm run lint
```

### Backend

Install:

```bash
cd backend
npm install
```

Run development server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Start compiled server:

```bash
npm start
```

Prisma:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

---

## 20. Environment Variables

Never place real secrets in this file.

Backend development environment conceptually contains:

```env
DATABASE_URL=
PORT=5000

JWT_SECRET=
JWT_EXPIRES_IN=7d

RESEND_API_KEY=
FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

NODE_ENV=development
```

### Critical secret rule

The uploaded project archive contains a backend `.env`.

Do not commit or share real `.env` values.

Use:

```text
backend/.env.example
```

as the template.

Never expose:

- database passwords
- Resend API keys
- Google client secrets
- GitHub client secrets
- JWT secrets
- Gemini API keys

to the frontend or Git repository.

---

## 21. Security Hardening

Security hardening is a later polish step after the current Git Integration milestone.

Planned items:

- Helmet
- restricted CORS
- request body size limits
- auth rate limiting
- login rate limiting
- registration rate limiting
- verification rate limiting
- JWT configuration validation
- safe authentication error responses
- stronger production JWT secret
- secret management
- input validation review

Do not rewrite the existing authentication architecture just to add security hardening.

---

## 22. Important Coding Rules for AI Agents

### Rule 1: Read this file first

Before modifying HAVN, read `brain.md`.

### Rule 2: Preserve working authentication

Do not rewrite email/password authentication unless the requested task specifically requires it.

### Rule 3: Reuse existing infrastructure

Use:

```text
existing Prisma singleton
existing JWT utility
existing Axios API client
existing authentication middleware
existing validation middleware
```

Do not create duplicates.

### Rule 4: No unnecessary architecture changes

Do not introduce:

- a second ORM
- a second JWT system
- a second API client
- a second authentication system
- unnecessary new database models
- unnecessary state-management libraries

### Rule 5: Keep changes scoped

If the task is Git Integration, do not rewrite the Dashboard styling, authentication, landing page, or deployment engine.

### Rule 6: Build after meaningful changes

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build
```

### Rule 7: Do not fake functionality

Do not use:

- fake OAuth success
- fake repository data when implementing real Git integration
- hardcoded dashboard success states
- setTimeout-based fake deployment logic

Mock data can remain for UI sections that are not implemented yet, but real modules must use real backend data.

### Rule 8: User ownership matters

Any project/repository/deployment API must verify that the authenticated user owns the relevant resource.

---

## 23. Product Branding Notes

The current product branding is **HAVN**.

However, the codebase still contains older CloudForge references, including:

- repository name
- package names
- README
- some email copy
- some mock data
- URLs
- comments

Do not perform a mass rename automatically.

Brand cleanup should be handled deliberately during polishing.

---

## 24\. Current Known Gaps

### Backend

- GitHub Login OAuth callback is not complete
- Google Login OAuth callback is not complete
- GitHub repository disconnect endpoint is not implemented
- No Docker build engine
- No deployment engine
- No Deployment database model yet
- No real deployment log persistence
- No AI deployment-log assistant
- Security hardening is not complete

### Frontend

- Dashboard still contains mock/demo sections that need cleanup
- Delete Project UI is not yet implemented
- Developer profile UI is not yet implemented
- GitHub Login and Google Login are not complete
- Build progress is still simulated
- Deployment UI is not connected to a real deployment engine
- Deployment metrics/history are still mock data
- Database and environment-variable sections are not backed by real APIs
- AI assistant UI/concept exists but real deployment-log analysis is not yet implemented

## 25\. Immediate Task

### Current priority

**Professor Demo Polish**

Dashboard + Project Management + GitHub Repository Integration are implemented and tested. Do not start Docker until this polish pass is complete.

Do this in order:

```text
1. Remove leftover mock Dashboard data
2. Remove fake deployment metrics/activity/URLs
3. Add Delete Project UI using DELETE /api/projects/:id
4. Add project rename/edit UI where useful
5. Add real developer profile display
6. Polish email/password authentication
7. Implement GitHub Login separately from repository integration
8. Implement Google Login
9. Add GitHub disconnect flow
10. Polish loading/error/empty states
11. Verify authentication and project ownership
12. Build and perform a clean end-to-end professor-demo test
```

### After the professor-demo polish

Start the real DevOps pipeline:

```text
Docker Build
↓
Deployment
↓
Deployment Logs
↓
AI Assistant Logs
```

Do not implement fake deployment success states as substitutes for the real deployment engine.

## 26. September 15 Delivery Definition

A convincing MVP should demonstrate:

```text
HAVN
  ↓
Login / Signup
  ↓
Dashboard
  ↓
Create Project
  ↓
Connect GitHub
  ↓
Select Repository
  ↓
Select Branch
  ↓
Repository linked to Project
```

After this is stable:

```text
Docker Build
  ↓
Deployment
  ↓
Deployment Logs
  ↓
AI Assistant
```

The most important product story is:

> **GitHub repository → build → deployment → logs → AI explanation**

That is the core HAVN experience.

---

## 27. Do Not Assume

AI agents must distinguish between:

```text
Implemented
In progress
Planned
Mock UI
```

For example:

```text
Dashboard UI exists
≠
Dashboard backend is complete

GitHub button exists
≠
GitHub integration is complete

Build logs are displayed
≠
Docker build engine exists

AI feature is described in the UI
≠
AI deployment analysis is implemented
```

Always inspect the actual code before claiming a feature is implemented.

---

## 28. Working Philosophy

Build vertically.

Prefer:

```text
Database
  ↓
Backend API
  ↓
Frontend integration
  ↓
Real end-to-end test
  ↓
Polish
```

over building large disconnected pieces.

Do not optimize for the number of files or features.

Optimize for a working end-to-end developer experience.

---

## 29. Final Priority Order

```text
Authentication
    ↓
Dashboard
    ↓
GitHub Repository Integration       ← DONE
    ↓
Professor Demo Polish               ← CURRENT
    ↓
GitHub Login + Google Login
    ↓
Docker Build
    ↓
Deployment
    ↓
Deployment Logs
    ↓
AI Assistant Logs                   ← USP
```

### Current rule

GitHub Repository Integration is done.

Before Docker, finish the professor-demo polish:

- clean remaining mock Dashboard data
- add project deletion
- add developer profile
- polish authentication
- implement GitHub Login
- implement Google Login
- finish GitHub disconnect
- verify loading/error/empty states
- build and test the complete flow

The next major engineering milestone after polish is the real Docker → Deployment pipeline.

### Current verified vertical slice

```text
User
  ↓
Email/password authentication + email verification
  ↓
Protected Dashboard
  ↓
Connect GitHub
  ↓
GitHub OAuth repository integration
  ↓
Fetch real repositories
  ↓
Select repository
  ↓
Fetch real branches
  ↓
Select branch
  ↓
Create HAVN Project
  ↓
Persist Project in PostgreSQL
  ↓
Refresh Dashboard
  ↓
Project remains available
```

The deployment shown in the current Dashboard is still a simulated build/deployment experience. It must not be described as a real deployment until Docker and the deployment engine are implemented.
