import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useKeyboardShortcuts = (callbacks = {}) => {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e) => {
    const { key, ctrlKey, metaKey, altKey } = e;
    const isCtrlOrCmd = ctrlKey || metaKey;

    // Command Palette (Ctrl+K)
    if (isCtrlOrCmd && key === 'k') {
      e.preventDefault();
      callbacks.onCommandPalette?.();
      return;
    }

    // Global shortcuts
    if (isCtrlOrCmd && !altKey) {
      switch (key) {
        case 'n':
          e.preventDefault();
          callbacks.onNewIssue?.();
          break;
        case 't':
          e.preventDefault();
          callbacks.onNewTeam?.();
          break;
        case 'p':
          e.preventDefault();
          callbacks.onNewProject?.();
          break;
        case '/':
          e.preventDefault();
          callbacks.onFocusSearch?.();
          break;
        default:
          break;
      }
    }

    // Navigation shortcuts (G + key)
    if (key === 'g' && !isCtrlOrCmd && !altKey) {
      const handler = (e) => {
        switch (e.key) {
          case 'h':
            e.preventDefault();
            navigate('/inbox');
            break;
          case 'i':
            e.preventDefault();
            navigate('/inbox');
            break;
          case 'm':
            e.preventDefault();
            navigate('/my-issues');
            break;
          case 'p':
            e.preventDefault();
            navigate('/projects');
            break;
          case 't':
            e.preventDefault();
            navigate('/teams');
            break;
          default:
            break;
        }
        document.removeEventListener('keydown', handler);
      };
      document.addEventListener('keydown', handler);
      setTimeout(() => document.removeEventListener('keydown', handler), 500);
    }

    // Escape key
    if (key === 'Escape') {
      callbacks.onEscape?.();
    }
  }, [navigate, callbacks]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
