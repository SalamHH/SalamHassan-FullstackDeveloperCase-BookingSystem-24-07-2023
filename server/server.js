// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');


// Middleware setup
const app = express();
app.use(express.json())
app.use(cors())


// Create a connection to the MySQL database
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Yonas200',
//     database: 'booking',
// });

// Create a MySQL connection pool
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
  });


  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL server!');
  });
  
  // SQL query to create the 'bookings' table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date VARCHAR(45) NOT NULL,
      time_range VARCHAR(80) NOT NULL
    )
  `;
  
  // Function to create the database and table
  function createDatabaseAndTable() {
    connection.query(`CREATE DATABASE IF NOT EXISTS booking`, function (err) {
      if (err) {
        console.error('Error creating database:', err.message);
      } else {
        console.log('Database "booking" created successfully.');
  
        // Switch to the newly created database
        connection.changeUser({ database: 'booking' }, function (err) {
          if (err) {
            console.error('Error switching to database "booking":', err.message);
          } else {
            // Create the 'bookings' table
            connection.query(createTableQuery, function (err) {
              if (err) {
                console.error('Error creating table:', err.message);
              } else {
                console.log('Table "bookings" created successfully.');
                // Close the connection after creating the table
                //connection.end();
              }
            });
          }
        });
      }
    });
  }
  
  // Call the function to create the database and table
createDatabaseAndTable()


app.get("/", (req, res) => {
    res.json("hello this is the backend");
})

// GET request to fetch all bookings from the database
app.get("/booking", (req, res) => {
    const q = "SELECT * FROM booking.bookings"
    connection.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})




// GET request to fetch a specific booking by its ID
app.get("/booking/:id", (req, res) => {
    const bookingId = req.params.id;
    const q = "SELECT * FROM booking.bookings WHERE id = ?";
    connection.query(q, [bookingId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// GET request to fetch bookings for a specific date
app.get("/booking/date/:selectedDate", (req, res) => {
    const selectedDate = req.params.selectedDate;
    const partialDate = `${selectedDate}%`; // Add a '%' to match any date starting with the provided partial date
    const q = "SELECT * FROM booking.bookings WHERE date LIKE ?";
    connection.query(q, [partialDate], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// PUT request to update a specific booking by its ID
app.put('/booking/:id', (req, res) => {
    const bookingId = req.params.id;
    const { date, time_range } = req.body;
    const q = 'UPDATE booking.bookings SET `date` = ?, `time_range` = ? WHERE id = ?';
    connection.query(q, [date, time_range, bookingId], (err, result) => {
        if (err) return res.send(err);
        return res.json({ message: 'Booking updated successfully!' });
    });
});


// DELETE request to delete a specific booking by its ID
app.delete('/booking/:id', (req, res) => {
    const bookingId = req.params.id;
    const q = 'DELETE FROM booking.bookings WHERE id = ?';
    connection.query(q, [bookingId], (err, result) => {
        if (err) return res.send(err);
        return res.json({ message: 'Booking deleted successfully!' });
    });
});


// POST request to add a new booking to the database
app.post("/booking", (req, res) => {
    const q = "INSERT INTO bookings(`date`, `time_range`) VALUES (?)";

    const values = [
        req.body.date,
        req.body.time_range,

    ];

    connection.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});


// Start the server and listen on port 8800
app.listen(8800, () => {
    console.log("connected to  backend");
})


