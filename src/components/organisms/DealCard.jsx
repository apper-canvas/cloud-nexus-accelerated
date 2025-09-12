import { Link } from "react-router-dom";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const DealCard = ({ deal, company, isDragging = false, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: deal.Id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-success';
    if (probability >= 60) return 'text-warning';
    if (probability >= 40) return 'text-info';
    return 'text-secondary';
  };

  const getStatusBadge = (stage) => {
    const colors = {
      'Prospecting': 'secondary',
      'Qualification': 'info', 
      'Proposal': 'warning',
      'Negotiation': 'error',
      'Closed': 'success'
    };
    return colors[stage] || 'secondary';
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        "p-4 cursor-pointer hover:shadow-md transition-shadow",
        isDragging && "opacity-50 transform rotate-2 shadow-lg"
      )}
    >
      <div className="space-y-3">
        {/* Header with company and value */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {company ? (
              <Link 
                to={`/companies/${company.Id}`}
                className="text-sm font-semibold text-primary hover:underline block truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {company.name}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-gray-900 block truncate">
                Unknown Company
              </span>
            )}
            <p className="text-xs text-gray-600 truncate mt-1">{deal.title}</p>
          </div>
          <div className="text-right ml-2">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(deal.value)}
            </div>
          </div>
        </div>

        {/* Probability and Stage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Target" className="h-3 w-3 text-gray-400" />
            <span className={cn("text-sm font-medium", getProbabilityColor(deal.probability))}>
              {deal.probability}%
            </span>
          </div>
          <Badge variant={getStatusBadge(deal.stage)} size="sm">
            {deal.stage}
          </Badge>
        </div>

        {/* Expected close date */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <ApperIcon name="Calendar" className="h-3 w-3" />
          <span>Close: {format(new Date(deal.expectedCloseDate), 'MMM dd, yyyy')}</span>
        </div>

        {/* Assigned rep avatar */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {deal.assignedRep.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-xs text-gray-600 truncate">{deal.assignedRep}</span>
        </div>

        {/* Weighted value */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Weighted Value:</span>
            <span className="font-medium text-gray-700">
              {formatCurrency(deal.value * deal.probability / 100)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DealCard;