import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/axios";

const TeamsContext = createContext();

export const useTeams = () => useContext(TeamsContext);

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/teams");
      setTeams(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/teams/${teamId}`);
      setCurrentTeam(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch team");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeam = async (teamData) => {
    setLoading(true);
    setError(null);
    try {
      console.log("TeamsContext: Creating team with data:", teamData);
      const { data } = await api.post("/teams", teamData);
      console.log("TeamsContext: Team created successfully:", data);
      setTeams((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("TeamsContext: Error creating team:", err);
      setError(err.response?.data?.message || "Failed to create team");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (teamId, teamData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/teams/${teamId}`, teamData);
      setTeams((prev) => prev.map((t) => (t._id === teamId ? data : t)));
      if (currentTeam?._id === teamId) {
        setCurrentTeam(data);
      }
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update team");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/teams/${teamId}`);
      setTeams((prev) => prev.filter((t) => t._id !== teamId));
      if (currentTeam?._id === teamId) {
        setCurrentTeam(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete team");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/teams/${teamId}/join`);
      setTeams((prev) => prev.map((t) => (t._id === teamId ? data : t)));
      if (currentTeam?._id === teamId) {
        setCurrentTeam(data);
      }
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join team");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (teamId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/teams/${teamId}/remove-member`, {
        userId,
      });
      setTeams((prev) => prev.map((t) => (t._id === teamId ? data : t)));
      if (currentTeam?._id === teamId) {
        setCurrentTeam(data);
      }
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = useCallback(
    async (teamId) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/teams/${teamId}`);

        // Update current team if it matches
        if (currentTeam?._id === teamId) {
          setCurrentTeam(data);
        }

        // Update teams list
        setTeams((prev) => prev.map((t) => (t._id === teamId ? data : t)));

        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch team members");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentTeam?._id],
  );

  const getTeamMembers = useCallback(async (teamId) => {
    try {
      const { data } = await api.get(`/teams/${teamId}/members`);
      return data;
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      return [];
    }
  }, []);

  return (
    <TeamsContext.Provider
      value={{
        teams,
        currentTeam,
        loading,
        error,
        fetchTeams,
        fetchTeam,
        fetchTeamMembers,
        getTeamMembers,
        createTeam,
        updateTeam,
        deleteTeam,
        joinTeam,
        removeMember,
        setCurrentTeam,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};
