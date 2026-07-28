import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { WellnessProvider } from "./context/WellnessContext";
import LandingPage from "./pages/LandingPage";
import WellnessCheckPage from "./pages/WellnessCheckPage";
import DashboardPage from "./pages/DashboardPage";
import LifestyleAnalysisPage from "./pages/LifestyleAnalysisPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ModelComparisonPage from "./pages/ModelComparisonPage";

export default function App() {
  return (
    <ThemeProvider>
      <WellnessProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/wellness-check" element={<WellnessCheckPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/lifestyle" element={<LifestyleAnalysisPage />} />
            <Route path="/models" element={<ModelComparisonPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </WellnessProvider>
    </ThemeProvider>
  );
}
