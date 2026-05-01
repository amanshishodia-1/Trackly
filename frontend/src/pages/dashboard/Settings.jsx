import { useState, useEffect } from "react";
import { User, Palette, Bell, Users, Building2, Shield, Moon, Sun, Monitor, Check } from "lucide-react";
import api from "../../lib/axios";
import { useTheme } from "../../context/ThemeContext";

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
  const { theme: currentTheme, density: currentDensity, setTheme: setGlobalTheme, setDensity: setGlobalDensity } = useTheme();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    timezone: "UTC",
    defaultStartPage: "inbox",
  });
  const [appearance, setAppearance] = useState({
    theme: currentTheme || "system",
    density: currentDensity || "comfortable",
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

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
    fetchUserTeams();
    fetchWorkspace();
    // Sync local appearance state with global theme
    setAppearance({ theme: currentTheme, density: currentDensity });
  }, [currentTheme, currentDensity]);

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

  const handleAppearanceChange = (field, value) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
    if (field === "theme") {
      setGlobalTheme(value);
    } else if (field === "density") {
      setGlobalDensity(value);
    }
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
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-1">
                Appearance
              </h3>
              <p className="text-sm text-gray-500">
                Customize how Trackly looks for you.
              </p>
            </div>

            <div className="space-y-8">
              {/* Theme Selection */}
              <div className="space-y-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Interface Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Light", icon: Sun, colors: "bg-white" },
                    { id: "dark", label: "Dark", icon: Moon, colors: "bg-[#0F1115]" },
                    { id: "system", label: "System", icon: Monitor, colors: "bg-gradient-to-br from-white via-gray-400 to-[#0F1115]" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleAppearanceChange("theme", t.id)}
                      className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                        appearance.theme === t.id
                          ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/50"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className={`w-full aspect-video rounded-md mb-1 shadow-sm overflow-hidden ${t.colors} border border-white/5`}>
                        {/* Mock UI content in the preview */}
                        <div className="p-2 space-y-1.5 opacity-40">
                          <div className={`h-1.5 w-2/3 rounded-full ${t.id === 'light' ? 'bg-gray-200' : 'bg-white/10'}`} />
                          <div className={`h-1.5 w-full rounded-full ${t.id === 'light' ? 'bg-gray-100' : 'bg-white/5'}`} />
                          <div className={`h-1.5 w-1/2 rounded-full ${t.id === 'light' ? 'bg-gray-100' : 'bg-white/5'}`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <t.icon className={`w-3.5 h-3.5 ${appearance.theme === t.id ? 'text-indigo-400' : 'text-gray-500'}`} />
                        <span className={`text-[13px] font-medium ${appearance.theme === t.id ? 'text-white' : 'text-gray-400'}`}>
                          {t.label}
                        </span>
                      </div>
                      {appearance.theme === t.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Density Selection */}
              <div className="space-y-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Interface Density
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "compact", label: "Compact", desc: "Maximum information density" },
                    { id: "comfortable", label: "Comfortable", desc: "Default spacing for better clarity" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleAppearanceChange("density", d.id)}
                      className={`relative flex flex-col gap-1 p-4 rounded-xl border text-left transition-all duration-200 ${
                        appearance.density === d.id
                          ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/50"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className={`text-[13px] font-medium ${appearance.density === d.id ? 'text-white' : 'text-gray-300'}`}>
                        {d.label}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {d.desc}
                      </span>
                      {appearance.density === d.id && (
                        <div className="absolute top-4 right-4 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                <p className="text-[12px] text-indigo-300 leading-relaxed">
                  Appearance settings are saved automatically to your profile and will sync across all your devices.
                </p>
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
                    href="/app/teams"
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
    <div className="p-10 max-w-6xl">
      <h1 className="text-3xl font-semibold text-gray-100 mb-10">Settings</h1>

      <div className="flex gap-10">
        {/* Sidebar Tabs */}
        <nav className="w-64 shrink-0">
          <ul className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? "bg-white/5 text-gray-100"
                        : "text-gray-400 hover:bg-white/[0.02] hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-6 h-6 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
