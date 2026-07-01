# 🚀 CodeVex

**CodeVex** is a full-stack developer analytics platform that transforms GitHub profiles into meaningful insights, rankings, and shareable developer cards.

Built with a scalable architecture using background jobs, scheduled cron workers, caching, and cloud deployment — designed to handle real-world API constraints like rate limiting and heavy data processing.

---

## 🌟 Features

### 📊 Developer Analytics

* Deep insights from GitHub activity
* Custom **DevScore algorithm** based on:

  * Consistency
  * Impact (stars, forks)
  * Activity (recent commits)
  * Diversity (languages)
  * Reach (followers)
* Contribution heatmaps & streak tracking
* **Daily automated analytics refresh** for every tracked user via a Bull cron job — no manual re-fetch needed

---

### 🆚 Compare Developers

* Side-by-side GitHub profile comparison
* Visual breakdown of strengths
* Real-time analytics comparison

---

### 🏆 Leaderboard System

* Global ranking of developers
* Pagination + optimized queries
* Dynamic badge system:

  * 🟡 Elite
  * 🔥 Pro
  * 🚀 Rising Dev
  * 🌿 Intermediate
  * 🌱 Beginner

---

### 🎴 Shareable Developer Cards

* Generate clean, shareable profile cards
* Export using `html2image`
* Perfect for social sharing

---

### ⚡ Performance & Scalability

* Redis caching (multi-layer caching)
* Background job processing using Bull
* **Daily cron-scheduled jobs** (Bull repeatable jobs) to refresh every user's GitHub analytics automatically
* API rate-limit handling using **token rotation**
* Optimized DB queries with Prisma

---

## 🏗️ Architecture

### 🔁 Request Flow

```
User Request → Cache → Database → Compute → Cache → Response
                                        ⬇
                     Background Worker (Bull) → Refresh Data → Update DB + Cache
```

### ⏰ Daily Cron Refresh Flow

```
BullMQ Repeatable Job (runs daily) → Iterate All Tracked Users
        ⬇
Fetch Latest GitHub Data (token-rotated requests)
        ⬇
Recompute DevScore + Stats → Update DB → Refresh Cache
```

This keeps every user's analytics up to date automatically, without waiting for them to visit the app or trigger a manual refresh.

---

### ⚙️ Backend

* Node.js + Express
* Prisma ORM + PostgreSQL (Neon)
* Redis (Caching + Queue)
* Bull(Background Jobs + **Daily Cron Scheduling**)
* Rate Limiting (Express Middleware)
* GitHub GraphQL + REST APIs

---

### 🎨 Frontend

* React (Vite)
* Tailwind CSS + shadcn/ui
* Recharts (Data Visualization)
* React Router

---

### ☁️ DevOps & Deployment

* AWS EC2 / ECS (Containerized deployment)
* Docker
* CI/CD via GitHub Actions
* Domain: **codevex.online**
* Cloudflare (DNS + SSL)

---

## 🔥 Key Engineering Highlights

### 1. 🚫 GitHub Rate Limit Handling

* Implemented **Token Rotation Strategy**
* Uses multiple GitHub tokens
* Increased API limit → **15,000 requests/hour**

---

### 2. ⏰ Daily Cron Job for Analytics Refresh

* Bull **repeatable job** scheduled to run once a day
* Loops through every tracked user and re-fetches their latest GitHub data
* Recomputes DevScore, streaks, and stats automatically in the background
* Distributes requests across rotated tokens to stay within rate limits
* Ensures leaderboard and profile data stay fresh without requiring the user to visit the app

---

### 3. ⚡ Background Data Refresh

* Bull workers refresh user data asynchronously (on-demand and via the daily cron job)
* Keeps API fast while maintaining fresh data

---

### 4. 🧠 Smart Caching Strategy

* Redis used for:

  * Profile caching
  * Repo caching
  * Stats caching
* Reduces API calls drastically

---

### 5. 📉 Optimized Data Storage

* Heavy GitHub data (heatmaps, raw activity) **NOT stored**
* Only lightweight computed stats saved in DB
* Heavy data recomputed when needed

---

### 6. 🏆 Custom DevScore Algorithm

* Weighted scoring system:

  * Consistency (20%)
  * Impact (25%)
  * Activity (15%)
  * Diversity (10%)
  * Repo Score (10%)
  * Reach (20%)

---

## 📸 Screenshots

>
>Compare Two Users Side by Side 
<img width="1920" height="1080" alt="Screenshot (327)" src="https://github.com/user-attachments/assets/bd28be8f-2c36-4180-a606-b1b05cdeab44" />

Generate a shareable github card
<img width="1920" height="1080" alt="Screenshot (326)" src="https://github.com/user-attachments/assets/7e98c9ea-036f-465d-bad9-05bb962299bf" />
LeaderBoard
<img width="1920" height="1080" alt="Screenshot (325)" src="https://github.com/user-attachments/assets/b39d76d5-84df-42cd-922d-0753f0ec6cc3" />
Personal Analytics 
<img width="1920" height="1080" alt="Screenshot (324)" src="https://github.com/user-attachments/assets/cbb1a92e-f8a7-44da-9bf1-3aad1ec3e742" />

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/codevex.git
cd codevex
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env`:

```env
DATABASE_URL=
REDIS_URL=
GITHUB_TOKEN_1=
GITHUB_TOKEN_2=
GITHUB_TOKEN_3=
```

Run:

```bash
npm run dev
```

This also starts the BullMQ worker process, which registers the daily repeatable job for refreshing user analytics.

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📦 Tech Stack

### Backend

* Node.js
* Express
* Prisma
* PostgreSQL (Neon)
* Redis
* Bull (background jobs + daily cron scheduling)

### Frontend

* React (Vite)
* Tailwind CSS
* shadcn/ui
* Recharts

### DevOps

* Docker
* AWS EC2 / ECS
* GitHub Actions
* Cloudflare

---

## 📈 Future Improvements


* 🌍 Country-based leaderboards
* 🤝 Friends leaderboard

---

## 👨‍💻 Author

Built by **Ayush**
Passionate about building scalable systems & developer tools.

---

## ⭐ Show some love

If you like this project, give it a ⭐ on GitHub!



