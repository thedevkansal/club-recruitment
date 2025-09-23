import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ClubsPage from "./pages/ClubsPage";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ClubDetailsPage from "./pages/ClubDetailsPage"; // Import the ClubDetailsPage
import { useAuth } from "./hooks/useAuth";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Layout>
              <HomePage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/clubs"
        element={
          isAuthenticated ? (
            <Layout>
              <ClubsPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/events"
        element={
          isAuthenticated ? (
            <Layout>
              <EventsPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/profile"
        element={
          isAuthenticated ? (
            <Layout>
              <ProfilePage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      // Add this route in your App.jsx
      <Route path="/clubs/:clubId" element={<ClubDetailsPage />} />
      <Route path="/clubs" element={<ClubsPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
