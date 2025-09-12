import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet.",
  action,
  icon = "Inbox"
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {action && (
          <Button onClick={action.onClick} href={action.href}>
            <ApperIcon name={action.icon || "Plus"} className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;