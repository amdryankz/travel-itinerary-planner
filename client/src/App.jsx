import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LanguageProvider } from "./contexts/LanguageProvider";
import BaseLayout from "./layouts/BaseLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/DashboardPage";
import CreateTripPage from "./pages/CreateTripPage";
import AIGenerateTripPage from "./pages/AIGenerateTripPage";
import ManualCreateTripPage from "./pages/ManualCreateTripPage";
import TripDetailPage from "./pages/TripDetailPage";
import EditTripPage from "./pages/EditTripPage";
import ActivityForm from "./pages/ActivityFormPage";

function App() {
  return (
    <>
      <LanguageProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route element={<BaseLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-trip" element={<CreateTripPage />} />
                <Route
                  path="/create-trip/ai"
                  element={<AIGenerateTripPage />}
                />
                <Route
                  path="/create-trip/manual"
                  element={<ManualCreateTripPage />}
                />
                <Route path="/:id" element={<TripDetailPage />} />
                <Route path="/trips/:id/edit" element={<EditTripPage />} />
                <Route
                  path="/trips/:tripId/activities/new"
                  element={<ActivityForm />}
                />
                <Route
                  path="/trips/:tripId/activities/:activityId/edit"
                  element={<ActivityForm />}
                />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </LanguageProvider>
    </>
  );
}

export default App;
