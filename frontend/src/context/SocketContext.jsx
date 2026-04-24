import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Join/leave team room
  const joinTeam = useCallback(
    (teamId) => {
      if (socket && teamId) {
        socket.emit("join_team", teamId);
        console.log("Joined team room:", teamId);
      }
    },
    [socket],
  );

  const leaveTeam = useCallback(
    (teamId) => {
      if (socket && teamId) {
        socket.emit("leave_team", teamId);
        console.log("Left team room:", teamId);
      }
    },
    [socket],
  );

  // Join/leave issue room
  const joinIssue = useCallback(
    (issueId) => {
      if (socket && issueId) {
        socket.emit("join_issue", issueId);
        console.log("Joined issue room:", issueId);
      }
    },
    [socket],
  );

  const leaveIssue = useCallback(
    (issueId) => {
      if (socket && issueId) {
        socket.emit("leave_issue", issueId);
        console.log("Left issue room:", issueId);
      }
    },
    [socket],
  );

  // Listen for events
  const onIssueCreated = useCallback(
    (callback) => {
      if (!socket) return () => {};
      socket.on("issue_created", callback);
      return () => socket.off("issue_created", callback);
    },
    [socket],
  );

  const onIssueUpdated = useCallback(
    (callback) => {
      if (!socket) return () => {};
      socket.on("issue_updated", callback);
      return () => socket.off("issue_updated", callback);
    },
    [socket],
  );

  const onIssueDeleted = useCallback(
    (callback) => {
      if (!socket) return () => {};
      socket.on("issue_deleted", callback);
      return () => socket.off("issue_deleted", callback);
    },
    [socket],
  );

  const onCommentAdded = useCallback(
    (callback) => {
      if (!socket) return () => {};
      socket.on("comment_added", callback);
      return () => socket.off("comment_added", callback);
    },
    [socket],
  );

  const onCommentDeleted = useCallback(
    (callback) => {
      if (!socket) return () => {};
      socket.on("comment_deleted", callback);
      return () => socket.off("comment_deleted", callback);
    },
    [socket],
  );

  const onActivitiesUpdated = useCallback(
    (callback) => {
      if (!socket) return () => {};
      socket.on("activities_updated", callback);
      return () => socket.off("activities_updated", callback);
    },
    [socket],
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinTeam,
        leaveTeam,
        joinIssue,
        leaveIssue,
        onIssueCreated,
        onIssueUpdated,
        onIssueDeleted,
        onCommentAdded,
        onCommentDeleted,
        onActivitiesUpdated,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
