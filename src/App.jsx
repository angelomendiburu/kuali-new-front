import { useState } from 'react';
import { Button } from './components/ui/button';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../App/Login/page";
import TemplateForm from './components/TemplateForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el login */}
        <Route path="/api/users/login" element={<LoginPage />} />
        <Route path="/api/templates/" element={<TemplateForm />} />
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
