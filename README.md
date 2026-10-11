# CertifyMe Frontend

React frontend for the CertifyMe student and certificate management application.

## Technology stack

- React 19
- Vite 8
- Axios
- Oxlint

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- The CertifyMe Spring Boot backend running on port 8081, unless using a different API URL

## Setup and run

From this directory, install dependencies and start the development server:

```powershell
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Create a production build or run the configured linter with:

```powershell
npm run build
npm run lint
```

## API configuration

The frontend uses `VITE_API_BASE_URL` as its API base URL. If it is not set, the
application uses `http://localhost:8081/api`.

For a local override, create an ignored `.env.local` file in this directory:

```dotenv
VITE_API_BASE_URL=http://localhost:8081/api
```

Vite variables prefixed with `VITE_` are included in browser code. Do not put
passwords, API tokens, or other secrets in this variable or any frontend
environment file.
