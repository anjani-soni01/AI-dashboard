# AI Notice Board Backend

Node.js + Express + MongoDB backend for the AI Notice Board System report.

## Setup

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

For production-style start:

```bash
cd server
npm start
```

## Required services

- MongoDB must be running locally or available through `MONGO_URI`.
- `OPENAI_API_KEY` is optional. Without it, `/api/ai/summarize` returns a local fallback summary.
- OCR uses `tesseract.js` locally through `/api/ocr/extract`.

## Main API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/user/profile`
- `PUT /api/user/profile/preferences`
- `POST /api/user/bookmarks/:id`
- `GET /api/user/bookmarks`
- `GET /api/notices`
- `GET /api/notices/:id`
- `POST /api/notices`
- `PUT /api/notices/:id`
- `DELETE /api/notices/:id`
- `GET /api/notices/:id/summary`
- `GET /api/reminders/user`
- `PUT /api/reminders/user`
- `POST /api/ai/summarize`
- `POST /api/ocr/extract`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`
