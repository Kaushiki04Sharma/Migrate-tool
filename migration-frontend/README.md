# MigrateTool — Frontend

React + Vite frontend for the Database Migration Tool.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open http://localhost:3000 in your browser.

> Make sure your backend is running on port 5000 first:
> ```bash
> node server.js
> ```

## Project Structure

```
src/
  api/          → axios instance (talks to localhost:5000)
  components/   → Navbar, StatCard, StatusBadge, LogsPanel, CreateMigrationModal
  pages/        → Login, Dashboard
  App.jsx       → routing
  main.jsx      → entry point
  index.css     → global styles
```

## Roles

| Role       | Can do                            |
|------------|-----------------------------------|
| viewer     | View migrations only              |
| developer  | View + Create migrations          |
| admin      | View + Create + Run + Rollback    |
