import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CommandPalette from "./components/CommandPalette";

// ── Eagerly loaded (tiny, above-the-fold) ──────────────────
import LandingPage  from "./pages/LandingPage";
import LoginPage    from "./pages/LoginPage";
import SignupPage   from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

// ── Lazy loaded (automatic code-split per page) ────────────
const DashboardPage        = lazy(() => import("./pages/DashboardPage"));
const IdeasPage            = lazy(() => import("./pages/IdeasPage"));
const AddIdeaPage          = lazy(() => import("./pages/AddIdeaPage"));
const ProfilePage          = lazy(() => import("./pages/ProfilePage"));
const SettingsPage         = lazy(() => import("./pages/SettingsPage"));
const AnalyticsPage        = lazy(() => import("./pages/AnalyticsPage"));
const NotificationsPage    = lazy(() => import("./pages/NotificationsPage"));
const AchievementsPage     = lazy(() => import("./pages/AchievementsPage"));
const GenerateIdeaPage     = lazy(() => import("./pages/GenerateIdeaPage"));
const AIChatPage           = lazy(() => import("./pages/AIChatPage"));
const MarketValidationPage = lazy(() => import("./pages/MarketValidationPage"));
const CompetitorAnalysisPage=lazy(() => import("./pages/CompetitorAnalysisPage"));
const PitchDeckPage        = lazy(() => import("./pages/PitchDeckPage"));
const BusinessPlanPage     = lazy(() => import("./pages/BusinessPlanPage"));
const StartupRadarPage     = lazy(() => import("./pages/StartupRadarPage"));
const RevenueForecastPage  = lazy(() => import("./pages/RevenueForecastPage"));
const SWOTPage             = lazy(() => import("./pages/SWOTPage"));
const RoadmapPage          = lazy(() => import("./pages/RoadmapPage"));
const ValuationPage        = lazy(() => import("./pages/ValuationPage"));
const BrandingPage         = lazy(() => import("./pages/BrandingPage"));
const KanbanPage           = lazy(() => import("./pages/KanbanPage"));
const UnitEconomicsPage    = lazy(() => import("./pages/UnitEconomicsPage"));
const InvestorCRMPage      = lazy(() => import("./pages/InvestorCRMPage"));
const CanvasPage           = lazy(() => import("./pages/CanvasPage"));
const StartupHealthPage    = lazy(() => import("./pages/StartupHealthPage"));

// ── Loading fallback ───────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-base)",
      flexDirection: "column",
      gap: 14,
    }}>
      <div style={{
        width: 42, height: 42,
        border: "3px solid var(--border-default)",
        borderTopColor: "var(--gold)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
      <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
        Loading...
      </span>
    </div>
  );
}

// Helpers for cleaner JSX
const PR  = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;
const LZ  = ({ children }) => <Suspense fallback={<PageLoader />}>{children}</Suspense>;
const PL  = ({ children }) => <PR><LZ>{children}</LZ></PR>;

function App() {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handle = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  return (
    <BrowserRouter>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#111827",
            color: "#f9fafb",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            maxWidth: "420px",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#000" } },
          error:   { iconTheme: { primary: "#ef4444", secondary: "#000" } },
        }}
      />

      <Routes>
        {/* ── Public ── */}
        <Route path="/"             element={<LandingPage />} />
        <Route path="/landingpage"  element={<LandingPage />} />
        <Route path="/home"         element={<LandingPage />} />
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/signup"       element={<SignupPage />} />

        {/* ── Core Workspace ── */}
        <Route path="/dashboard"     element={<PL><DashboardPage /></PL>} />
        <Route path="/ideas"         element={<PL><IdeasPage /></PL>} />
        <Route path="/add-idea"      element={<PL><AddIdeaPage /></PL>} />
        <Route path="/add-idea/:id"  element={<PL><AddIdeaPage /></PL>} />
        <Route path="/profile"       element={<PL><ProfilePage /></PL>} />
        <Route path="/settings"      element={<PL><SettingsPage /></PL>} />
        <Route path="/analytics"     element={<PL><AnalyticsPage /></PL>} />
        <Route path="/notifications" element={<PL><NotificationsPage /></PL>} />
        <Route path="/achievements"  element={<PL><AchievementsPage /></PL>} />

        {/* ── AI Studio ── */}
        <Route path="/generate"          element={<PL><GenerateIdeaPage /></PL>} />
        <Route path="/generate-idea"     element={<PL><GenerateIdeaPage /></PL>} />
        <Route path="/ai-chat"           element={<PL><AIChatPage /></PL>} />
        <Route path="/validate"          element={<PL><MarketValidationPage /></PL>} />
        <Route path="/competitors"       element={<PL><CompetitorAnalysisPage /></PL>} />
        <Route path="/pitch"             element={<PL><PitchDeckPage /></PL>} />
        <Route path="/business-plan"     element={<PL><BusinessPlanPage /></PL>} />
        <Route path="/radar"             element={<PL><StartupRadarPage /></PL>} />
        <Route path="/revenue-forecast"  element={<PL><RevenueForecastPage /></PL>} />
        <Route path="/swot"              element={<PL><SWOTPage /></PL>} />
        <Route path="/roadmap"           element={<PL><RoadmapPage /></PL>} />
        <Route path="/valuation"         element={<PL><ValuationPage /></PL>} />
        <Route path="/branding"          element={<PL><BrandingPage /></PL>} />
        <Route path="/projects"          element={<PL><KanbanPage /></PL>} />
        <Route path="/unit-economics"    element={<PL><UnitEconomicsPage /></PL>} />
        <Route path="/investor-crm"      element={<PL><InvestorCRMPage /></PL>} />
        <Route path="/canvas"            element={<PL><CanvasPage /></PL>} />
        <Route path="/health"            element={<PL><StartupHealthPage /></PL>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
