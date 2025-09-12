import { useState, useEffect } from 'react';
import { format, isAfter, parseISO } from 'date-fns';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import TaskForm from '@/components/organisms/TaskForm';
import TaskCard from '@/components/molecules/TaskCard';
import MetricCard from '@/components/molecules/MetricCard';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { activityService } from '@/services/api/activityService';
import { toast } from 'react-toastify';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [statusFilter, priorityFilter]);

  const loadTasks = async () => {
    try {
      setError('');
      setLoading(true);
      
      const filters = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      let data = await activityService.getTasks(filters);
      
      // Client-side filtering for overdue tasks
      if (statusFilter === 'overdue') {
        const today = new Date();
        data = data.filter(task => {
          if (!task.dueDate || task.status === 'completed') return false;
          return isAfter(today, parseISO(task.dueDate));
        });
      }
      
      // Priority filter
      if (priorityFilter !== 'all') {
        data = data.filter(task => task.priority === priorityFilter);
      }
      
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await activityService.getTaskStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading task stats:', err);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await activityService.createTask(taskData);
      toast.success('Task created successfully');
      setShowForm(false);
      loadTasks();
      loadStats();
    } catch (err) {
      toast.error('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, completed) => {
    try {
      await activityService.updateTaskStatus(taskId, completed);
      toast.success(completed ? 'Task completed' : 'Task marked as pending');
      loadTasks();
      loadStats();
    } catch (err) {
      toast.error('Failed to update task status');
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await activityService.delete(taskId);
      toast.success('Task deleted successfully');
      loadTasks();
      loadStats();
    } catch (err) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'overdue': return 'error';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading && tasks.length === 0) {
    return <Loading message="Loading tasks..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Tasks" }
        ]}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">Organize and track your tasks efficiently</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Tasks"
          value={stats.total || 0}
          icon="CheckSquare"
          color="primary"
        />
        <MetricCard
          title="Pending"
          value={stats.pending || 0}
          icon="Clock"
          color="warning"
        />
        <MetricCard
          title="Completed"
          value={stats.completed || 0}
          icon="CheckCircle"
          color="success"
        />
        <MetricCard
          title="Overdue"
          value={stats.overdue || 0}
          icon="AlertTriangle"
          color="error"
        />
        <MetricCard
          title="Completion Rate"
          value={`${stats.completionRate || 0}%`}
          icon="Target"
          color="info"
        />
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks..."
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              {statusOptions.map(status => (
                <Badge
                  key={status.value}
                  variant={statusFilter === status.value ? getStatusBadgeVariant(status.value) : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter(status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
            <div className="flex gap-1">
              {priorityOptions.map(priority => (
                <Badge
                  key={priority.value}
                  variant={priorityFilter === priority.value ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => setPriorityFilter(priority.value)}
                >
                  {priority.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {statusFilter === 'all' ? 'All Tasks' : 
             statusFilter === 'pending' ? 'Pending Tasks' :
             statusFilter === 'completed' ? 'Completed Tasks' :
             statusFilter === 'overdue' ? 'Overdue Tasks' : 'Tasks'}
            <span className="ml-2 text-sm text-gray-500">({filteredTasks.length})</span>
          </h2>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="CheckSquare" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Get started by creating your first task'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
              <Button onClick={() => setShowForm(true)} variant="outline">
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Create First Task
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusToggle={handleUpdateTaskStatus}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};

export default Tasks;