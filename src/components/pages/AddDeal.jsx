import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import CompanySelector from "@/components/molecules/CompanySelector";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { dealService } from "@/services/api/dealService";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";

const AddDeal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedCompanyContacts, setSelectedCompanyContacts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    value: "",
    expectedCloseDate: "",
    companyId: "",
    contactId: "",
    stage: "Prospecting",
    probability: 20,
    assignedRep: "Sarah Johnson",
    description: ""
  });

  const [errors, setErrors] = useState({});

  const stages = [
    { id: 'Prospecting', name: 'Prospecting', probability: 20 },
    { id: 'Qualification', name: 'Qualification', probability: 40 },
    { id: 'Proposal', name: 'Proposal', probability: 60 },
    { id: 'Negotiation', name: 'Negotiation', probability: 80 },
    { id: 'Closed', name: 'Closed', probability: 100 }
  ];

  const salesReps = [
    "Sarah Johnson",
    "Michael Chen", 
    "Emily Rodriguez",
    "David Kim",
    "Lisa Thompson"
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.companyId) {
      const companyContacts = contacts.filter(contact => contact.companyId === parseInt(formData.companyId));
      setSelectedCompanyContacts(companyContacts);
      if (companyContacts.length > 0 && !formData.contactId) {
        setFormData(prev => ({ ...prev, contactId: companyContacts[0].Id }));
      }
    } else {
      setSelectedCompanyContacts([]);
      setFormData(prev => ({ ...prev, contactId: "" }));
    }
  }, [formData.companyId, contacts]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const [companiesData, contactsData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll()
      ]);
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load companies and contacts");
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Update probability when stage changes
    if (name === 'stage') {
      const selectedStage = stages.find(stage => stage.id === value);
      if (selectedStage) {
        setFormData(prev => ({ ...prev, probability: selectedStage.probability }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0";
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    }

    if (!formData.companyId) {
      newErrors.companyId = "Please select a company";
    }

    if (!formData.assignedRep) {
      newErrors.assignedRep = "Please select a sales rep";
    }

    const closeDate = new Date(formData.expectedCloseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (closeDate < today) {
      newErrors.expectedCloseDate = "Expected close date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      const dealData = {
        ...formData,
        value: parseInt(formData.value),
        companyId: parseInt(formData.companyId),
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        probability: parseInt(formData.probability)
      };

      const newDeal = await dealService.create(dealData);
      toast.success("Deal created successfully!");
      navigate(`/deals/${newDeal.Id}`);
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error("Failed to create deal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/deals");
  };

  if (loadingData) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="p-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Deals", href: "/deals" },
          { label: "New Deal" }
        ]}
      />

      <div className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Deal</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Deal Information */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Deal Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter deal title"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="value">Deal Value *</Label>
                      <Input
                        id="value"
                        name="value"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.value}
                        onChange={handleInputChange}
                        placeholder="0"
                        className={errors.value ? "border-red-500" : ""}
                      />
                      {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                    </div>

                    <div>
                      <Label htmlFor="expectedCloseDate">Expected Close Date *</Label>
                      <Input
                        id="expectedCloseDate"
                        name="expectedCloseDate"
                        type="date"
                        value={formData.expectedCloseDate}
                        onChange={handleInputChange}
                        className={errors.expectedCloseDate ? "border-red-500" : ""}
                      />
                      {errors.expectedCloseDate && <p className="mt-1 text-sm text-red-600">{errors.expectedCloseDate}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter deal description..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>
              </Card>

              {/* Company & Contact Selection */}
              <Card className="p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Company & Contact</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyId">Company *</Label>
                    <select
                      id="companyId"
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${errors.companyId ? "border-red-500" : ""}`}
                    >
                      <option value="">Select a company...</option>
                      {companies.map(company => (
                        <option key={company.Id} value={company.Id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {errors.companyId && <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>}
                  </div>

                  {selectedCompanyContacts.length > 0 && (
                    <div>
                      <Label htmlFor="contactId">Primary Contact</Label>
                      <select
                        id="contactId"
                        name="contactId"
                        value={formData.contactId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      >
                        <option value="">No specific contact</option>
                        {selectedCompanyContacts.map(contact => (
                          <option key={contact.Id} value={contact.Id}>
                            {contact.firstName} {contact.lastName} - {contact.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Deal Stage & Assignment */}
            <div>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Stage & Assignment</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stage">Deal Stage</Label>
                    <select
                      id="stage"
                      name="stage"
                      value={formData.stage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      {stages.map(stage => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                      id="probability"
                      name="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="assignedRep">Assigned Sales Rep *</Label>
                    <select
                      id="assignedRep"
                      name="assignedRep"
                      value={formData.assignedRep}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${errors.assignedRep ? "border-red-500" : ""}`}
                    >
                      <option value="">Select a sales rep...</option>
                      {salesReps.map(rep => (
                        <option key={rep} value={rep}>
                          {rep}
                        </option>
                      ))}
                    </select>
                    {errors.assignedRep && <p className="mt-1 text-sm text-red-600">{errors.assignedRep}</p>}
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                      Creating Deal...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                      Create Deal
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeal;