import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";
import "../styles/books.css"


const Books = () => {
  const [bookings, setBookings] = useState([])


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


  // Function to handle the delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/booking/${id}`);
      // After successful delete, update the state to remove the deleted item
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
    } catch (err) {
      console.log(err);
    }
  };





  const extractDate = (dateString) => {
    return dateString.split('T')[0];
  };

  return (
    <div className='bookingWrapper'>
      <h1>Bookings</h1>
      <div className="BtnToAddPageContainer">
        <button className="BtnToAddPage">
          <Link to="/add" className="add-button-link">
            Book Room
          </Link>
        </button>
      </div>
      <div className='booking'>
        {bookings.map((book) => (
          <div className='book' key={book.id}>
            <h2>{extractDate(book.date)}</h2>
            <h2>{book.time_range}</h2>
            <h4>Room order Id: {book.id}</h4>


            <div className="BtnButtonsContainer">
              <button className="BtnToUpdatePage">
                {/* Pass the booking ID as a URL parameter to the Update page */}
                <Link to={`/update/${book.id}`} className="update-button-link">
                  Update
                </Link>
              </button>
              <button className="BtnToDeletePage" onClick={() => handleDelete(book.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Books