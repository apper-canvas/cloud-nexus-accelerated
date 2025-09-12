import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const menuItems = [
    { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { label: "Contacts", href: "/contacts", icon: "Users" },
    { label: "Companies", href: "/companies", icon: "Building" },
    { label: "Leads", href: "/leads", icon: "Target" },
    { label: "Deals", href: "/deals", icon: "TrendingUp" },
    { label: "Invoices", href: "/invoices", icon: "FileText" },
    { label: "Activities", href: "/activities", icon: "Calendar" },
    { label: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { label: "Reports", href: "/reports", icon: "BarChart3" }
  ];

  const isActiveRoute = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Mobile sidebar with overlay
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity z-40 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent onItemClick={onClose} />
      </div>
    </>
  );

  // Desktop sidebar - static positioning
  const DesktopSidebar = () => (
    <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
      <div className="flex flex-col h-full bg-white border-r border-gray-200">
        <SidebarContent />
      </div>
    </div>
  );

  const SidebarContent = ({ onItemClick }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">Nexus CRM</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onItemClick}
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActiveRoute(item.href)
                ? "bg-blue-50 text-primary border-r-2 border-primary"
                : "text-gray-700 hover:text-primary hover:bg-gray-50"
            )}
          >
            <ApperIcon 
              name={item.icon} 
              className={cn(
                "mr-3 h-5 w-5",
                isActiveRoute(item.href) ? "text-primary" : "text-gray-400 group-hover:text-primary"
              )} 
            />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
</div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default Sidebar;