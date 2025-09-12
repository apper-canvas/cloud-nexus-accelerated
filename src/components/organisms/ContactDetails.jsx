import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { activityService } from "@/services/api/activityService";
import ApperIcon from "@/components/ApperIcon";
import Activities from "@/components/pages/Activities";
import ActivityTimeline from "@/components/organisms/ActivityTimeline";
import ActivityForm from "@/components/organisms/ActivityForm";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ContactDetails = ({ contact, linkedCompany, contactId }) => {
  const [activities, setActivities] = useState([]);
  const [showActivityForm, setShowActivityForm] = useState(false);

  useEffect(() => {
    if (contactId) {
      loadActivities();
    }
  }, [contactId]);

  const loadActivities = async () => {
    try {
      const contactActivities = await activityService.getByEntity('contact', contactId);
      setActivities(contactActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const handleCreateActivity = async (activityData) => {
    try {
      await activityService.create({
        ...activityData,
        contactId: contactId
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
      icon: "Building",
      linkedCompany: linkedCompany
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
  return (
    <div className="space-y-6">
      {/* Contact Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mr-4">
              <span className="text-xl font-bold">
{(() => {
                  const firstName = contact.first_name_c || contact.name_c?.split(' ')[0] || contact.name?.split(' ')[0] || '';
                  return firstName.charAt(0)?.toUpperCase() || '?';
                })()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {(() => {
                  const firstName = contact.first_name_c || '';
                  const lastName = contact.last_name_c || '';
                  const fullName = firstName && lastName ? `${firstName} ${lastName}` : 
                                  contact.name_c || contact.name || '';
                  return fullName || 'No name';
                })()}
              </h1>
              <p className="text-gray-600">
                {contact.position}
                {contact.company && (
                  <>
                    {" at "}
                    {linkedCompany ? (
                      <Link 
                        to={`/companies/${linkedCompany.Id}`}
                        className="text-primary hover:underline"
                      >
                        {contact.company}
                      </Link>
                    ) : (
                      contact.company
                    )}
                  </>
                )}
              </p>
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
<Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowActivityForm(true)}
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
              Add Activity
            </Button>
</div>
          
          <div>
            <ActivityTimeline
              activities={activities}
              onDeleteActivity={handleDeleteActivity}
              showEntityLinks={false}
            />
          </div>

<div className="mt-6 text-center">
            <Link to="/activities">
              <Button variant="outline" className="w-full">
                View All Activities
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactDetails;