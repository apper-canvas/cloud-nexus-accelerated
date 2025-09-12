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

const DealReports = () => {
  const [dealReportData, setDealReportData] = useState({});
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Reports", href: "/reports" },
    { label: "Deal Reports" }
  ];

  useEffect(() => {
    loadDealReports();
  }, [selectedTimeframe]);

  const loadDealReports = async () => {
    try {
      setError(null);
      setLoading(true);
      const [dealData, pipelineHealthData] = await Promise.all([
        reportService.getDealReports(),
        reportService.getPipelineHealthData()
      ]);
      setDealReportData(dealData);
      setPipelineData(pipelineHealthData);
    } catch (err) {
      setError("Failed to load deal reports. Please try again.");
      toast.error("Failed to load deal reports");
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDealReports} />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deal Reports</h1>
          <p className="text-gray-600">Pipeline analysis, velocity metrics, and forecasting insights</p>
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
          <Button variant="outline" onClick={loadDealReports}>
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Pipeline Velocity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Velocity</h2>
        <p className="text-sm text-gray-600 mb-4">Average time deals spend in each stage</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(dealReportData.pipelineVelocity || {}).map(([stage, days]) => (
            <div key={stage} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">{days}</div>
              <div className="text-xs text-gray-600 mb-1">days</div>
              <div className="text-sm font-medium text-gray-900">{stage}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <ApperIcon name="Info" className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-blue-800">
              Average deal cycle: {Object.values(dealReportData.pipelineVelocity || {}).reduce((sum, days) => sum + days, 0)} days
            </span>
          </div>
        </div>
      </Card>

      {/* Pipeline Health Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineData.map((stage) => (
            <div key={stage.stage} className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-lg font-bold text-gray-900 mb-1">{stage.count}</div>
              <div className="text-xs text-gray-600 mb-2">deals</div>
              <div className="text-sm font-medium text-gray-900 mb-2">{stage.stage}</div>
              <div className="text-xs text-gray-600">{formatCurrency(stage.value)}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Win/Loss Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Win/Loss Analysis</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-900">Won Deals</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {dealReportData.winLossAnalysis?.won || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-900">Lost Deals</span>
              </div>
              <span className="text-xl font-bold text-red-600">
                {dealReportData.winLossAnalysis?.lost || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-blue-900">In Progress</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {dealReportData.winLossAnalysis?.inProgress || 0}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600">Win Rate</div>
              <div className="text-2xl font-bold text-primary">
                {dealReportData.winLossAnalysis?.won && dealReportData.winLossAnalysis?.lost ?
                  `${((dealReportData.winLossAnalysis.won / (dealReportData.winLossAnalysis.won + dealReportData.winLossAnalysis.lost)) * 100).toFixed(1)}%` :
                  '0%'
                }
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Forecasting Accuracy</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {dealReportData.forecastingAccuracy || 0}%
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Deals closed within expected timeframe
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Forecasting Accuracy</span>
              <Badge variant={
                (dealReportData.forecastingAccuracy || 0) > 80 ? "success" :
                (dealReportData.forecastingAccuracy || 0) > 60 ? "warning" : "error"
              }>
                {dealReportData.forecastingAccuracy > 80 ? 'Excellent' :
                 dealReportData.forecastingAccuracy > 60 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(dealReportData.forecastingAccuracy || 0, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              Based on comparison of expected vs actual close dates
            </div>
          </div>
        </Card>
      </div>

      {/* Deal Performance Metrics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              {dealReportData.totalDeals || 0}
            </div>
            <div className="text-sm text-gray-600">Total Deals</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-success mb-1">
              {formatCurrency(pipelineData.reduce((sum, stage) => sum + stage.value, 0))}
            </div>
            <div className="text-sm text-gray-600">Pipeline Value</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-warning mb-1">
              {pipelineData.reduce((sum, stage) => sum + stage.count, 0)}
            </div>
            <div className="text-sm text-gray-600">Active Deals</div>
          </div>
        </div>
      </Card>

      {/* Action Items */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <ApperIcon name="Clock" className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900">Accelerate Slow-Moving Deals</h3>
              <p className="text-sm text-yellow-700">
                Focus on deals that have been in stages longer than average
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Improve Forecasting</h3>
              <p className="text-sm text-blue-700">
                Review and update expected close dates for better accuracy
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <ApperIcon name="Target" className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">Optimize Win Rate</h3>
              <p className="text-sm text-green-700">
                Analyze won deals to identify success patterns and replicate them
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DealReports;