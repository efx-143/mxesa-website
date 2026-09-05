# MXESA Website

The official website for the **Mechatronics Engineering Student's Association (MXESA)** at Marathwada Mitramandal's Institute of Technology (MMIT), Pune — built with [Next.js](https://nextjs.org) and Firebase.

## About MXESA

MXESA is the premier platform for Mechatronics Engineering students at MMIT Pune, established in the Academic Year 2026–27. The association provides an ecosystem for developing leadership, hands-on organizational skills, and technical excellence by bridging mechanics, electronics, and code.

**Faculty Coordinators:**

- Prof. Shital Khande
- Dr. Yogini Borole

---

## Pages

| Route                 | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `/`                   | Home page — hero, mission, committee, timeline                  |
| `/team`               | Full core committee & team listing                              |
| `/event/sdg-ideathon` | SDG Ideathon event page                                         |
| `/sdg-login`          | Registration / login for SDG Ideathon (Google + Email/Password) |
| `/sdg-dashboard`      | Participant dashboard (requires login)                          |
| `/sdg-join`           | Team creation form                                              |

---

## Getting Started

### Prerequisites

- **Node.js** — install the version matching [`.nvmrc`](.nvmrc). We recommend [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).
- **Firebase project** — required for authentication and Firestore database.

### Installation

```bash
# Install dependencies
npm ci

# Copy the environment template
cp .env.local.example .env.local
```

### Environment Variables

Fill in your Firebase credentials in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SDG_API_BASE_URL=http://localhost:5000
```

### Running Locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication

The SDG Ideathon registration page (`/sdg-login`) supports two sign-in methods:

1. **Email & Password** — sign up for a new account or sign in with an existing one.
2. **Google Sign-In** — one-click sign in with a Google account.

Both methods use **Firebase Authentication**. After successful login, participants are redirected to their personal dashboard (`/sdg-dashboard`).

---

## Backend

A Python/Flask backend lives in the [`backend/`](backend/) directory. It handles SDG Ideathon team registration, idea submissions, and admin operations. See [`backend/requirements.txt`](backend/requirements.txt) for dependencies and [`backend/.env.example`](backend/.env.example) for required environment variables.

---

## Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Framework | Next.js (Pages Router)      |
| Styling   | styled-components           |
| Auth & DB | Firebase (Auth + Firestore) |
| Backend   | Python / Flask              |

---

## Contributing

Found a bug or want to suggest an improvement? Open an issue to discuss it before submitting a pull request. We welcome contributions that improve the student experience or fix bugs.

---

## License

The source code is released under the [Apache License 2.0](LICENSE.md).
