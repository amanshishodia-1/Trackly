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
      className={`bg-[#0F1115] rounded-lg p-3 border border-[#1F2328] hover:border-purple-500/30 cursor-grab active:cursor-grabbing ${
        isOverlay ? "shadow-xl rotate-2 scale-105" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium line-clamp-2 mb-2">
            {issue.title}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-mono">{issue.identifier}</span>
            <div className="flex items-center gap-1">
              {getPriorityIcon(issue.priority)}
              <span className={`${getPriorityColor(issue.priority)}`}>
                {issue.priority}
              </span>
            </div>
          </div>
          {issue.assignee && (
            <div className="mt-2 flex items-center gap-1">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {issue.assignee.name?.charAt(0) || "?"}
                </span>
              </div>
              <span className="text-gray-400 text-xs">
                {issue.assignee.name}
              </span>
            </div>
          )}
        </div>
      </div>
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
        className={`bg-[#161922] rounded-t-lg border-t-4 ${getColumnColor()} p-3 border-l border-r border-b border-[#1F2328]`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <span className="bg-[#0F1115] text-gray-400 text-xs px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 bg-[#161922] rounded-b-lg border-l border-r border-b border-[#1F2328] p-2 space-y-2 min-h-[200px]"
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

    if (newStatus && activeIssue.status !== newStatus) {
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
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-300px)] min-h-[500px]">
          <SortableContext
            items={["Todo", "In Progress", "Done"]}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn
              title="Todo"
              status="Todo"
              issues={columns.Todo}
              count={columns.Todo.length}
              onCardClick={handleCardClick}
            />
            <KanbanColumn
              title="In Progress"
              status="In Progress"
              issues={columns["In Progress"]}
              count={columns["In Progress"].length}
              onCardClick={handleCardClick}
            />
            <KanbanColumn
              title="Done"
              status="Done"
              issues={columns.Done}
              count={columns.Done.length}
              onCardClick={handleCardClick}
            />
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
