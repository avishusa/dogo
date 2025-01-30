import React from "react";
import {Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const App: React.FC = () => {
  return (
   
      <Routes>
         <Route path="/" element={<LoginPage />} />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
      </Routes>
  );
};

export default App;
