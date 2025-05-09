import { useState } from 'react';
import { Button } from './components/ui/button';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../App/Login/page";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el login */}
        <Route path="/api/users/login" element={<LoginPage />} />
        {/* Ruta por defecto o de ejemplo */}
        <Route
          path="/"
          element={
            <main className="flex justify-center align-center h-[100vh]">
              <h1>Bienvenido a Kuali</h1>
            </main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
