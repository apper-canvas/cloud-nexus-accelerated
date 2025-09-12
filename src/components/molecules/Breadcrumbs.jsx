import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ApperIcon name="ChevronRight" className="h-4 w-4 mx-2" />
          )}
          {item.href && index < items.length - 1 ? (
            <Link 
              to={item.href} 
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-gray-900 font-medium" : ""}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;