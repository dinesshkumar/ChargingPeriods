# Charging Periods Application

This application consists of a React frontend and a Flask backend. The app allows you to manage charging periods with functionalities to add, list and delete periods.

## Prerequisites

Please install this,
- Node.js (version 14.x or later)
- Python (version 3.7 or later)
- PostgreSQL (or another database, if configured differently)

## Setup Instructions

### Backend (Flask)

1. Clone the Repository
Navigate to the Backend Directory, cd ./backend

2. Create and Activate a Virtual Environment using "python -m venv venv" "venv/bin/activate"
3. Install Dependencies, "flask", "flask_sqlalchemy", "flask_migrate", "datetime", "flask_cors" and "re"
4. Configure the Database
In the 11th line in the app.py in the backend folder,
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:123@localhost:5432/ChargingPeriods'

Replace postgres:123 with username:password of the database and ChargingPeriods with database name.

The default syntax would be,
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://{username}:{password}@localhost:5432/{database_name}'

5. Initialize the Database using "flask db init", migrate it using "flask db migrate -m" and "flask db upgrade" to apply migration and create tables.
6. Run the Backend using "flask run"

The backend server will start on `http://localhost:5000`.

### Frontend (React)

1. Navigate to the Frontend Directory, cd ./frontend
2. Install React, "npm install"
Install Dependencies, "date-fns", "bootstrap@5.3.3" and "axios"
3. Run the React Application, "npm start"

The frontend will start on `http://localhost:3000`.


----------------------------------------------------------------------------------------------------

## Design

- My understading of the "Period Code" field in the db model should be 5-10 characters and only allow upper case, lower case, numeric hyphen and underscore.
If the use case is that the "Period Code" field must be 5-10 characters long and must contain at least one letter, one number, one hyphen and one underscore,  line 35,36 should be commented and line 38,39 should be uncommented.

- Added delete button to delete the corresponding charging periods

- Used bootstrap for css

- I have written only unit test case for create charging period, run test case using "pytest test_app.py"
