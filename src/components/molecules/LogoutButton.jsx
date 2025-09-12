import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center space-x-2">
      <ApperIcon name="LogOut" className="h-5 w-5" />
      <span className="text-sm font-medium">Logout</span>
    </Button>
  );
};

export default LogoutButton;