CoffeeApp

A simple app to help people decide who should pay for coffee

Program Assumptions:

- Not being used by multiple groups
- People and orders in group can change
- App uses in memory storage so being shut down between usages results in memory of previous orders being wiped

Run instructions:

Need to have `NodeJS` installed

Backend:

Navigate to `/backend` and run:

`./.venv/bin/python3 -m flask run`

Frontend:

Navigate to `/frontend` and run

`npm install`

`npm start` - to run in your local browser at [http://localhost:3000](http://localhost:3000) 

Future Goals

- Persistent storage
  - start with local text file
  - move to database for scalable solution
- Login by group name/id to allow for multiple groups to use