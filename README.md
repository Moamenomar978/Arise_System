# ⚔️ ARISE — Solo Leveling Self-Development System

A full-stack gamified self-improvement platform inspired by the **Solo Leveling** anime System.
Turn your real-life goals into RPG quests with stats, leveling, ranks, and the iconic `[SYSTEM]` UI.

## 🎮 Features

- **RPG Stat System** — STR, AGI, VIT, INT, PER, LCK mapped to real-life categories
- **Leveling & XP** — Complete quests to gain experience and level up
- **Hunter Ranks** — Progress from E-Rank to S-Rank based on your level
- **Daily Quests** — Auto-generated daily habits with midnight deadline
- **Penalty Zone** — Miss your dailies and face HP loss (just like the anime!)
- **Achievement System** — Earn titles like "Iron Will" and "Shadow Monarch"
- **Reward Shop** — Spend gold on custom rewards
- **Admin Dashboard** — Manage users, quests, and view analytics
- **Real-time Notifications** — WebSocket-powered `[SYSTEM]` alerts
- **Solo Leveling UI** — Dark theme with electric blue glows and Rajdhani font

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 18 (Standalone, Signals) |
| UI | Angular Material + Custom Dark Theme |
| Backend | NestJS (TypeScript) |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh Tokens) |
| Real-time | Socket.IO |

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on port 27017 (or update `.env`)
- **npm** v9+

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the App

**Start the backend:**
```bash
cd server
npm run start:dev
```
The API will be available at `http://localhost:3000/api`

**Start the frontend (in a separate terminal):**
```bash
cd client
npx ng serve
```
The app will be available at `http://localhost:4200`

### Environment Variables

Edit `server/.env` to configure:
```
MONGODB_URI=mongodb://localhost:27017/arise
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3000
```

## 📁 Project Structure

```
arise/
├── shared/              # Shared TypeScript types & enums
│   ├── enums/           # Rank, StatType, QuestType, Role
│   └── interfaces/      # IPlayer, IQuest, constants
├── server/              # NestJS Backend
│   └── src/
│       ├── auth/        # JWT auth, guards, strategies
│       ├── users/       # User CRUD & roles
│       ├── players/     # Stats, leveling, rank system
│       ├── quests/      # Quest CRUD, daily generation
│       ├── penalties/   # HP system, penalty zone
│       ├── achievements/# Titles & badges
│       ├── notifications/# WebSocket gateway
│       └── shop/        # Reward store
├── client/              # Angular 18 Frontend
│   └── src/app/
│       ├── core/        # Services, guards, interceptors
│       ├── shared/      # SystemAlert, StatBar, XpProgress, RankBadge
│       ├── features/
│       │   ├── auth/    # Login & Register
│       │   ├── player-dashboard/  # Overview, Quests, Stats, Shop
│       │   ├── admin/   # User/Quest Management, Analytics
│       │   └── penalty-zone/
│       └── layouts/     # Player & Admin shell layouts
└── package.json         # Root workspace config
```

## 🎯 API Endpoints

### Auth
- `POST /api/auth/register` — Register new hunter
- `POST /api/auth/login` — Login & get JWT tokens
- `POST /api/auth/refresh` — Refresh access token

### Player
- `GET /api/players/me` — Get current player profile
- `PATCH /api/players/allocate-stats` — Distribute stat points

### Quests
- `GET /api/quests/daily` — Get today's daily quests
- `GET /api/quests` — Browse all quests
- `POST /api/quests/:id/complete` — Complete a quest
- `POST /api/quests` — Create quest (Admin)

### Shop
- `GET /api/shop/items` — List shop items
- `POST /api/shop/purchase/:itemId` — Purchase item

### Admin
- `GET /api/users` — List all users (Admin)
- `PATCH /api/users/:id/role` — Update user role (Admin)

## ⚡ Rank System

| Rank | Level | Color |
|---|---|---|
| E-Rank | 1–10 | Gray |
| D-Rank | 11–25 | Green |
| C-Rank | 26–50 | Blue |
| B-Rank | 51–80 | Purple |
| A-Rank | 81–120 | Gold |
| S-Rank | 121+ | Red (Glowing) |

## 📜 License

MIT
