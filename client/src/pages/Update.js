import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Add from './Add'; // Reuse the Add component




//this component performs update tasks. re-uses code from add component.
const Update = () => {
  const [bookingData, setBookingData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  //fetch selected booking based on id.
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/booking/${id}`);
        setBookingData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBooking();
  }, [id]);


  //updates the selected mysql row.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8800/booking/${id}`, bookingData);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Add
        defaultValues={bookingData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Update;
