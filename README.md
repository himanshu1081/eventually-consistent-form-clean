
# Eventually Consistent Form (Production Clean)

## Stack
Vite + React 18 + TailwindCSS v3 (PostCSS)

## State Transitions
idle → pending → success  
idle → pending → retrying(n) → success  
idle → pending → retrying(n) → failed  

## Retry Logic
- Retries only on 503
- Max 3 retries
- Exponential backoff (2s, 4s, 6s)

## Duplicate Prevention
1. Prevent double submission via ref lock
2. Each request has unique id
3. Record inserted only if id not already present

## Local Run
npm install
npm run dev

## Production Build
npm run build

Vercel:
- Framework: Vite
- Build Command: npm run build
- Output Directory: dist
