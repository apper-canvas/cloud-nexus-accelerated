import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { cn } from '@/utils/cn';

const TaskForm = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'medium',
    tags: '',
    estimatedHours: '',
    contactId: '',
    companyId: '',
    dealId: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignee: task.assignee || '',
        priority: task.priority || 'medium',
        tags: task.Tags || '',
        estimatedHours: task.duration_c || '',
        contactId: task.contactId || '',
        companyId: task.companyId || '',
        dealId: task.dealId || ''
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.assignee.trim()) {
      newErrors.assignee = 'Assignee is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        companyId: formData.companyId ? parseInt(formData.companyId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null
      };

      await onSubmit(taskData);
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600 bg-green-50' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'high', label: 'High Priority', color: 'text-red-600 bg-red-50' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div>
              <Label htmlFor="title" className="required">Task Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter task title..."
                className={cn(errors.title && "border-red-500")}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe the task details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Due Date and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate" className="required">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={cn(errors.dueDate && "border-red-500")}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assignee and Estimated Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignee" className="required">Assignee</Label>
                <Input
                  id="assignee"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleInputChange}
                  placeholder="Enter assignee name..."
                  className={cn(errors.assignee && "border-red-500")}
                />
                {errors.assignee && (
                  <p className="text-sm text-red-600 mt-1">{errors.assignee}</p>
                )}
              </div>

              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  name="estimatedHours"
                  type="number"
                  min="1"
                  value={formData.estimatedHours}
                  onChange={handleInputChange}
                  placeholder="Hours needed"
                />
              </div>
            </div>

            {/* Related Entities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactId">Related Contact ID</Label>
                <Input
                  id="contactId"
                  name="contactId"
                  type="number"
                  value={formData.contactId}
                  onChange={handleInputChange}
                  placeholder="Contact ID"
                />
              </div>

              <div>
                <Label htmlFor="companyId">Related Company ID</Label>
                <Input
                  id="companyId"
                  name="companyId"
                  type="number"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  placeholder="Company ID"
                />
              </div>

              <div>
                <Label htmlFor="dealId">Related Deal ID</Label>
                <Input
                  id="dealId"
                  name="dealId"
                  type="number"
                  value={formData.dealId}
                  onChange={handleInputChange}
                  placeholder="Deal ID"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Additional Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Priority will be automatically added to tags
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default TaskForm;