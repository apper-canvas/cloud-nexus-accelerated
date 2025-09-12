import { useState } from 'react';
import { format, isAfter, parseISO, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import { cn } from '@/utils/cn';

const TaskCard = ({ task, onStatusToggle, onDelete, onEdit }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleStatusToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await onStatusToggle(task.id, task.status !== 'completed');
    } finally {
      setIsToggling(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Minus';
    }
  };

  const isOverdue = task.dueDate && task.status !== 'completed' && 
    isAfter(new Date(), parseISO(task.dueDate));

  const isCompleted = task.status === 'completed';

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const date = parseISO(dueDate);
    const now = new Date();
    
    if (isAfter(now, date) && !isCompleted) {
      return `Overdue by ${formatDistanceToNow(date)}`;
    } else {
      return `Due ${formatDistanceToNow(date, { addSuffix: true })}`;
    }
  };

  return (
    <Card className={cn(
      "p-4 hover:shadow-md transition-all duration-200",
      isCompleted && "bg-gray-50 opacity-75",
      isOverdue && !isCompleted && "border-red-200 bg-red-50"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Status Checkbox */}
          <button
            onClick={handleStatusToggle}
            disabled={isToggling}
            className={cn(
              "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              isCompleted 
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-green-400 hover:bg-green-50",
              isToggling && "opacity-50 cursor-not-allowed"
            )}
          >
            {isToggling ? (
              <ApperIcon name="Loader2" className="h-3 w-3 animate-spin" />
            ) : isCompleted ? (
              <ApperIcon name="Check" className="h-3 w-3" />
            ) : null}
          </button>

          {/* Title */}
          <h3 className={cn(
            "font-medium text-gray-900 truncate",
            isCompleted && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
        </div>

        {/* Priority Badge */}
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium",
          getPriorityColor(task.priority)
        )}>
          <ApperIcon name={getPriorityIcon(task.priority)} className="h-3 w-3" />
          <span className="capitalize">{task.priority}</span>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className={cn(
          "flex items-center gap-1 text-xs mb-3",
          isOverdue && !isCompleted ? "text-red-600" : "text-gray-500"
        )}>
          <ApperIcon name="Calendar" className="h-3 w-3" />
          <span>{formatDueDate(task.dueDate)}</span>
          {isOverdue && !isCompleted && (
            <Badge variant="error" className="ml-2 text-xs">Overdue</Badge>
          )}
        </div>
      )}

      {/* Assignee */}
      {task.assignee && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <ApperIcon name="User" className="h-3 w-3" />
          <span>Assigned to {task.assignee}</span>
        </div>
      )}

      {/* Related Entities Links */}
      <div className="flex items-center gap-3 mb-3 text-xs">
        {task.contactId && (
          <Link
            to={`/contacts/${task.contactId}`}
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <ApperIcon name="User" className="h-3 w-3" />
            Contact
          </Link>
        )}
        {task.companyId && (
          <Link
            to={`/companies/${task.companyId}`}
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <ApperIcon name="Building2" className="h-3 w-3" />
            Company
          </Link>
        )}
        {task.dealId && (
          <Link
            to={`/deals/${task.dealId}`}
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <ApperIcon name="DollarSign" className="h-3 w-3" />
            Deal
          </Link>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Created {task.createdAt ? formatDistanceToNow(parseISO(task.createdAt), { addSuffix: true }) : 'recently'}
        </div>
        
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="text-gray-500 hover:text-primary"
            >
              <ApperIcon name="Edit2" className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="text-gray-500 hover:text-red-600"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;