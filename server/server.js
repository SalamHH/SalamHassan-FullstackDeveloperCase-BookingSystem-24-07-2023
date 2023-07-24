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
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'appollo',
    database: 'booking',
});





app.get("/", (req, res) => {
    res.json("hello this is the backend");
})

// GET request to fetch all bookings from the database
app.get("/booking", (req, res) => {
    const q = "SELECT * FROM booking.bookings"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})




// GET request to fetch a specific booking by its ID
app.get("/booking/:id", (req, res) => {
    const bookingId = req.params.id;
    const q = "SELECT * FROM booking.bookings WHERE id = ?";
    db.query(q, [bookingId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// GET request to fetch bookings for a specific date
app.get("/booking/date/:selectedDate", (req, res) => {
    const selectedDate = req.params.selectedDate;
    const partialDate = `${selectedDate}%`; // Add a '%' to match any date starting with the provided partial date
    const q = "SELECT * FROM booking.bookings WHERE date LIKE ?";
    db.query(q, [partialDate], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// PUT request to update a specific booking by its ID
app.put('/booking/:id', (req, res) => {
    const bookingId = req.params.id;
    const { date, time_range } = req.body;
    const q = 'UPDATE booking.bookings SET `date` = ?, `time_range` = ? WHERE id = ?';
    db.query(q, [date, time_range, bookingId], (err, result) => {
        if (err) return res.send(err);
        return res.json({ message: 'Booking updated successfully!' });
    });
});


// DELETE request to delete a specific booking by its ID
app.delete('/booking/:id', (req, res) => {
    const bookingId = req.params.id;
    const q = 'DELETE FROM booking.bookings WHERE id = ?';
    db.query(q, [bookingId], (err, result) => {
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

    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});


// Start the server and listen on port 8800
app.listen(8800, () => {
    console.log("connected to  backend");
})


