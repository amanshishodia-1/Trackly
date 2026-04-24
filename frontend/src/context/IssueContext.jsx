import { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/axios';

const IssueContext = createContext();

export const useIssues = () => useContext(IssueContext);

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [currentIssue, setCurrentIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIssues = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.teamId) params.append('teamId', filters.teamId);
      if (filters.status) params.append('status', filters.status);
      if (filters.assignee) params.append('assignee', filters.assignee);
      if (filters.project) params.append('project', filters.project);

      const { data } = await api.get(`/issues?${params}`);
      setIssues(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch issues');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIssue = useCallback(async (issueId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/issues/${issueId}`);
      setCurrentIssue(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch issue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createIssue = async (issueData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/issues', issueData);
      setIssues(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create issue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateIssue = async (issueId, issueData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/issues/${issueId}`, issueData);
      setIssues(prev => prev.map(i => i._id === issueId ? data : i));
      if (currentIssue?._id === issueId) {
        setCurrentIssue(data);
      }
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update issue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteIssue = async (issueId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/issues/${issueId}`);
      setIssues(prev => prev.filter(i => i._id !== issueId));
      if (currentIssue?._id === issueId) {
        setCurrentIssue(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete issue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyAssigned = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/issues/my/assigned');
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assigned issues');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyCreated = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/issues/my/created');
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <IssueContext.Provider value={{
      issues,
      currentIssue,
      loading,
      error,
      fetchIssues,
      fetchIssue,
      createIssue,
      updateIssue,
      deleteIssue,
      fetchMyAssigned,
      fetchMyCreated,
      setCurrentIssue
    }}>
      {children}
    </IssueContext.Provider>
  );
};
