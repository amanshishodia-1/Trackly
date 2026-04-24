import { useState, useEffect } from "react";
import { User, Palette, Bell, Users, Building2, Shield } from "lucide-react";
import api from "../../lib/axios";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "teams", label: "Teams", icon: Users },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "security", label: "Security", icon: Shield },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    timezone: "UTC",
    defaultStartPage: "inbox",
    theme: "system",
    density: "comfortable",
  });
  const [appearance, setAppearance] = useState({
    theme: "system",
    density: "comfortable",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [appearanceSaving, setAppearanceSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [appearanceMessage, setAppearanceMessage] = useState(null);
  const [notifications, setNotifications] = useState({
    issueAssigned: true,
    mentions: true,
    invites: true,
    projectUpdates: true,
  });
  const [notificationsSaving, setNotificationsSaving] = useState(false);
  const [notificationsMessage, setNotificationsMessage] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsMessage, setTeamsMessage] = useState(null);
  const [workspace, setWorkspace] = useState({
    _id: null,
    name: "",
    defaultIssueStatuses: [
      { name: "Backlog", color: "#6B7280", default: false },
      { name: "Todo", color: "#3B82F6", default: true },
      { name: "In Progress", color: "#F59E0B", default: false },
      { name: "Done", color: "#10B981", default: false },
    ],
  });
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceSaving, setWorkspaceSaving] = useState(false);
  const [workspaceMessage, setWorkspaceMessage] = useState(null);
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityMessage, setSecurityMessage] = useState(null);

  // Fetch all settings on mount
  useEffect(() => {
    fetchProfile();
    fetchAppearance();
    fetchNotifications();
    fetchUserTeams();
    fetchWorkspace();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/settings/profile");
      setProfile(data);
    } catch (err) {
      console.error(
        "Failed to load profile:",
        err.response?.data || err.message,
      );
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const { data } = await api.patch("/settings/profile", {
        name: profile.name,
        timezone: profile.timezone,
        defaultStartPage: profile.defaultStartPage,
      });
      setProfile(data);
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      const errorDetails = err.response?.data || { message: err.message };
      console.error("Failed to update profile:", errorDetails);
      setMessage({
        type: "error",
        text:
          errorDetails.message ||
          `Error ${err.response?.status}: Failed to update profile`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const fetchAppearance = async () => {
    try {
      const { data } = await api.get("/settings/appearance");
      setAppearance(data);
      // Also sync with localStorage for immediate UI application
      localStorage.setItem("theme", data.theme);
      localStorage.setItem("density", data.density);
    } catch (err) {
      console.error(
        "Failed to load appearance:",
        err.response?.data || err.message,
      );
      // Fall back to localStorage
      const savedTheme = localStorage.getItem("theme") || "system";
      const savedDensity = localStorage.getItem("density") || "comfortable";
      setAppearance({ theme: savedTheme, density: savedDensity });
    }
  };

  const updateAppearance = async () => {
    try {
      setAppearanceSaving(true);
      setAppearanceMessage(null);
      const { data } = await api.patch("/settings/appearance", {
        theme: appearance.theme,
        density: appearance.density,
      });
      setAppearance(data);
      // Persist to localStorage for immediate UI application
      localStorage.setItem("theme", data.theme);
      localStorage.setItem("density", data.density);
      setAppearanceMessage({
        type: "success",
        text: "Appearance updated successfully",
      });
      // Apply theme immediately
      applyTheme(data.theme);
    } catch (err) {
      console.error(
        "Failed to update appearance:",
        err.response?.data || err.message,
      );
      setAppearanceMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update appearance",
      });
    } finally {
      setAppearanceSaving(false);
    }
  };

  const handleAppearanceChange = (field, value) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
    // Apply immediately to localStorage for responsive UI
    localStorage.setItem(field, value);
    if (field === "theme") applyTheme(value);
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/settings/notifications");
      setNotifications(data);
    } catch (err) {
      console.error(
        "Failed to load notifications:",
        err.response?.data || err.message,
      );
    }
  };

  const updateNotifications = async () => {
    try {
      setNotificationsSaving(true);
      setNotificationsMessage(null);
      const { data } = await api.patch(
        "/settings/notifications",
        notifications,
      );
      setNotifications(data);
      setNotificationsMessage({
        type: "success",
        text: "Notification preferences saved",
      });
    } catch (err) {
      console.error(
        "Failed to update notifications:",
        err.response?.data || err.message,
      );
      setNotificationsMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save notifications",
      });
    } finally {
      setNotificationsSaving(false);
    }
  };

  const handleNotificationToggle = (field) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const fetchUserTeams = async () => {
    try {
      setTeamsLoading(true);
      const { data } = await api.get("/settings/teams");
      setTeams(data);
    } catch (err) {
      console.error("Failed to load teams:", err.response?.data || err.message);
      setTeamsMessage({ type: "error", text: "Failed to load teams" });
    } finally {
      setTeamsLoading(false);
    }
  };

  const leaveTeam = async (teamId) => {
    try {
      await api.post(`/teams/${teamId}/leave`);
      setTeams((prev) => prev.filter((t) => t._id !== teamId));
      setTeamsMessage({ type: "success", text: "Left team successfully" });
      setTimeout(() => setTeamsMessage(null), 3000);
    } catch (err) {
      console.error("Failed to leave team:", err.response?.data || err.message);
      setTeamsMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to leave team",
      });
    }
  };

  const fetchWorkspace = async () => {
    try {
      setWorkspaceLoading(true);
      const { data } = await api.get("/workspace/me");
      setWorkspace({
        _id: data._id,
        name: data.name,
        defaultIssueStatuses: data.defaultIssueStatuses || [
          { name: "Backlog", color: "#6B7280", default: false },
          { name: "Todo", color: "#3B82F6", default: true },
          { name: "In Progress", color: "#F59E0B", default: false },
          { name: "Done", color: "#10B981", default: false },
        ],
      });
    } catch (err) {
      console.error(
        "Failed to load workspace:",
        err.response?.data || err.message,
      );
      setWorkspaceMessage({ type: "error", text: "Failed to load workspace" });
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const updateWorkspace = async () => {
    if (!workspace._id) return;
    try {
      setWorkspaceSaving(true);
      setWorkspaceMessage(null);
      const { data } = await api.patch(`/workspace/${workspace._id}`, {
        name: workspace.name,
        defaultIssueStatuses: workspace.defaultIssueStatuses,
      });
      setWorkspace((prev) => ({
        ...prev,
        name: data.name,
        defaultIssueStatuses: data.defaultIssueStatuses,
      }));
      setWorkspaceMessage({
        type: "success",
        text: "Workspace updated successfully",
      });
    } catch (err) {
      console.error(
        "Failed to update workspace:",
        err.response?.data || err.message,
      );
      setWorkspaceMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update workspace",
      });
    } finally {
      setWorkspaceSaving(false);
    }
  };

  const handleWorkspaceChange = (field, value) => {
    setWorkspace((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (index, field, value) => {
    setWorkspace((prev) => ({
      ...prev,
      defaultIssueStatuses: prev.defaultIssueStatuses.map((status, i) =>
        i === index ? { ...status, [field]: value } : status,
      ),
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
    // Clear message when user starts typing
    if (securityMessage) setSecurityMessage(null);
  };

  const updatePassword = async () => {
    if (!security.currentPassword || !security.newPassword) {
      setSecurityMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (security.newPassword !== security.confirmPassword) {
      setSecurityMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (security.newPassword.length < 6) {
      setSecurityMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      setSecuritySaving(true);
      setSecurityMessage(null);
      await api.patch("/settings/password", {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      setSecurityMessage({
        type: "success",
        text: "Password changed successfully",
      });
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(
        "Failed to change password:",
        err.response?.data || err.message,
      );
      setSecurityMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to change password",
      });
    } finally {
      setSecuritySaving(false);
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-1">
                Profile
              </h3>
              <p className="text-sm text-gray-500">
                Manage your personal information and preferences.
              </p>
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {profile.name ? profile.name[0].toUpperCase() : "U"}
                  </span>
                </div>
                <button className="px-3 py-1.5 text-sm text-gray-300 hover:text-white border border-[#1F2328]/60 rounded-md hover:bg-[#1A1D24]/60 transition-colors">
                  Change avatar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Display name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#1A1D24]/60 border border-[#1F2328]/60 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    placeholder="you@example.com"
                    className="w-full bg-[#1A1D24]/40 border border-[#1F2328]/40 rounded-md px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Timezone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => handleChange("timezone", e.target.value)}
                    className="w-full bg-[#1A1D24]/60 border border-[#1F2328]/60 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Kolkata">India</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Default start page
                  </label>
                  <select
                    value={profile.defaultStartPage}
                    onChange={(e) =>
                      handleChange("defaultStartPage", e.target.value)
                    }
                    className="w-full bg-[#1A1D24]/60 border border-[#1F2328]/60 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="inbox">Inbox</option>
                    <option value="my-issues">My Issues</option>
                    <option value="projects">Projects</option>
                    <option value="teams">Teams</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={updateProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        );
      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-1">
                Appearance
              </h3>
              <p className="text-sm text-gray-500">
                Customize how Trackly looks for you.
              </p>
            </div>

            {appearanceMessage && (
              <div
                className={`p-3 rounded-md text-sm ${
                  appearanceMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {appearanceMessage.text}
              </div>
            )}

            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
                  Theme
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAppearanceChange("theme", "dark")}
                    className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                      appearance.theme === "dark"
                        ? "border-purple-500/50 bg-[#1A1D24]/60"
                        : "border-[#1F2328]/60 hover:border-[#1F2328]"
                    }`}
                  >
                    <div className="w-full h-8 bg-[#0F1115] rounded mb-2 border border-[#1F2328]/60" />
                    <span className="text-xs text-gray-400">Dark</span>
                  </button>
                  <button
                    onClick={() => handleAppearanceChange("theme", "light")}
                    className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                      appearance.theme === "light"
                        ? "border-purple-500/50 bg-[#1A1D24]/60"
                        : "border-[#1F2328]/60 hover:border-[#1F2328]"
                    }`}
                  >
                    <div className="w-full h-8 bg-gray-100 rounded mb-2" />
                    <span className="text-xs text-gray-400">Light</span>
                  </button>
                  <button
                    onClick={() => handleAppearanceChange("theme", "system")}
                    className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                      appearance.theme === "system"
                        ? "border-purple-500/50 bg-[#1A1D24]/60"
                        : "border-[#1F2328]/60 hover:border-[#1F2328]"
                    }`}
                  >
                    <div className="w-full h-8 bg-gradient-to-r from-gray-900 to-gray-100 rounded mb-2" />
                    <span className="text-xs text-gray-400">System</span>
                  </button>
                </div>
              </div>

              {/* Density Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
                  Density
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAppearanceChange("density", "compact")}
                    className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                      appearance.density === "compact"
                        ? "border-purple-500/50 bg-[#1A1D24]/60"
                        : "border-[#1F2328]/60 hover:border-[#1F2328]"
                    }`}
                  >
                    <div className="w-full space-y-1 mb-2">
                      <div className="h-1.5 bg-gray-600 rounded" />
                      <div className="h-1.5 bg-gray-600 rounded" />
                      <div className="h-1.5 bg-gray-600 rounded" />
                    </div>
                    <span className="text-xs text-gray-400">Compact</span>
                  </button>
                  <button
                    onClick={() =>
                      handleAppearanceChange("density", "comfortable")
                    }
                    className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                      appearance.density === "comfortable"
                        ? "border-purple-500/50 bg-[#1A1D24]/60"
                        : "border-[#1F2328]/60 hover:border-[#1F2328]"
                    }`}
                  >
                    <div className="w-full space-y-2 mb-2">
                      <div className="h-2 bg-gray-600 rounded" />
                      <div className="h-2 bg-gray-600 rounded" />
                      <div className="h-2 bg-gray-600 rounded" />
                    </div>
                    <span className="text-xs text-gray-400">Comfortable</span>
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  onClick={updateAppearance}
                  disabled={appearanceSaving}
                  className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
                >
                  {appearanceSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-1">
                Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Choose which notifications you want to receive.
              </p>
            </div>

            {notificationsMessage && (
              <div
                className={`p-3 rounded-md text-sm ${
                  notificationsMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {notificationsMessage.text}
              </div>
            )}

            <div className="space-y-4">
              {[
                {
                  key: "issueAssigned",
                  label: "Issue assigned to me",
                  description: "When someone assigns you an issue",
                },
                {
                  key: "mentions",
                  label: "Mentions",
                  description: "When you are @mentioned in a comment",
                },
                {
                  key: "invites",
                  label: "Invites",
                  description: "When you are invited to a team or project",
                },
                {
                  key: "projectUpdates",
                  label: "Project updates",
                  description: "When projects you follow are updated",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-[#1A1D24]/40 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(item.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      notifications[item.key] ? "bg-indigo-600" : "bg-[#1F2328]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        notifications[item.key]
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={updateNotifications}
                disabled={notificationsSaving}
                className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
              >
                {notificationsSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        );
      case "teams":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-1">Teams</h3>
              <p className="text-sm text-gray-500">
                Manage your team memberships.
              </p>
            </div>

            {teamsMessage && (
              <div
                className={`p-3 rounded-md text-sm ${
                  teamsMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {teamsMessage.text}
              </div>
            )}

            {teamsLoading ? (
              <div className="text-sm text-gray-500">Loading teams...</div>
            ) : teams.length === 0 ? (
              <div className="text-sm text-gray-500">
                You are not a member of any teams yet.
              </div>
            ) : (
              <div className="space-y-2">
                {teams.map((team) => (
                  <div
                    key={team._id}
                    className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-[#1A1D24]/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-indigo-500/15 flex items-center justify-center">
                        <span className="text-indigo-400/80 text-xs font-medium">
                          {team.name[0]}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-300 block">
                          {team.name}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {team.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => leaveTeam(team._id)}
                      className="text-xs text-gray-500 hover:text-red-400 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                    >
                      Leave
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "workspace":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-1">
                Workspace
              </h3>
              <p className="text-sm text-gray-500">
                Manage your workspace settings.
              </p>
            </div>

            {workspaceMessage && (
              <div
                className={`p-3 rounded-md text-sm ${
                  workspaceMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {workspaceMessage.text}
              </div>
            )}

            {workspaceLoading ? (
              <div className="text-sm text-gray-500">Loading workspace...</div>
            ) : (
              <div className="space-y-6">
                {/* Workspace Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Workspace name
                  </label>
                  <input
                    type="text"
                    value={workspace.name}
                    onChange={(e) =>
                      handleWorkspaceChange("name", e.target.value)
                    }
                    placeholder="My Workspace"
                    className="w-full bg-[#1A1D24]/60 border border-[#1F2328]/60 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                {/* Manage Members Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Members
                  </label>
                  <a
                    href="/teams"
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1A1D24]/60 border border-[#1F2328]/60 text-sm text-gray-300 hover:text-gray-200 hover:border-purple-500/30 transition-colors"
                  >
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Manage workspace members</span>
                    <span className="ml-auto text-xs text-gray-500">→</span>
                  </a>
                </div>

                {/* Default Issue Statuses */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-500">
                      Default issue statuses
                    </label>
                    <span className="text-xs text-gray-600">
                      UI preview only
                    </span>
                  </div>
                  <div className="space-y-2">
                    {workspace.defaultIssueStatuses.map((status, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-md bg-[#1A1D24]/40 border border-[#1F2328]/40"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <input
                          type="text"
                          value={status.name}
                          onChange={(e) =>
                            handleStatusChange(index, "name", e.target.value)
                          }
                          className="flex-1 bg-transparent text-sm text-gray-300 focus:outline-none"
                        />
                        <input
                          type="color"
                          value={status.color}
                          onChange={(e) =>
                            handleStatusChange(index, "color", e.target.value)
                          }
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        />
                        {status.default && (
                          <span className="text-xs text-gray-500 px-2 py-0.5 rounded bg-[#1F2328]/60">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Label Management Placeholder */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Labels
                  </label>
                  <div className="p-3 rounded-md bg-[#1A1D24]/40 border border-[#1F2328]/40 border-dashed">
                    <p className="text-sm text-gray-500">
                      Label management coming soon
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Create and manage labels for categorizing issues
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    onClick={updateWorkspace}
                    disabled={workspaceSaving || !workspace._id}
                    className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
                  >
                    {workspaceSaving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-1">
                Security
              </h3>
              <p className="text-sm text-gray-500">
                Manage your account security.
              </p>
            </div>

            {securityMessage && (
              <div
                className={`p-3 rounded-md text-sm ${
                  securityMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {securityMessage.text}
              </div>
            )}

            <div className="space-y-6">
              {/* Change Password Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">
                  Change password
                </h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) =>
                      handleSecurityChange("currentPassword", e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full bg-[#1A1D24]/60 border border-[#1F2328]/60 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    New password
                  </label>
                  <input
                    type="password"
                    value={security.newPassword}
                    onChange={(e) =>
                      handleSecurityChange("newPassword", e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full bg-[#1A1D24]/60 border border-[#1F2328]/60 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) =>
                      handleSecurityChange("confirmPassword", e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full bg-[#1A1D24]/60 border border-[#1F2328]/60 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <button
                  onClick={updatePassword}
                  disabled={securitySaving}
                  className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
                >
                  {securitySaving ? "Updating..." : "Update password"}
                </button>
              </div>

              {/* Active Sessions Placeholder */}
              <div className="space-y-3 pt-4 border-t border-[#1F2328]/40">
                <h4 className="text-sm font-medium text-gray-300">
                  Active sessions
                </h4>
                <div className="p-3 rounded-md bg-[#1A1D24]/40 border border-[#1F2328]/40 border-dashed">
                  <p className="text-sm text-gray-500">
                    Session management coming soon
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    View and manage your active devices and login sessions
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-semibold text-gray-100 mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <nav className="w-48 shrink-0">
          <ul className="space-y-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors text-left ${
                      activeTab === tab.id
                        ? "bg-[#252A33] text-gray-100"
                        : "text-gray-400 hover:bg-[#1A1D24]/60 hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#0F1115] border border-[#1F2328]/60 rounded-lg p-5">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
