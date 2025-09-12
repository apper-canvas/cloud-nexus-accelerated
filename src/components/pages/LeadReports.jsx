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

const LeadReports = () => {
  const [leadReportData, setLeadReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Reports", href: "/reports" },
    { label: "Lead Reports" }
  ];

  useEffect(() => {
    loadLeadReports();
  }, [selectedTimeframe]);

  const loadLeadReports = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await reportService.getLeadReports();
      setLeadReportData(data);
    } catch (err) {
      setError("Failed to load lead reports. Please try again.");
      toast.error("Failed to load lead reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLeadReports} />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Reports</h1>
          <p className="text-gray-600">Detailed analysis of lead performance and conversion metrics</p>
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
          <Button variant="outline" onClick={loadLeadReports}>
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Conversion Rates by Source */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rates by Source</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(leadReportData.conversionBySource || []).map((source) => (
            <div key={source.source} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{source.source}</h3>
                <Badge variant={source.conversionRate > 20 ? "success" : source.conversionRate > 10 ? "warning" : "default"}>
                  {source.conversionRate}%
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Total Leads: {source.count}</div>
                <div>Qualified: {source.qualified}</div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(source.conversionRate, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Lead Aging Analysis */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Aging Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(leadReportData.agingBuckets || {}).map(([bucket, count]) => (
            <div key={bucket} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">{count}</div>
              <div className="text-sm text-gray-600">{bucket}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2">
            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Action Required: {leadReportData.agingBuckets?.['90+ days'] || 0} leads older than 90 days need attention
            </span>
          </div>
        </div>
      </Card>

      {/* Qualification Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Distribution</h2>
          <div className="space-y-4">
            {Object.entries(leadReportData.qualificationMetrics || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'qualified' ? 'bg-green-500' :
                    status === 'contacted' ? 'bg-yellow-500' :
                    status === 'new' ? 'bg-blue-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900 capitalize">{status}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">
                    {leadReportData.totalLeads > 0 ? 
                      `${((count / leadReportData.totalLeads) * 100).toFixed(1)}%` : '0%'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Performance Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Leads</span>
              <span className="font-semibold text-gray-900">{leadReportData.totalLeads || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Qualification Rate</span>
              <span className="font-semibold text-green-600">
                {leadReportData.totalLeads > 0 ? 
                  `${(((leadReportData.qualificationMetrics?.qualified || 0) / leadReportData.totalLeads) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Contacted Rate</span>
              <span className="font-semibold text-yellow-600">
                {leadReportData.totalLeads > 0 ? 
                  `${(((leadReportData.qualificationMetrics?.contacted || 0) / leadReportData.totalLeads) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">New Leads</span>
              <span className="font-semibold text-blue-600">
                {leadReportData.qualificationMetrics?.new || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <ApperIcon name="Users" className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Follow up on New Leads</h3>
              <p className="text-sm text-blue-700">
                {leadReportData.qualificationMetrics?.new || 0} new leads need initial contact
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <ApperIcon name="Clock" className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900">Review Aging Leads</h3>
              <p className="text-sm text-yellow-700">
                {leadReportData.agingBuckets?.['90+ days'] || 0} leads have been in pipeline for over 90 days
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <ApperIcon name="Target" className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">Optimize High-Performing Sources</h3>
              <p className="text-sm text-green-700">
                Focus marketing efforts on sources with highest conversion rates
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LeadReports;