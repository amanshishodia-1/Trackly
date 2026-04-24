import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/axios";

const InviteContext = createContext();

export const useInvites = () => useContext(InviteContext);

export const InviteProvider = ({ children }) => {
  const [pendingInvites, setPendingInvites] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendingInvites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/invites/pending");
      setPendingInvites(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch invites");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInboxInvites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/inbox");
      setPendingInvites(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch inbox");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSentInvites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/invites/sent");
      setSentInvites(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch sent invites");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeamInvites = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/invites/team/${teamId}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch team invites");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const sendInvite = async (email, teamId, role = "member") => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/invites", { email, teamId, role });
      setSentInvites((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invite");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptInvite = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/invites/accept/${token}`);
      setPendingInvites((prev) => prev.filter((i) => i.token !== token));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept invite");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const declineInvite = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/invites/decline/${token}`);
      setPendingInvites((prev) => prev.filter((i) => i.token !== token));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to decline invite");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelInvite = async (inviteId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/invites/${inviteId}`);
      setSentInvites((prev) => prev.filter((i) => i._id !== inviteId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel invite");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getInviteByToken = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/invites/token/${token}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Invite not found");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const inviteCount = pendingInvites.length;

  return (
    <InviteContext.Provider
      value={{
        pendingInvites,
        sentInvites,
        inviteCount,
        loading,
        error,
        fetchPendingInvites,
        fetchInboxInvites,
        fetchSentInvites,
        fetchTeamInvites,
        sendInvite,
        acceptInvite,
        declineInvite,
        cancelInvite,
        getInviteByToken,
      }}
    >
      {children}
    </InviteContext.Provider>
  );
};
