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
import EventDetailsPage from "./pages/EventDetailsPage"; // Import the EventDetailsPage
import CreateClub from "./pages/CreateClub";
import CreateEvent from "./pages/CreateEvent";
import { useAuth } from "./hooks/useAuth";
import { DarkModeProvider } from "./contexts/DarkModeContext";

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
      <Route path="/clubs/:clubId" element={<ClubDetailsPage />} />
      <Route path="/clubs" element={<ClubsPage />} />
      <Route path="/events/:eventId" element={<EventDetailsPage />} />
      <Route path="/create-club" element={<CreateClub />} />
      <Route path="/create-event" element={<CreateEvent />} />

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
