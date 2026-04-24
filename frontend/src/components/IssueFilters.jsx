import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

const IssueFilters = ({ filters, onChange, availableLabels = [], availableAssignees = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = ['Todo', 'In Progress', 'Done'];
  const priorityOptions = ['No priority', 'Low', 'Medium', 'High', 'Urgent'];

  const clearFilters = () => {
    onChange({
      status: [],
      priority: [],
      labels: [],
      assignee: [],
      search: '',
    });
  };

  const hasActiveFilters =
    filters.status?.length > 0 ||
    filters.priority?.length > 0 ||
    filters.labels?.length > 0 ||
    filters.assignee?.length > 0 ||
    filters.search;

  const toggleFilter = (category, value) => {
    onChange({
      ...filters,
      [category]: filters[category]?.includes(value)
        ? filters[category].filter(v => v !== value)
        : [...(filters[category] || []), value],
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'High': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Low': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Todo': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      case 'In Progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Done': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          hasActiveFilters
            ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
            : 'bg-[#161922] border-[#1F2328] text-gray-400 hover:text-gray-300'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">Filter</span>
        {hasActiveFilters && (
          <span className="px-1.5 py-0.5 text-xs bg-purple-500 text-white rounded-full">
            {(filters.status?.length || 0) + (filters.priority?.length || 0) + (filters.labels?.length || 0)}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-[#0F1115] border border-[#1F2328] rounded-lg shadow-xl z-50 p-4">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search issues..."
                value={filters.search || ''}
                onChange={(e) => onChange({ ...filters, search: e.target.value })}
                className="w-full bg-[#161922] border border-[#1F2328] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    onClick={() => toggleFilter('status', status)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                      filters.status?.includes(status)
                        ? getStatusColor(status)
                        : 'bg-[#161922] border-[#1F2328] text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</h4>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map(priority => (
                  <button
                    key={priority}
                    onClick={() => toggleFilter('priority', priority)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                      filters.priority?.includes(priority)
                        ? getPriorityColor(priority)
                        : 'bg-[#161922] border-[#1F2328] text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Labels Filter */}
            {availableLabels.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {availableLabels.map(label => (
                    <button
                      key={label}
                      onClick={() => toggleFilter('labels', label)}
                      className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                        filters.labels?.includes(label)
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-[#161922] border-[#1F2328] text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Assignee Filter */}
            {availableAssignees.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Assignee</h4>
                <div className="flex flex-wrap gap-2">
                  {availableAssignees.map(assignee => (
                    <button
                      key={assignee._id}
                      onClick={() => toggleFilter('assignee', assignee._id)}
                      className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-full border transition-colors ${
                        filters.assignee?.includes(assignee._id)
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-[#161922] border-[#1F2328] text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[8px] font-semibold">
                          {assignee.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      {assignee.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 bg-[#161922] hover:bg-red-500/10 border border-[#1F2328] hover:border-red-500/30 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        </>
      )}

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.status?.map(status => (
            <span
              key={status}
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getStatusColor(status)}`}
            >
              {status}
              <button
                onClick={() => toggleFilter('status', status)}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.priority?.map(priority => (
            <span
              key={priority}
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getPriorityColor(priority)}`}
            >
              {priority}
              <button
                onClick={() => toggleFilter('priority', priority)}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.labels?.map(label => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-purple-500/20 border-purple-500/50 text-purple-400"
            >
              {label}
              <button
                onClick={() => toggleFilter('labels', label)}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueFilters;
