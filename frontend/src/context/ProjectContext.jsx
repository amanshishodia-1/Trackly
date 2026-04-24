import { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/axios';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectIssues, setProjectIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (teamId = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = teamId ? `/projects?teamId=${teamId}` : '/projects';
      const { data } = await api.get(url);
      setProjects(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setCurrentProject(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectIssues = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/projects/${projectId}/issues`);
      setProjectIssues(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project issues');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (projectData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/projects', projectData);
      setProjects(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId, projectData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/projects/${projectId}`, projectData);
      setProjects(prev => prev.map(p => p._id === projectId ? data : p));
      if (currentProject?._id === projectId) {
        setCurrentProject(data);
      }
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      if (currentProject?._id === projectId) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      projectIssues,
      loading,
      error,
      fetchProjects,
      fetchProject,
      fetchProjectIssues,
      createProject,
      updateProject,
      deleteProject,
      setCurrentProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
