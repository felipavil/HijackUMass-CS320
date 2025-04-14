# 🚗 HijackUMass

A rideshare-style web app for UMass Amherst students to coordinate carpooling — whether you **need a ride** or **have a ride to offer**.

## 🔧 Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- More to come ;)

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/felipavil/HijackUMass-CS320.git
cd HijackUMass-CS320

```
### 2. Install dependencies

```bash

npm install

```

### 3. Set up environment variables
To run this project locally, you need to configure environment variables.
There are two .env files, one in the root, one in /server.

1. Copy the example .env file (MacOS):
```bash
cp .env.example .env
```
If you're on Windows:

```bash
copy .env.example .env
```
Then fill in the .env posted on Slack (or somewhere else we agreed to)

## 🚀 Running the App

### 1. Start the backend server

In one terminal window/tab:

```bash
cd server
node index.js
```
This will start your Express backend (e.g. on http://localhost:3000).

### 2. Start the frontend (React)
In a second terminal window/tab:

```bash
cd HijackUMass-CS320/
npm run dev
```
This runs the Vite dev server (usually at http://localhost:5173).

## 🗃️ Database Setup

### Prerequisites

- **PostgreSQL**: Ensure PostgreSQL is installed on your machine.  
  For installation instructions, visit [PostgreSQL Downloads](https://www.postgresql.org/download/).

### Create the Databases

Open a terminal and run the following commands to create the databases:

```bash
For production (or main testing)
createdb carpool

For demo or additional testing
createdb carpool_demo

Run the following commands from the project root (or wherever the SQL files are located):

```bash
psql -d carpool -f carpool.sql
psql -d carpool_demo -f carpool_demo.sql

Then execute SQL queries such as:

SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM matches;
SELECT * FROM ride_history;
SELECT * FROM reviews;

You should see example users like Alice Rider and Bob Driver, along with their associated posts and matches.

## 🛠️ Contributing Guide

### 1. Pull the Latest Code
Make sure you're up to date with the main branch:

```bash
git checkout main
git pull origin main
```

### 2. Create a New Branch
Create and switch to a new branch for your work:

```bash
git checkout -b your-branch-name-please-replace
```
Replace your-feature-name with something short and meaningful, like fix-login-bug or add-footer.

### 3. Make Your Changes
Now make changes to the code in your new branch. Once you're done:

### 4. Add & Commit Your Changes
```bash
git add .
git commit -m "Describe what you changed here"
```

### 5. Push Your Branch to GitHub
```bash
git push origin your-branch-name-please-replace
```
### 6. Open a Pull Request (PR)
Go to the GitHub repo: https://github.com/felipavil/HijackUMass-CS320

GitHub will suggest creating a pull request from your branch

Add a title and description, then submit!
