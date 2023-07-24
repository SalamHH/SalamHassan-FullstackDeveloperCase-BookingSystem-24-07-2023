import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Add.css"





const Add = ({ defaultValues, handleSubmit }) => {
  // State variables for managing form data and error messages
  const [error, setError] = useState(false)
  const [startDate, setStartDate] = useState(defaultValues?.date ? new Date(defaultValues.date) : new Date());
  const [bookings, setBookings] = useState([])
  const [dateSelected, setDateSelected] = useState(false); // Track if a date has been selected

  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('17:00');
  const [timeString, setTimeString] = useState("07:00-17:00");
  const [formValid, setFormValid] = useState(false);
  const [book, setBook] = useState({
    time_range: "",
    date: "",

  });
  const [handleDateChangeCalled, setHandleDateChangeCalled] = useState(false);
  const [handleTimeChangeCalled, setHandleTimeChangeCalled] = useState(false);





  const [errorMessage, setErrorMessage] = useState('');
  const [weekendErrorMessage, setWeekendErrorMessage] = useState('');

  const navigate = useNavigate()

  //handles the "Start Time" input's changes and making sure the selected time range is valid, doesn't overlap with existing bookings, and meets the necessary conditions
  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    if (newStartTime > endTime) {
      setErrorMessage('Start time cannot be later than end time.');
    } else if (newStartTime < '07:00' || newStartTime > '17:00') {
      setErrorMessage('Selected time must be between 7 am and 5 pm.');
    } else {
      setErrorMessage('');

      // Calculate duration in minutes
      const start = new Date(`2023-01-01 ${newStartTime}`);
      const end = new Date(`2023-01-01 ${endTime}`);
      const durationInMinutes = (end - start) / 60000;

      if (durationInMinutes > 180) {
        setErrorMessage('Duration cannot be longer than 3 hours.');
      } else {
        setTimeString(`${newStartTime}-${endTime}`);
        setBook((prevBook) => ({ ...prevBook, time_range: `${newStartTime}-${endTime}` }));
      }
    }
    setFormValid(!!startDate && !!timeString);
  };

  //handles the "End Time" input's changes and making sure the selected time range is valid, doesn't overlap with existing bookings, and meets the necessary conditions
  const handleEndTimeChange = useCallback((e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    if (newEndTime < startTime) {
      setErrorMessage('End time cannot be earlier than start time.');
    } else if (newEndTime < '07:00' || newEndTime > '17:00') {
      setErrorMessage('Selected time must be between 7 am and 5 pm.');
    } else {
      setErrorMessage('');

      // Calculate duration in minutes
      const start = new Date(`2023-01-01 ${startTime}`);
      const end = new Date(`2023-01-01 ${newEndTime}`);
      const durationInMinutes = (end - start) / 60000;

      if (durationInMinutes > 180) {
        setErrorMessage('Duration cannot be longer than 3 hours.');
      } else {
        setTimeString(`${startTime}-${newEndTime}`);
        setBook((prevBook) => ({ ...prevBook, time_range: `${startTime}-${newEndTime}` }));
      }
    }
    setFormValid(!!startDate && !!timeString);
  }, [startDate, startTime, timeString]);


  // Function to check for overlap between time strings
  const checkOverlap = (time1, time2) => {
    const [start1, end1] = time1.split("-");
    const [start2, end2] = time2.split("-");
    return start1 < end2 && end1 > start2;
  };

  // Function to check if the selected time range overlaps with any existing booking
  const isOverlapping = () => {
    for (const booking of bookings) {
      if (checkOverlap(timeString, booking.time_range)) {
        return true;
      }
    }
    return false;
  };


  // Function to check if the selected date is a weekend (Saturday or Sunday)
  const isWeekend = (selectedDate) => {
    const dayOfWeek = selectedDate.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
  };




  //retrieves the existing bookings from the server for a specific date
  const fetchBookingsByDate = async (selectedDate) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];//removes unnecessary parts of the date.
      const res = await axios.get(`http://localhost:8800/booking/date/${formattedDate}`);
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //updates the booking object state with the selected date and performs necessary actions based on the selected date. also fetches relevant bookings to display.
  const handleDateChange = useCallback((date) => {
    setStartDate(date);
    setBook((prev) => ({ ...prev, date: date.toISOString() }));
    // ^ Stores the selected date in the 'date' property of the book state as an ISO string
    setDateSelected(true);


    fetchBookingsByDate(date);
    setFormValid(!!date && !!timeString);
    if (isWeekend(date)) {
      setWeekendErrorMessage("Weekend bookings are not allowed.");
    } else {
      setWeekendErrorMessage("");
    }

  }, [timeString]);


  //posts the user input to mysql database. 
  const handleClick = async (e) => {
    e.preventDefault();
    if (!formValid || errorMessage || weekendErrorMessage) {
      // Check form validity and error message before submitting
      alert("form not valid, edit your input")

      return;
    }
    if (isOverlapping()) {
      alert("Selected time range overlaps with an existing booking!");
      return;
    }

    try {
      await axios.post("http://localhost:8800/booking", book);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  console.log(book);



  //get all existing bookings.
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:8800/booking")
        setBookings(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetch()
  }, [])


  //ensures that default time is set on page start
  useEffect(() => {
    if (!handleTimeChangeCalled) {
      handleEndTimeChange({
        target: { value: '17:00' },
      });
      setHandleTimeChangeCalled(true); // Set to true once it's called once

    }




  }, [handleEndTimeChange,handleTimeChangeCalled]);


  //ensures that default date is set on page start
  useEffect(() => {
    if (!handleDateChangeCalled) {
      handleDateChange(startDate);
      setHandleDateChangeCalled(true); // Set to true once it's called once
    }
  }, [handleDateChange, handleDateChangeCalled, startDate]);



  return (
    <div className='form'>
      <h1>{defaultValues ? 'Update' : 'Add new'} booking</h1>

      <h2>Select Date</h2>
      {error && "Something went wrong!"}
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        minDate={new Date()}

      />
      {startDate && <p>Selected Date: {startDate.toLocaleDateString()}</p>}
      {weekendErrorMessage && <p style={{ color: 'red' }}>{weekendErrorMessage}</p>}



      <h2>Select Time Range</h2>
      <div className='timeInput'>
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            min="07:00"
            max={endTime}
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
            min={startTime}
            max="17:00"
          />
        </div>
        <p>Selected Time Range: {timeString}</p>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}



      </div>








      <button onClick={handleClick} disabled={!formValid}>
        Add
      </button>

      <h1>current bookings for date</h1>



      {/* Conditionally render the bookings only when a date is selected */}
      {dateSelected && (
        <div className="booking">
          {bookings.map((booking) => (
            <div className="book" key={booking.id}>
              <h2>{new Date(booking.date).toLocaleDateString()}</h2>
              <h2>{booking.time_range}</h2>
            </div>
          ))}
        </div>
      )}

    </div>


  )
}

export default Add