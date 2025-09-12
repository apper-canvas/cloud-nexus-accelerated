import { Link } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ContactDetails = ({ contact }) => {
  if (!contact) return null;

  const contactInfo = [
    {
      label: "Email",
      value: contact.email,
      icon: "Mail",
      link: `mailto:${contact.email}`
    },
    {
      label: "Phone",
      value: contact.phone,
      icon: "Phone",
      link: `tel:${contact.phone}`
    },
    {
      label: "Company",
      value: contact.company,
      icon: "Building"
    },
    {
      label: "Position",
      value: contact.position,
      icon: "Briefcase"
    },
    {
      label: "Address",
      value: contact.address,
      icon: "MapPin"
    }
  ];

  const mockActivities = [
    {
      id: 1,
      type: "email",
      description: "Sent welcome email",
      date: new Date(2024, 0, 15),
      completed: true
    },
    {
      id: 2,
      type: "call",
      description: "Follow-up call scheduled",
      date: new Date(2024, 0, 10),
      completed: false
    },
    {
      id: 3,
      type: "meeting",
      description: "Initial consultation meeting",
      date: new Date(2024, 0, 5),
      completed: true
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "email": return "Mail";
      case "call": return "Phone";
      case "meeting": return "Calendar";
      default: return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "email": return "info";
      case "call": return "success";
      case "meeting": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mr-4">
              <span className="text-xl font-bold">
                {contact.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
              <p className="text-gray-600">{contact.position} at {contact.company}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                Created {format(new Date(contact.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to={`/contacts/${contact.Id}/edit`}>
              <Button>
                <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                Edit Contact
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name={info.icon} className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{info.label}</p>
                  {info.link ? (
                    <a 
                      href={info.link}
                      className="text-primary hover:underline font-medium"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-medium">{info.value || "Not provided"}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {contact.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{contact.notes}</p>
            </div>
          )}
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Button variant="outline" size="sm">
              <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
              Add Activity
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                  activity.completed ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <ApperIcon 
                    name={getActivityIcon(activity.type)} 
                    className={`h-4 w-4 ${
                      activity.completed ? 'text-green-600' : 'text-gray-600'
                    }`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <Badge variant={getActivityColor(activity.type)}>
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(activity.date, "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full">
              View All Activities
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactDetails;