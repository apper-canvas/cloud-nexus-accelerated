import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Loading from "@/components/ui/Loading";
import { dealService } from "@/services/api/dealService";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";
import { cn } from "@/utils/cn";

const DealDetailModal = ({ dealId, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [company, setCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (isOpen && dealId) {
      loadDealData();
    }
  }, [isOpen, dealId]);

  const loadDealData = async () => {
    try {
      setLoading(true);
      const dealData = await dealService.getById(parseInt(dealId));
      if (!dealData) {
        toast.error("Deal not found");
        onClose();
        return;
      }
      
      setDeal(dealData);
      setEditData({
        value: dealData.value,
        expectedCloseDate: dealData.expectedCloseDate
      });

      // Load related company and contacts
      const [companyData, contactsData] = await Promise.all([
        dealData.companyId ? companyService.getById(dealData.companyId) : null,
        contactService.getAll()
      ]);

      setCompany(companyData);
      setContacts(contactsData.filter(c => c.companyId === dealData.companyId));
    } catch (error) {
      toast.error("Failed to load deal details");
      console.error("Error loading deal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedDeal = await dealService.update(deal.Id, editData);
      setDeal(updatedDeal);
      setIsEditing(false);
      toast.success("Deal updated successfully");
    } catch (error) {
      toast.error("Failed to update deal");
      console.error("Error updating deal:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      value: deal.value,
      expectedCloseDate: deal.expectedCloseDate
    });
    setIsEditing(false);
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

  // Mock activity timeline data
  const mockActivities = [
    {
      id: 1,
      type: 'note',
      title: 'Initial discovery call completed',
      description: 'Discussed requirements and budget parameters',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      user: 'Sarah Johnson'
    },
    {
      id: 2,
      type: 'email',
      title: 'Proposal sent',
      description: 'Detailed proposal with pricing breakdown',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      user: 'Sarah Johnson'
    },
    {
      id: 3,
      type: 'call',
      title: 'Follow-up call scheduled',
      description: 'Next steps discussion planned for Friday',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      user: 'Sarah Johnson'
    }
  ];

  // Mock progression history
  const mockProgression = [
    {
      id: 1,
      stage: 'Prospecting',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      user: 'Sarah Johnson',
      probability: 20
    },
    {
      id: 2,
      stage: 'Qualification',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      user: 'Sarah Johnson',
      probability: 40
    },
    {
      id: 3,
      stage: 'Proposal',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      user: 'Sarah Johnson',
      probability: 65
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'note': return 'FileText';
      case 'email': return 'Mail';
      case 'call': return 'Phone';
      case 'meeting': return 'Calendar';
      default: return 'Activity';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        {loading ? (
          <div className="p-8">
            <Loading />
          </div>
        ) : deal ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 truncate">
                  {deal.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Deal #{deal.Id} • Created {format(new Date(deal.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Check" className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)] overflow-hidden">
              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Deal Overview */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Deal Value</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editData.value}
                            onChange={(e) => setEditData({...editData, value: parseInt(e.target.value)})}
                            className="mt-1"
                            min="0"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {formatCurrency(deal.value)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Expected Close Date</Label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editData.expectedCloseDate}
                            onChange={(e) => setEditData({...editData, expectedCloseDate: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-lg text-gray-900 mt-1">
                            {format(new Date(deal.expectedCloseDate), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Probability</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn("text-lg font-semibold", getProbabilityColor(deal.probability))}>
                            {deal.probability}%
                          </span>
                          <Badge variant={getStatusBadge(deal.stage)} size="sm">
                            {deal.stage}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Weighted Value</Label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {formatCurrency(deal.value * deal.probability / 100)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Assigned Rep</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {deal.assignedRep.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-gray-900">{deal.assignedRep}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Company & Contacts */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company & Contacts</h3>
                    <div className="space-y-4">
                      {company ? (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Link 
                                to={`/companies/${company.Id}`}
                                className="text-lg font-semibold text-primary hover:underline"
                              >
                                {company.name}
                              </Link>
                              <p className="text-sm text-gray-600">{company.industry}</p>
                              <p className="text-sm text-gray-600">{company.location}</p>
                            </div>
                            <ApperIcon name="ExternalLink" className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No company linked</p>
                      )}
                      
                      {contacts.length > 0 ? (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Associated Contacts</Label>
                          {contacts.slice(0, 3).map(contact => (
                            <div key={contact.Id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                              <div>
                                <Link 
                                  to={`/contacts/${contact.Id}`}
                                  className="font-medium text-primary hover:underline"
                                >
                                  {contact.firstName} {contact.lastName}
                                </Link>
                                <p className="text-sm text-gray-600">{contact.title}</p>
                                <p className="text-sm text-gray-600">{contact.email}</p>
                              </div>
                              <ApperIcon name="ExternalLink" className="h-4 w-4 text-gray-400" />
                            </div>
                          ))}
                          {contacts.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{contacts.length - 3} more contacts
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No contacts linked</p>
                      )}
                    </div>
                  </Card>

                  {/* Activity Timeline */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                    <div className="space-y-4">
                      {mockActivities.map(activity => (
                        <div key={activity.id} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                            <ApperIcon name={getActivityIcon(activity.type)} className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              <p className="text-xs text-gray-500">
                                {format(activity.date, 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                          </div>
                        </div>
                      ))}
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 italic">
                          Activity tracking will be available with full CRM integration
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Deal Progression History */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Progression</h3>
                    <div className="space-y-4">
                      {mockProgression.map((stage, index) => (
                        <div key={stage.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              index === mockProgression.length - 1 
                                ? "bg-primary text-white" 
                                : "bg-success text-white"
                            )}>
                              <ApperIcon name="Check" className="h-4 w-4" />
                            </div>
                            {index < mockProgression.length - 1 && (
                              <div className="w-0.5 h-6 bg-gray-300 mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{stage.stage}</span>
                                <Badge variant={getStatusBadge(stage.stage)} size="sm">
                                  {stage.probability}%
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                {format(stage.date, 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Stage updated by {stage.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">Deal not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealDetailModal;