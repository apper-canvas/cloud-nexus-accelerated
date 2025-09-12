import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Search" className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;