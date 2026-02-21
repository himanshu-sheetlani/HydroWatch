import Dashboard from "./routes/Dashboard.jsx";
import Report from "./routes/Report.jsx";
import ReportDetail from "./routes/ReportDetail.jsx";
import Login from "./routes/Login.jsx";
import Landing from "./routes/Landing.jsx";
import Settings from "./routes/Settings.jsx";
import {
  ProtectedRoute,
  PublicRoute,
  OnboardGuard,
  OnboardingRoute,
} from "./routes/RouteGuards.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report/:id"
          element={
            <ProtectedRoute>
              <ReportDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;