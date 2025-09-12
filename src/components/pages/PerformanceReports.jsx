import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { reportService } from '@/services/api/reportService';

const PerformanceReports = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [goals, setGoals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('totalValue');

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Reports", href: "/reports" },
    { label: "Performance Reports" }
  ];

  useEffect(() => {
    loadPerformanceReports();
  }, [selectedTimeframe]);

  const loadPerformanceReports = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await reportService.getSalesRepPerformance();
      setPerformanceData(data);
      
      // Mock goals data - in real app, this would come from goals service
      setGoals({
        totalValue: 1000000,
        dealsClosed: 50,
        activities: 200
      });
    } catch (err) {
      setError("Failed to load performance reports. Please try again.");
      toast.error("Failed to load performance reports");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformanceBadge = (rank) => {
    if (rank === 1) return { variant: "success", text: "Top Performer" };
    if (rank <= 3) return { variant: "info", text: "High Performer" };
    if (rank <= 5) return { variant: "warning", text: "Good Performer" };
    return { variant: "default", text: "Needs Focus" };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPerformanceReports} />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Reports</h1>
          <p className="text-gray-600">Sales representative leaderboards, activity tracking, and goal progress</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="totalValue">Revenue</option>
            <option value="closedDeals">Deals Closed</option>
            <option value="activities">Activities</option>
            <option value="winRate">Win Rate</option>
          </select>
          <Button variant="outline" onClick={loadPerformanceReports}>
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Team Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{performanceData.length}</div>
              <div className="text-sm text-gray-600">Active Reps</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(performanceData.reduce((sum, rep) => sum + rep.totalValue, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {performanceData.reduce((sum, rep) => sum + rep.closedDeals, 0)}
              </div>
              <div className="text-sm text-gray-600">Deals Closed</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Activity" className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {performanceData.reduce((sum, rep) => sum + rep.activities, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Activities</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Rep Leaderboard */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Sales Rep Leaderboard</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ranked by:</span>
            <Badge variant="primary">
              {selectedMetric === 'totalValue' ? 'Revenue' :
               selectedMetric === 'closedDeals' ? 'Deals Closed' :
               selectedMetric === 'activities' ? 'Activities' : 'Win Rate'}
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rep</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Deals Closed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Win Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Activities</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((rep, index) => {
                const rank = index + 1;
                const badge = getPerformanceBadge(rank);
                
                return (
                  <tr key={rep.rep} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          rank === 1 ? 'bg-yellow-500' :
                          rank === 2 ? 'bg-gray-400' :
                          rank === 3 ? 'bg-amber-600' : 'bg-gray-300'
                        }`}>
                          {rank}
                        </div>
                        {rank <= 3 && (
                          <ApperIcon 
                            name="Trophy" 
                            className={`h-4 w-4 ${
                              rank === 1 ? 'text-yellow-500' :
                              rank === 2 ? 'text-gray-400' :
                              'text-amber-600'
                            }`} 
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{rep.rep}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      {formatCurrency(rep.totalValue)}
                    </td>
                    <td className="py-4 px-4 text-gray-700">{rep.closedDeals}</td>
                    <td className="py-4 px-4">
                      <Badge variant={rep.winRate > 50 ? "success" : rep.winRate > 25 ? "warning" : "error"}>
                        {rep.winRate}%
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{rep.activities}</td>
                    <td className="py-4 px-4">
                      <Badge variant={badge.variant}>
                        {badge.text}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Goal Tracking */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Team Goal Progress</h2>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">Revenue Goal</span>
              <span className="text-sm text-gray-600">
                {formatCurrency(performanceData.reduce((sum, rep) => sum + rep.totalValue, 0))} / {formatCurrency(goals.totalValue)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                  (performanceData.reduce((sum, rep) => sum + rep.totalValue, 0) / goals.totalValue) * 100
                )}`}
                style={{ 
                  width: `${Math.min((performanceData.reduce((sum, rep) => sum + rep.totalValue, 0) / goals.totalValue) * 100, 100)}%` 
                }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {((performanceData.reduce((sum, rep) => sum + rep.totalValue, 0) / goals.totalValue) * 100).toFixed(1)}% of goal achieved
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">Deals Closed Goal</span>
              <span className="text-sm text-gray-600">
                {performanceData.reduce((sum, rep) => sum + rep.closedDeals, 0)} / {goals.dealsClosed}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                  (performanceData.reduce((sum, rep) => sum + rep.closedDeals, 0) / goals.dealsClosed) * 100
                )}`}
                style={{ 
                  width: `${Math.min((performanceData.reduce((sum, rep) => sum + rep.closedDeals, 0) / goals.dealsClosed) * 100, 100)}%` 
                }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {((performanceData.reduce((sum, rep) => sum + rep.closedDeals, 0) / goals.dealsClosed) * 100).toFixed(1)}% of goal achieved
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">Activity Goal</span>
              <span className="text-sm text-gray-600">
                {performanceData.reduce((sum, rep) => sum + rep.activities, 0)} / {goals.activities}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                  (performanceData.reduce((sum, rep) => sum + rep.activities, 0) / goals.activities) * 100
                )}`}
                style={{ 
                  width: `${Math.min((performanceData.reduce((sum, rep) => sum + rep.activities, 0) / goals.activities) * 100, 100)}%` 
                }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {((performanceData.reduce((sum, rep) => sum + rep.activities, 0) / goals.activities) * 100).toFixed(1)}% of goal achieved
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Insights */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">Top Performer</h3>
              <p className="text-sm text-green-700">
                {performanceData[0]?.rep} leads with {formatCurrency(performanceData[0]?.totalValue || 0)} in revenue
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <ApperIcon name="Target" className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Team Average</h3>
              <p className="text-sm text-blue-700">
                Average revenue per rep: {formatCurrency(performanceData.length > 0 ? 
                  performanceData.reduce((sum, rep) => sum + rep.totalValue, 0) / performanceData.length : 0
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900">Focus Areas</h3>
              <p className="text-sm text-yellow-700">
                {performanceData.filter(rep => rep.winRate < 25).length} reps need support to improve win rates
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PerformanceReports;