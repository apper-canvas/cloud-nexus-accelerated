import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import ActivityForm from '@/components/organisms/ActivityForm';
import ActivityTimeline from '@/components/organisms/ActivityTimeline';
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

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadActivities();
    loadStats();
  }, [typeFilter]);

  const loadActivities = async () => {
    try {
      setError('');
      setLoading(true);
      
      const filters = {};
      if (typeFilter !== 'all') {
        filters.type = typeFilter;
      }
      
      const data = await activityService.getAll(filters);
      setActivities(data);
    } catch (err) {
      setError('Failed to load activities. Please try again.');
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await activityService.getActivityStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading activity stats:', err);
    }
  };

  const handleCreateActivity = async (activityData) => {
    try {
      await activityService.create(activityData);
      toast.success('Activity logged successfully');
      setShowForm(false);
      loadActivities();
      loadStats();
    } catch (err) {
      toast.error('Failed to create activity');
      console.error('Error creating activity:', err);
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await activityService.delete(id);
      toast.success('Activity deleted successfully');
      loadActivities();
      loadStats();
    } catch (err) {
      toast.error('Failed to delete activity');
      console.error('Error deleting activity:', err);
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'call', label: 'Calls' },
    { value: 'email', label: 'Emails' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'note', label: 'Notes' },
    { value: 'task', label: 'Tasks' }
  ];

  if (loading && activities.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Activities" }
        ]}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities & Tasks</h1>
          <p className="text-gray-600">Track all customer interactions and communications</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Log Activity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Activities"
          value={stats.total || 0}
          icon="Activity"
          color="blue"
        />
        <MetricCard
          title="This Week"
          value={stats.thisWeek || 0}
          icon="Calendar"
          color="green"
        />
        <MetricCard
          title="This Month"
          value={stats.thisMonth || 0}
          icon="TrendingUp"
          color="purple"
        />
        <MetricCard
          title="Calls Made"
          value={stats.byType?.call || 0}
          icon="Phone"
          color="orange"
        />
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search activities..."
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {activityTypes.map(type => (
              <Badge
                key={type.value}
                variant={typeFilter === type.value ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setTypeFilter(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Activities Timeline */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h2>
        <ActivityTimeline
          activities={filteredActivities}
          onDeleteActivity={handleDeleteActivity}
          showEntityLinks={true}
        />
      </Card>

      {/* Activity Form Modal */}
      {showForm && (
        <ActivityForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateActivity}
        />
      )}
    </div>
  );
};

export default Activities;