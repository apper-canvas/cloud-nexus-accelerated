import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ActivityTimeline from "@/components/organisms/ActivityTimeline";
import ActivityForm from "@/components/organisms/ActivityForm";
import { activityService } from "@/services/api/activityService";
import ApperIcon from "@/components/ApperIcon";
import Contacts from "@/components/pages/Contacts";
import Companies from "@/components/pages/Companies";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const CompanyDetails = ({ company, companyId }) => {
  const [activities, setActivities] = useState([]);
  const [showActivityForm, setShowActivityForm] = useState(false);

  useEffect(() => {
    if (companyId) {
      loadActivities();
    }
  }, [companyId]);

  const loadActivities = async () => {
    try {
      const companyActivities = await activityService.getByEntity('company', companyId);
      setActivities(companyActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const handleCreateActivity = async (activityData) => {
    try {
      await activityService.create({
        ...activityData,
        companyId: companyId
      });
      toast.success('Activity logged successfully');
      setShowActivityForm(false);
      loadActivities();
    } catch (error) {
      toast.error('Failed to create activity');
      console.error('Error creating activity:', error);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await activityService.delete(activityId);
      toast.success('Activity deleted successfully');
      loadActivities();
    } catch (error) {
      toast.error('Failed to delete activity');
      console.error('Error deleting activity:', error);
    }
  };

const companyInfo = [
    {
      label: "Industry",
      value: company.industry,
      icon: "Briefcase"
    },
    {
      label: "Company Size",
      value: `${company.size} employees`,
      icon: "Users"
    },
    {
      label: "Location", 
      value: company.location,
      icon: "MapPin"
    },
    {
      label: "Website",
      value: company.website,
      icon: "Globe",
      isLink: true
    },
    {
      label: "Relationship Stage",
      value: company.relationshipStage,
      icon: "Target",
      isBadge: true
    }
  ];

  const getRelationshipColor = (stage) => {
    switch (stage) {
      case "Active Client": return "success";
      case "Prospect": return "warning";
      case "Lead": return "info";
      case "Partner": return "primary";
      case "Former Client": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary text-white rounded-xl flex items-center justify-center">
              <ApperIcon name="Building" className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600">{company.industry} • {company.size} employees</p>
              {company.description && (
                <p className="text-gray-600 mt-2 max-w-2xl">{company.description}</p>
              )}
              <div className="flex items-center mt-3 space-x-4">
                <Badge color={getRelationshipColor(company.relationshipStage)}>
                  {company.relationshipStage}
                </Badge>
                <span className="text-sm text-gray-500">
                  {company.contactCount} {company.contactCount === 1 ? 'contact' : 'contacts'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link to={`/companies/${company.Id}/edit`}>
              <Button variant="outline">
                <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                Edit Company
              </Button>
            </Link>
            <Link to="/companies">
              <Button variant="ghost">
                <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
                Back to Companies
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
              <ApperIcon name="Info" className="h-5 w-5 text-primary" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name={info.icon} className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">{info.label}</p>
                    {info.isBadge ? (
                      <Badge color={getRelationshipColor(info.value)} className="mt-1">
                        {info.value}
                      </Badge>
                    ) : info.isLink && info.value ? (
                      <a 
                        href={info.value} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mt-1 block"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 mt-1">{info.value || "Not specified"}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Linked Contacts Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Linked Contacts ({company.contactCount})
              </h2>
              <Link to={`/contacts/new?company=${company.Id}`}>
                <Button size="sm">
                  <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </Link>
            </div>

            {company.contactCount > 0 ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Users" className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    This company has {company.contactCount} linked contacts.
                  </p>
                  <Link to="/contacts" className="text-primary hover:underline mt-2 inline-block">
                    View all contacts →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="UserPlus" className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by adding the first contact for this company.
                </p>
                <Link to={`/contacts/new?company=${company.Id}`}>
                  <Button>
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Add First Contact
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

{/* Recent Activities Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Button
                size="sm"
                onClick={() => setShowActivityForm(true)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
                Log Activity
              </Button>
            </div>
            
            <ActivityTimeline
              activities={activities}
              onDeleteActivity={handleDeleteActivity}
              showEntityLinks={false}
            />

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link to="/activities">
                <Button variant="ghost" className="w-full">
                  <ApperIcon name="History" className="h-4 w-4 mr-2" />
                  View All Activity
                </Button>
              </Link>
            </div>
          </Card>

{/* Activity Form Modal */}
        {showActivityForm && (
          <ActivityForm
            isOpen={showActivityForm}
            onClose={() => setShowActivityForm(false)}
            onSubmit={handleCreateActivity}
            preSelectedEntity={{ type: 'company', id: companyId }}
          />
        )}
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(new Date(company.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(new Date(company.updatedAt), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contacts</span>
                <span className="text-sm font-medium text-gray-900">{company.contactCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;