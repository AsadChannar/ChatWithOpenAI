import React from 'react'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import File from './pages/File.jsx';
import Chat from './pages/Chat.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/file' element={ <File /> } />
        <Route path='/chat' element={ <Chat /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
