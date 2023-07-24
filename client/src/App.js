import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import Books from "./pages/Books";
import Add from "./pages/Add";
import Update from "./pages/Update";
import './App.css';




// Navbar component
function Navbar() {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/add">Add</a></li>
      </ul>
    </nav>
  );
}

function App() {


  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/add" element={<Add />} />
          <Route path="/update/:id" element={<Update />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
