# 🚀 CodeVex

**CodeVex** is a full-stack developer analytics platform that transforms GitHub profiles into meaningful insights, rankings, and shareable developer cards.

Built with a scalable architecture using background jobs, caching, and cloud deployment — designed to handle real-world API constraints like rate limiting and heavy data processing.

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
* Export using `html2canvas`
* Perfect for social sharing

---

### ⚡ Performance & Scalability

* Redis caching (multi-layer caching)
* Background job processing using BullMQ
* API rate-limit handling using **token rotation**
* Optimized DB queries with Prisma

---

## 🏗️ Architecture

### 🔁 Request Flow

User Request → Cache → Database → Compute → Cache → Response
⬇
Background Worker (BullMQ) → Refresh Data → Update DB + Cache

---

### ⚙️ Backend

* Node.js + Express
* Prisma ORM + PostgreSQL (Neon)
* Redis (Caching + Queue)
* BullMQ (Background Jobs)
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

### 2. ⚡ Background Data Refresh

* BullMQ workers refresh user data asynchronously
* Keeps API fast while maintaining fresh data

---

### 3. 🧠 Smart Caching Strategy

* Redis used for:

  * Profile caching
  * Repo caching
  * Stats caching
* Reduces API calls drastically

---

### 4. 📉 Optimized Data Storage

* Heavy GitHub data (heatmaps, raw activity) **NOT stored**
* Only lightweight computed stats saved in DB
* Heavy data recomputed when needed

---

### 5. 🏆 Custom DevScore Algorithm

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
* BullMQ

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

* 🔍 Search users globally
* 🌍 Country-based leaderboards
* 📊 Historical trend graphs
* 🤝 Friends leaderboard
* 📱 Mobile optimization

---

## 👨‍💻 Author

Built by **Aether**
Passionate about building scalable systems & developer tools.

---

## ⭐ Show some love

If you like this project, give it a ⭐ on GitHub!
