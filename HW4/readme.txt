Database Indexing Performance Demo:
This project demonstrates the impact of database indexing on query performance. It compares execution times between unindexed (sequential scan) and indexed (B-Tree) queries using a PostgreSQL database, a Flask backend, and a React frontend.

Tech Stack:
Database: PostgreSQL
Backend: Python (Flask, Psycopg2, SQLAlchemy)
Frontend: React (Vite, TypeScript, Tailwind CSS)

Setup Instructions
1. Database Initialization
Ensure PostgreSQL is running, then create the database and schema.

# Enter the Postgres shell
psql -U postgres

# Run the following SQL commands:
CREATE DATABASE hw4_db;
\c hw4_db
\i schema.sql
\q

Populate Data:
Run the Python script to import EAFC26.csv into the database.
python data_generation.py

Create Indexes:
Manually create indexes to enable the "Fast Mode" comparison.

-- Connect to DB
psql -U postgres -d hw4_db

-- Run commands
CREATE INDEX idx_name ON players(name);
CREATE INDEX idx_nation_pos ON players(nation, position);


2. Backend (Flask)
Configure the connection in app.py if your credentials differ from the default (postgres/postgres).

# Install dependencies
pip install flask flask-cors psycopg2-binary pandas sqlalchemy numpy

# Start the server (Runs on port 5001)
python app.py

3. Frontend (React)
Open a new terminal window.
cd frontend
# Install packages
npm install
# Start development server
npm run dev

Usage:
Navigate to http://localhost:3000.
The interface is split into two panes:
Left (Red): Forces enable_indexscan = OFF to simulate unindexed performance.
Right (Green): Uses standard optimization to demonstrate indexed performance.
Single Search: Enter a name (e.g., "Ronaldo") to test ILIKE queries.
Join Search: Enter a Nation and Position to test JOIN performance between players and player_stats.

API Endpoints:
1. GET /api/no-index/search
Search by name (Sequential Scan forced)

2. GET /api/with-index/search
Search by name (Index Scan enabled)

3. GET /api/no-index/join
Filter by Nation + Position (Slow Join)

4. GET /api/with-index/join
Filter by Nation + Position (Fast Join)

Project Structure:
app.py: Main Flask application handling DB connections and timing logic.
schema.sql: SQL definitions for players and player_stats tables.
data_generation.py: ETL script to clean and load CSV data.
frontend/: React application source code.