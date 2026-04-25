import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TeamsProvider } from "./context/TeamsContext";
import { InviteProvider } from "./context/InviteContext";
import { IssueProvider } from "./context/IssueContext";
import { ProjectProvider } from "./context/ProjectContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Inbox from "./pages/dashboard/Inbox";
import MyIssues from "./pages/dashboard/MyIssues";
import Projects from "./pages/dashboard/Projects";
import Teams from "./pages/dashboard/Teams";
import TeamDetail from "./pages/dashboard/TeamDetail";
import CreateTeam from "./pages/dashboard/CreateTeam";
import Settings from "./pages/dashboard/Settings";
import AcceptInvite from "./pages/AcceptInvite";
import CommandPalette from "./components/CommandPalette";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/app/inbox" />;
};

// AppContent handles keyboard shortcuts and command palette
const AppContent = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useKeyboardShortcuts({
    onCommandPalette: () => setCommandPaletteOpen(true),
    onNewIssue: () => {
      // Trigger new issue modal if on team page
      const event = new CustomEvent("new-issue");
      window.dispatchEvent(event);
    },
    onNewTeam: () => navigate("/app/teams/new"),
    onNewProject: () => {
      // Trigger new project modal
      const event = new CustomEvent("new-project");
      window.dispatchEvent(event);
    },
  });

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        <Route path="/invite/:token" element={<AcceptInvite />} />

        {/* Protected Dashboard Routes under /app */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/inbox" />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="my-issues" element={<MyIssues />} />
          <Route path="projects" element={<Projects />} />
          <Route path="teams" element={<Teams />} />
          <Route path="teams/new" element={<CreateTeam />} />
          <Route path="teams/:teamId" element={<TeamDetail />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {/* Command Palette - only for logged in users */}
      {user && (
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TeamsProvider>
          <InviteProvider>
            <IssueProvider>
              <ProjectProvider>
                <SocketProvider>
                  <NotificationProvider>
                    <Router>
                      <AppContent />
                    </Router>
                  </NotificationProvider>
                </SocketProvider>
              </ProjectProvider>
            </IssueProvider>
          </InviteProvider>
        </TeamsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
