import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ClubsPage from "./pages/ClubsPage";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ClubDetailsPage from "./pages/ClubDetailsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CreateClub from "./pages/CreateClub";
import CreateEvent from "./pages/CreateEvent";
import { useAuth } from "./hooks/useAuth";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} 
      />

      {/* Protected Routes */}
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
        path="/clubs/:clubId"
        element={
          isAuthenticated ? (
            <Layout>
              <ClubDetailsPage />
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

      {/* ✅ FIXED: Use eventId instead of id */}
      <Route
        path="/events/:eventId"
        element={
          isAuthenticated ? (
            <Layout>
              <EventDetailsPage />
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

      <Route
        path="/create-club"
        element={
          isAuthenticated ? (
            <Layout>
              <CreateClub />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/create-event"
        element={
          isAuthenticated ? (
            <Layout>
              <CreateEvent />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <AppRoutes />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </DarkModeProvider>
  );
}

export default App;
