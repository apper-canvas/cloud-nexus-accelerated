import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend = null,
  color = "primary" 
}) => {
  const colorClasses = {
    primary: "bg-blue-50 text-primary",
    success: "bg-green-50 text-success",
    warning: "bg-yellow-50 text-warning",
    error: "bg-red-50 text-error"
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.positive ? 'text-success' : 'text-error'}`}>
              <ApperIcon 
                name={trend.positive ? "TrendingUp" : "TrendingDown"} 
                className="h-4 w-4 mr-1" 
              />
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;