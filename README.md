# ApplyTrack 🎯

> Track every job application in one place. Never lose track again.

ApplyTrack is a full-stack job application tracker with a Chrome extension that automatically extracts job details from any job listing page using AI, saving them to your personal dashboard instantly.

---

## 🖥️ Live Demo

- **Dashboard**: [applytrack-eta.vercel.app](https://applytrack-eta.vercel.app)
- **Chrome Extension**: [Chrome Web Store](#) *(pending review)*

---

## ✨ Features

- 🔍 **AI-Powered Extraction** — Automatically extracts company name, role, and source from any job listing page using Groq's LLaMA model
- ⚡ **One Click Save** — Save any job application directly from your browser without switching tabs
- 📊 **Personal Dashboard** — Spreadsheet-style table showing all your applications with full CRUD
- 🔐 **Secure Auth** — JWT-based authentication with bcrypt password hashing
- 🌙 **Dark Mode** — Clean night theme across both the dashboard and extension
- 🔄 **Status Tracking** — Track every application through Applied, Saved, Interviewing, Offer, and Rejected stages
- 📅 **Latest First** — Most recent applications always appear at the top

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS + DaisyUI
- Zustand (state management)
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Groq AI (LLaMA 3.3 70B)

**Chrome Extension**
- Manifest V3
- React + Vite
- Chrome Scripting API
- Chrome Storage API

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 🚀 How It Works

1. Browse any job listing on LinkedIn, Indeed, Foundit, or Wellfound
2. Click the ApplyTrack extension icon
3. AI automatically extracts the company name, role, and source
4. Review the pre-filled form, pick a status, and hit Save
5. Job appears instantly on your dashboard

---

## 🏃 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key

### Backend
```bash
cd backend
npm install
```

Create a `.env` file:
```
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
```

```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:5001
```

```bash
npm run dev
```

### Extension
```bash
cd extension
npm install
npm run build
```

Then load the `dist` folder in Chrome:
1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/dist` folder

---

## 📋 Roadmap

- [ ] Pagination on the dashboard
- [ ] Filter by status (All / Applied / Interviewing / Offer / Rejected)
- [ ] Duplicate URL detection
- [ ] Export to CSV
- [ ] Email notifications for application follow-ups

---

## 👨‍💻 Author

**Adeib** — [GitHub](https://github.com/AdeibArief) · [LinkedIn](https://www.linkedin.com/in/adeib-arief/)

---

## 📄 License

MIT
