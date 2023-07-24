# bookingAppollo
Booking system for a single meeting room

## Prerequisites
The following versions were used during development:
- Node.js (version 16.10.0)
- MySQL (version 8.0.0) 

## Gettting Started
Follow these steps to run the project locally.

1. Clone the repository

``` git clone https://github.com/SalamHH/bookingAppollo.git ```

2. Backend Setup
**2.1 Install dependencies**
Navigate to the server folder and install the required Node.js packages:

``` cd server ```
``` npm install ```

**2.2 Database configuration**
Ensure that you have MySQL installed and running on your system.
- Create a new MySQL database for the project using your preferred method. For example MySQLWORKBENCH.
- The table should have three rows: 
1. id (INT) as primary key with auto-increment
2. date (varchar(45)) Not NULL
3. time_range (varchar(45)) Not NULL

- Update the database configuration in the server/server.js file with your MySQL credentials:

```
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your-mysql-username',
  password: 'your-mysql-password',
  database: 'your-database-name',
});

```

**2.3 Run the backend server**

``` npm start ```

The backend server should now be running on http://localhost:8800.



3. Frontend Setup
**3.1 Install dependencies**
Navigate to the client folder and install the required packages:

``` cd server ```
``` npm install ```


**3.2 Run Frontend**
``` npm start ```

The frontend should now be accessible at http://localhost:3000.





