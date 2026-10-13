# 🚀 DevDash — Developer Portfolio Dashboard

A full-stack MERN application that auto-aggregates your GitHub and LeetCode activity into a beautiful developer dashboard with auto-generated resume and portfolio.

![DevDash](https://img.shields.io/badge/MERN-Stack-00ff88?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb)
![Express](https://img.shields.io/badge/Express.js-000?style=flat-square&logo=express)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Overview Dashboard** | Commit activity charts, LeetCode stats, AI insights |
| 🐙 **GitHub Integration** | Auto-sync repos, stars, followers, language distribution |
| 💻 **LeetCode Tracker** | Easy/Medium/Hard breakdown, ranking, streak |
| 📄 **Resume Builder** | Add experience, education, projects — export to text |
| 🌐 **Portfolio Generator** | Auto-generated public portfolio from your data |
| ⚙️ **Settings** | Connect GitHub/LeetCode usernames, edit profile |
| 🔄 **Auto-Sync** | Data refreshes every 6 hours automatically |
| 🤖 **AI Insights** | Personalized tips based on your activity |

---

## 🛠 Tech Stack

**Frontend:** React 18 + Vite, TailwindCSS, Recharts, React Router v6  
**Backend:** Node.js, Express.js, JWT Authentication  
**Database:** MongoDB with Mongoose  
**External APIs:** GitHub REST API, LeetCode GraphQL API  
**Scheduler:** node-cron (auto-sync every 6 hours)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd devdash
```

### 2. Setup the server
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Setup the client
```bash
cd ../client
npm install
```

### 4. Start development
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

Or from root with concurrently:
```bash
npm install
npm run dev
```

### 5. Open the app
Visit `http://localhost:3000`

---

## ⚙️ Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devdash
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000
GITHUB_TOKEN=optional_but_recommended
```

> **GitHub Token:** Without it, you get 60 API requests/hour. With it: 5,000/hour.  
> Create at: https://github.com/settings/tokens (no scopes needed for public data)

---

## 📁 Project Structure

```
devdash/
├── server/
│   ├── models/
│   │   └── User.js           # MongoDB schema (includes cached stats)
│   ├── routes/
│   │   ├── auth.js           # Login, register, /me
│   │   ├── dashboard.js      # GitHub & LeetCode sync
│   │   ├── profile.js        # Profile CRUD
│   │   └── resume.js         # Resume CRUD
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   └── index.js              # Express app + cron scheduler
│
└── client/
    └── src/
        ├── context/
        │   └── AuthContext.jsx   # Auth state + axios instance
        ├── components/
        │   └── DashboardLayout.jsx  # Sidebar + layout
        ├── pages/
        │   ├── AuthPage.jsx         # Login/Register
        │   ├── Overview.jsx         # Main dashboard
        │   ├── GitHubPage.jsx       # GitHub stats
        │   ├── LeetCodePage.jsx     # LeetCode stats
        │   ├── ResumePage.jsx       # Resume builder
        │   ├── PortfolioPage.jsx    # Portfolio preview
        │   └── SettingsPage.jsx     # Profile settings
        └── App.jsx                  # Routes
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get all stats |
| POST | `/api/dashboard/sync` | Force sync GitHub + LeetCode |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| PUT | `/api/profile` | Update profile |
| GET | `/api/profile/:githubUsername` | Public profile |

### Resume
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/resume` | Get resume |
| PUT | `/api/resume` | Update entire resume |
| POST | `/api/resume/experience` | Add experience |
| POST | `/api/resume/project` | Add project |

---

## 🎨 Design System

- **Colors:** Electric green `#00ff88`, Void black `#060810`, Neon purple `#7c3aed`
- **Fonts:** Space Mono (display), DM Sans (body), Fira Code (code/labels)
- **Theme:** Cyberpunk terminal aesthetic with subtle glow effects

---

## 🚧 Roadmap

- [ ] OAuth with GitHub
- [ ] PDF resume export
- [ ] Public shareable portfolio URL
- [ ] Codeforces integration
- [ ] Contribution heatmap (GitHub-style calendar)
- [ ] Mobile responsive design
- [ ] Email notifications for milestones

---

## 📝 License
MIT
