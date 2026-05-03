import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  CircleDot,
  GripVertical,
  Triangle,
  Signal,
  Square,
  ArrowUpCircle,
} from "lucide-react";
import IssueDetailDrawer from "./IssueDetailDrawer";

// Kanban Card Component
const KanbanCard = ({ issue, isOverlay, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue._id, disabled: isOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Urgent":
        return <Triangle className="w-3 h-3 text-red-400 fill-red-400" />;
      case "High":
        return <Signal className="w-3 h-3 text-orange-400" />;
      case "Medium":
        return <Square className="w-3 h-3 text-yellow-400" />;
      case "Low":
        return <ArrowUpCircle className="w-3 h-3 text-blue-400" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "text-red-400";
      case "High":
        return "text-orange-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Prevent click when dragging
        if (!isDragging && onClick) {
          onClick(e);
        }
      }}
      className={`cursor-grab active:cursor-grabbing ${isOverlay ? "z-50" : ""}`}
    >
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className={`bg-[var(--bg-primary)] rounded-md p-2 border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] hover:border-[var(--accent-primary)]/50 transition-colors shadow-sm group ${isOverlay ? "shadow-xl rotate-2 scale-105 border-[var(--accent-primary)]/50" : ""
          }`}
      >
        <div className="flex items-start gap-2">
          <GripVertical className="w-3.5 h-3.5 text-[var(--text-tertiary)] mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 min-w-0">
            <p className="text-[var(--text-primary)] text-[13px] font-medium line-clamp-2 leading-snug">
              {issue.title}
            </p>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
              <span className="text-[var(--text-tertiary)] text-[11px] font-mono leading-none">{issue.identifier}</span>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-[4px] border border-transparent group-hover:border-[var(--border-primary)] transition-colors ${getPriorityColor(issue.priority)}`}>
                {getPriorityIcon(issue.priority)}
                <span className="text-[11px] font-medium leading-none tracking-tight">
                  {issue.priority}
                </span>
              </div>
              {issue.assignee && (
                <div className="flex items-center gap-2 px-2 py-1 rounded-[4px] border border-transparent group-hover:border-[var(--border-primary)] transition-colors ml-auto">
                  <div className="w-4 h-4 bg-gradient-to-br from-[#5E6AD2] to-[#8C98F2] rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-[9px] font-bold leading-none">
                      {issue.assignee.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <span className="text-[var(--text-tertiary)] text-[11px] font-medium leading-none truncate max-w-[80px]">
                    {issue.assignee.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Kanban Column Component
const KanbanColumn = ({ title, status, issues, count, onCardClick }) => {
  const { setNodeRef } = useSortable({
    id: status,
    data: { type: "Column", status },
  });

  const getColumnColor = () => {
    switch (status) {
      case "Todo":
        return "border-t-gray-500";
      case "In Progress":
        return "border-t-blue-500";
      case "Done":
        return "border-t-green-500";
      default:
        return "border-t-gray-500";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className={`bg-[var(--bg-secondary)] rounded-t-lg border-t-4 ${getColumnColor()} p-4 border-l border-r border-b border-[var(--border-primary)] shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[var(--text-primary)] font-semibold text-sm">{title}</h3>
          <span className="bg-[var(--bg-primary)] text-[var(--text-tertiary)] text-xs px-2 py-1 rounded-full border border-[var(--border-primary)]">
            {count}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 bg-[var(--bg-secondary)]/50 rounded-b-lg border-l border-r border-b border-[var(--border-primary)] p-2 space-y-2 min-h-[200px]"
      >
        <SortableContext
          items={issues.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
        >
          {issues.map((issue) => (
            <KanbanCard
              key={issue._id}
              issue={issue}
              onClick={() => onCardClick?.(issue)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

// Main Kanban Board Component
const KanbanBoard = ({ issues, onStatusChange }) => {
  const [activeId, setActiveId] = useState(null);
  const [localIssues, setLocalIssues] = useState(issues);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Update local issues when prop changes
  useMemo(() => {
    setLocalIssues(issues);
  }, [issues]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const columns = {
    Todo: localIssues.filter((i) => i.status === "Todo"),
    "In Progress": localIssues.filter((i) => i.status === "In Progress"),
    Done: localIssues.filter((i) => i.status === "Done"),
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the issue being dragged
    const activeIssue = localIssues.find((i) => i._id === activeId);
    if (!activeIssue) return;

    // If dragging over a column
    if (["Todo", "In Progress", "Done"].includes(overId)) {
      const newStatus = overId;
      if (activeIssue.status !== newStatus) {
        setLocalIssues((prev) =>
          prev.map((i) =>
            i._id === activeId ? { ...i, status: newStatus } : i,
          ),
        );
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const draggedId = active.id;
    const activeIssue = localIssues.find((i) => i._id === draggedId);

    if (!activeIssue) return;

    // Determine new status
    let newStatus;
    if (["Todo", "In Progress", "Done"].includes(over.id)) {
      newStatus = over.id;
    } else {
      // Dropped over another issue, find that issue's status
      const overIssue = localIssues.find((i) => i._id === over.id);
      newStatus = overIssue?.status;
    }

    // Compare with original status from props to determine if we need to update backend
    const originalIssue = issues.find((i) => i._id === draggedId);
    if (newStatus && originalIssue && originalIssue.status !== newStatus) {
      // Update backend
      onStatusChange?.(draggedId, newStatus);
    }
  };

  const handleCardClick = (issue) => {
    setSelectedIssue(issue);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedIssue(null);
  };

  const activeIssue = activeId
    ? localIssues.find((i) => i._id === activeId)
    : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex md:grid md:grid-cols-3 gap-4 h-[calc(100vh-300px)] min-h-[500px] overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          <SortableContext
            items={["Todo", "In Progress", "Done"]}
            strategy={verticalListSortingStrategy}
          >
            <div className="min-w-[280px] flex-1">
              <KanbanColumn
                title="Todo"
                status="Todo"
                issues={columns.Todo}
                count={columns.Todo.length}
                onCardClick={handleCardClick}
              />
            </div>
            <div className="min-w-[280px] flex-1">
              <KanbanColumn
                title="In Progress"
                status="In Progress"
                issues={columns["In Progress"]}
                count={columns["In Progress"].length}
                onCardClick={handleCardClick}
              />
            </div>
            <div className="min-w-[280px] flex-1">
              <KanbanColumn
                title="Done"
                status="Done"
                issues={columns.Done}
                count={columns.Done.length}
                onCardClick={handleCardClick}
              />
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeIssue ? <KanbanCard issue={activeIssue} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <IssueDetailDrawer
        issue={selectedIssue}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
};

export default KanbanBoard;
