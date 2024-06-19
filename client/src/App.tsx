import { useState } from 'react'
import React from 'react'
import Main from './components/Main'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Chat from './components/Chat';
import './App.css'

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #e9ecef;
`;


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/users" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
