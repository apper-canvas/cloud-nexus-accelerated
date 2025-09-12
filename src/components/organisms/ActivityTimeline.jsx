import { useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

const ActivityTimeline = ({ activities = [], onDeleteActivity, showEntityLinks = false, limit = null }) => {
  const [expandedActivities, setExpandedActivities] = useState(new Set());

  const toggleExpanded = (activityId) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return 'Phone';
      case 'email': return 'Mail';
      case 'meeting': return 'Calendar';
      case 'note': return 'FileText';
      case 'task': return 'CheckSquare';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call': return 'text-green-600 bg-green-100';
      case 'email': return 'text-blue-600 bg-blue-100';
      case 'meeting': return 'text-purple-600 bg-purple-100';
      case 'note': return 'text-gray-600 bg-gray-100';
      case 'task': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'call': return 'success';
      case 'email': return 'info';
      case 'meeting': return 'warning';
      case 'note': return 'secondary';
      case 'task': return 'default';
      default: return 'secondary';
    }
  };

  const displayedActivities = limit ? activities.slice(0, limit) : activities;

  if (displayedActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <ApperIcon name="Calendar" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">No activities found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedActivities.map((activity, index) => {
const isExpanded = expandedActivities.has(activity.Id || activity.id || activity.Id);
        const isLast = index === displayedActivities.length - 1;

        return (
<div key={activity.Id || activity.id || `activity-${index}`} className="relative">
            {/* Timeline connector */}
            {!isLast && (
              <div className="absolute left-4 top-12 w-px h-16 bg-gray-200" />
            )}

            <div className="flex gap-4">
              {/* Activity Icon */}
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                getActivityColor(activity.type)
              )}>
                <ApperIcon
                  name={getActivityIcon(activity.type)}
                  className="h-4 w-4"
                />
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {activity.title}
                      </h4>
                      <Badge variant={getTypeBadgeColor(activity.type)} className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {activity.description}
                    </p>

<div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {activity.date && !isNaN(new Date(activity.date).getTime()) 
                          ? format(new Date(activity.date), 'MMM dd, yyyy • h:mm a')
                          : 'Invalid date'
                        }
                      </span>
                      {activity.duration && (
                        <span>• {activity.duration} minutes</span>
                      )}
                      <span>• by {activity.userName}</span>
                    </div>

                    {/* Entity Links */}
                    {showEntityLinks && (
                      <div className="flex items-center gap-2 mt-2">
                        {activity.contactId && (
                          <Link
                            to={`/contacts/${activity.contactId}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                          >
                            <ApperIcon name="User" className="h-3 w-3" />
                            Contact
                          </Link>
                        )}
                        {activity.companyId && (
                          <Link
                            to={`/companies/${activity.companyId}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                          >
                            <ApperIcon name="Building2" className="h-3 w-3" />
                            Company
                          </Link>
                        )}
                        {activity.dealId && (
                          <Link
                            to={`/deals/${activity.dealId}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                          >
                            <ApperIcon name="DollarSign" className="h-3 w-3" />
                            Deal
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Expanded Content */}
                    {isExpanded && activity.outcome && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Outcome:</h5>
                        <p className="text-sm text-gray-600">{activity.outcome}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {activity.outcome && (
                      <Button
                        variant="ghost"
                        size="sm"
onClick={() => activity.Id || activity.id ? toggleExpanded(activity.Id || activity.id) : null}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ApperIcon
                          name={isExpanded ? "ChevronUp" : "ChevronDown"}
                          className="h-4 w-4"
                        />
                      </Button>
                    )}
                    {onDeleteActivity && (
                      <Button
                        variant="ghost"
                        size="sm"
onClick={() => activity.Id || activity.id ? onDeleteActivity(activity.Id || activity.id) : null}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;