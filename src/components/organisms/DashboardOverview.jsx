import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ActivityTimeline from "@/components/organisms/ActivityTimeline";
import { activityService } from "@/services/api/activityService";
import ApperIcon from "@/components/ApperIcon";
import Leads from "@/components/pages/Leads";
import MetricCard from "@/components/molecules/MetricCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const DashboardOverview = ({ metrics, reportKpis, quickActions }) => {
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = async () => {
    try {
      const activities = await activityService.getRecentActivities(5);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading recent activities:', error);
    }
  };
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Contacts"
          value={metrics.totalContacts}
          icon="Users"
          color="primary"
          trend={{ value: "+12%", positive: true }}
        />
        <MetricCard
          title="Active Leads"
          value={metrics.activeLeads}
          icon="Target"
          color="success"
          trend={{ value: "+8%", positive: true }}
        />
        <MetricCard
          title="Open Deals"
          value={metrics.openDeals}
          icon="TrendingUp"
          color="warning"
          trend={{ value: "-3%", positive: false }}
        />
        <MetricCard
          title="Revenue"
          value={`$${metrics.revenue.toLocaleString()}`}
          icon="DollarSign"
          color="success"
          trend={{ value: "+15%", positive: true }}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon="Target"
          color="info"
          trend={{ value: "+5%", positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <ApperIcon name="Zap" className="h-5 w-5 text-primary" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Button 
                  variant="outline" 
                  className="w-full h-auto p-4 flex items-start justify-start hover:border-primary hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name={action.icon} className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{action.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
<Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Link to="/activities">
              <Button variant="ghost" size="sm">
                View All
                <ApperIcon name="ChevronRight" className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
<ActivityTimeline
            activities={recentActivities}
            showEntityLinks={true}
            limit={5}
          />

          {recentActivities.length === 0 && (
            <div className="text-center py-8">
              <ApperIcon name="Activity" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recent activities</p>
            </div>
          )}
        </Card>
      </div>

{/* Reports Summary Widget */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Performance Summary</h2>
          <Link to="/reports">
            <Button variant="outline" size="sm">
              <ApperIcon name="BarChart3" className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">{reportKpis.qualifiedLeads || 0}</div>
            <div className="text-sm text-gray-600">Qualified Leads</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{reportKpis.dealsClosedThisMonth || 0}</div>
            <div className="text-sm text-gray-600">Deals Closed</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              ${((reportKpis.averageDealSize || 0)/1000).toFixed(0)}k
            </div>
            <div className="text-sm text-gray-600">Avg Deal Size</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">{reportKpis.totalCompanies || 0}</div>
            <div className="text-sm text-gray-600">Companies</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/reports/leads" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <ApperIcon name="Users" className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Lead Reports</div>
                  <div className="text-sm text-gray-600">Conversion & aging</div>
                </div>
              </div>
            </Link>
            
            <Link to="/reports/deals" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <ApperIcon name="TrendingUp" className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Deal Reports</div>
                  <div className="text-sm text-gray-600">Pipeline velocity</div>
                </div>
              </div>
            </Link>
            
            <Link to="/reports/performance" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <ApperIcon name="Trophy" className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Performance</div>
                  <div className="text-sm text-gray-600">Rep leaderboards</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;