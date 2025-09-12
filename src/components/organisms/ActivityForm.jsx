import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import { contactService } from '@/services/api/contactService';
import { companyService } from '@/services/api/companyService';
import { dealService } from '@/services/api/dealService';
import { cn } from '@/utils/cn';

const ActivityForm = ({ isOpen, onClose, onSubmit, preSelectedEntity = null }) => {
  const [formData, setFormData] = useState({
    type: 'call',
    title: '',
    description: '',
    outcome: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duration: '',
    contactId: '',
    companyId: '',
    dealId: ''
  });

  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadEntityData();
      
      // Pre-select entity if provided
      if (preSelectedEntity) {
        setFormData(prev => ({
          ...prev,
          [`${preSelectedEntity.type}Id`]: preSelectedEntity.id
        }));
      }
    }
  }, [isOpen, preSelectedEntity]);

  const loadEntityData = async () => {
    try {
      const [contactsData, companiesData, dealsData] = await Promise.all([
        contactService.getAll(),
        companyService.getAll(),
        dealService.getAll()
      ]);
      
      setContacts(contactsData);
      setCompanies(companiesData);
      setDeals(dealsData);
    } catch (err) {
      console.error('Error loading entity data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const activityData = {
        ...formData,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        companyId: formData.companyId ? parseInt(formData.companyId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        userId: 'sarah.johnson',
        userName: 'Sarah Johnson'
      };

      await onSubmit(activityData);
      resetForm();
    } catch (err) {
      console.error('Error submitting activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'call',
      title: '',
      description: '',
      outcome: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      duration: '',
      contactId: '',
      companyId: '',
      dealId: ''
    });
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

  const activityTypes = [
    { value: 'call', label: 'Call', color: 'bg-green-100 text-green-800' },
    { value: 'email', label: 'Email', color: 'bg-blue-100 text-blue-800' },
    { value: 'meeting', label: 'Meeting', color: 'bg-purple-100 text-purple-800' },
    { value: 'note', label: 'Note', color: 'bg-gray-100 text-gray-800' },
    { value: 'task', label: 'Task', color: 'bg-orange-100 text-orange-800' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Log New Activity</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Activity Type Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Activity Type
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {activityTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2",
                      formData.type === type.value
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <ApperIcon name={getActivityIcon(type.value)} className="h-5 w-5" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Activity Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter activity title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what happened during this activity"
                rows={3}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Outcome */}
            <div>
              <Label htmlFor="outcome">Outcome</Label>
              <textarea
                id="outcome"
                value={formData.outcome}
                onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
                placeholder="What was the result or next steps?"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Date and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              {(formData.type === 'call' || formData.type === 'meeting') && (
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="30"
                    min="1"
                  />
                </div>
              )}
            </div>

            {/* Entity Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactId">Related Contact</Label>
                <select
                  id="contactId"
                  value={formData.contactId}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Contact</option>
                  {contacts.map(contact => (
                    <option key={contact.Id} value={contact.Id}>
                      {contact.firstName} {contact.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="companyId">Related Company</Label>
                <select
                  id="companyId"
                  value={formData.companyId}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.Id} value={company.Id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="dealId">Related Deal</Label>
                <select
                  id="dealId"
                  value={formData.dealId}
                  onChange={(e) => setFormData(prev => ({ ...prev, dealId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Deal</option>
                  {deals.map(deal => (
                    <option key={deal.Id} value={deal.Id}>
                      {deal.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" className="h-4 w-4" />
                    Log Activity
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ActivityForm;