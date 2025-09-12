import { Link } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const CompanyDetails = ({ company }) => {
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

  const recentActivities = [
    {
      Id: 1,
      type: "contact_added",
      description: "New contact added to company",
      timestamp: "2024-01-20T14:30:00Z"
    },
    {
      Id: 2,
      type: "meeting",
      description: "Quarterly business review scheduled",
      timestamp: "2024-01-18T09:15:00Z"
    },
    {
      Id: 3,
      type: "email",
      description: "Follow-up email sent to decision makers",
      timestamp: "2024-01-15T16:45:00Z"
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "contact_added": return "UserPlus";
      case "meeting": return "Calendar";
      case "email": return "Mail";
      case "call": return "Phone";
      case "note": return "FileText";
      default: return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "contact_added": return "text-green-600";
      case "meeting": return "text-blue-600";
      case "email": return "text-purple-600";
      case "call": return "text-orange-600";
      case "note": return "text-gray-600";
      default: return "text-gray-600";
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
              <ApperIcon name="Activity" className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.Id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)} bg-opacity-10`}>
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      className={`h-4 w-4 ${getActivityColor(activity.type)}`} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button variant="ghost" className="w-full">
                <ApperIcon name="History" className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </div>
          </Card>

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