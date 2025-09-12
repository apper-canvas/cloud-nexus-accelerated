import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import MetricCard from '@/components/molecules/MetricCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { reportService } from '@/services/api/reportService';

const Reports = () => {
  const [kpis, setKpis] = useState({});
  const [pipelineData, setPipelineData] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [repPerformanceData, setRepPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Reports & Analytics" }
  ];

  useEffect(() => {
    loadReportsData();
  }, [selectedTimeframe]);

  const loadReportsData = async () => {
    try {
      setError(null);
      setLoading(true);

      const [kpiData, pipelineHealthData, sourceData, performanceData] = await Promise.all([
        reportService.getKPIs(),
        reportService.getPipelineHealthData(),
        reportService.getLeadSourceData(),
        reportService.getSalesRepPerformance()
      ]);

      setKpis(kpiData);
      setPipelineData(pipelineHealthData);
      setLeadSourceData(sourceData);
      setRepPerformanceData(performanceData);
    } catch (err) {
      setError("Failed to load reports data. Please try again.");
      toast.error("Failed to load reports data");
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

  const getStageColor = (stage) => {
    const colors = {
      'Prospecting': 'bg-blue-500',
      'Qualification': 'bg-yellow-500',
      'Proposal': 'bg-orange-500',
      'Negotiation': 'bg-red-500',
      'Closed': 'bg-green-500'
    };
    return colors[stage] || 'bg-gray-500';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReportsData} />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your sales performance and metrics</p>
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
          <Button variant="outline" onClick={loadReportsData}>
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(kpis.totalRevenue || 0)}
          icon="DollarSign"
          color="success"
          trend={{ value: "+12%", positive: true }}
        />
        <MetricCard
          title="Deals Closed"
          value={kpis.dealsClosedThisMonth || 0}
          icon="TrendingUp"
          color="info"
          trend={{ value: "+8%", positive: true }}
        />
        <MetricCard
          title="Lead Conversion Rate"
          value={`${kpis.leadConversionRate || 0}%`}
          icon="Target"
          color="warning"
          trend={{ value: "+5%", positive: true }}
        />
        <MetricCard
          title="Avg Deal Size"
          value={formatCurrency(kpis.averageDealSize || 0)}
          icon="Calculator"
          color="primary"
          trend={{ value: "+15%", positive: true }}
        />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Health */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Health</h2>
            <Link to="/reports/deals">
              <Button variant="outline" size="sm">
                <ApperIcon name="BarChart3" className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {pipelineData.map((item, index) => (
              <div key={item.stage} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStageColor(item.stage)}`}></div>
                  <span className="font-medium text-gray-900">{item.stage}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{item.count} deals</div>
                  <div className="text-sm text-gray-600">{formatCurrency(item.value)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600">Pipeline Value</div>
              <div className="text-xl font-bold text-primary">
                {formatCurrency(pipelineData.reduce((sum, item) => sum + item.value, 0))}
              </div>
            </div>
          </div>
        </Card>

        {/* Lead Source Effectiveness */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lead Source Effectiveness</h2>
            <Link to="/reports/leads">
              <Button variant="outline" size="sm">
                <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {leadSourceData.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{source.source}</span>
                  <Badge variant={source.conversionRate > 20 ? "success" : source.conversionRate > 10 ? "warning" : "default"}>
                    {source.conversionRate}% conversion
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{source.count} leads</span>
                  <span>•</span>
                  <span>{source.qualified} qualified</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(source.conversionRate, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sales Rep Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sales Rep Performance</h2>
          <Link to="/reports/performance">
            <Button variant="outline" size="sm">
              <ApperIcon name="Trophy" className="h-4 w-4 mr-2" />
              View Leaderboard
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rep</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Deals</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Closed Deals</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Win Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Activities</th>
              </tr>
            </thead>
            <tbody>
              {repPerformanceData.slice(0, 5).map((rep, index) => (
                <tr key={rep.rep} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{rep.rep}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{rep.totalDeals}</td>
                  <td className="py-3 px-4 text-gray-700">{rep.closedDeals}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{formatCurrency(rep.totalValue)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={rep.winRate > 50 ? "success" : rep.winRate > 25 ? "warning" : "default"}>
                      {rep.winRate}%
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{rep.activities}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detailed Report Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/reports/leads" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Lead Reports</h3>
                <p className="text-sm text-gray-600">Conversion rates, aging, qualification metrics</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/reports/deals" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Deal Reports</h3>
                <p className="text-sm text-gray-600">Pipeline velocity, win/loss, forecasting</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/reports/performance" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Trophy" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Performance Reports</h3>
                <p className="text-sm text-gray-600">Rep leaderboards, activity tracking, goals</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Reports;