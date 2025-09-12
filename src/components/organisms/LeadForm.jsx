import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import FormField from "@/components/molecules/FormField";

const LeadForm = ({ 
  lead = null, 
  onSubmit, 
  isSubmitting = false, 
  isEditing = false,
  title = "Lead Information"
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    companySize: "",
    title: "",
    source: "",
    assignedRep: "Sarah Johnson",
    notes: ""
  });
  const [errors, setErrors] = useState({});

  const sources = [
    { value: "referral", label: "Referral" },
    { value: "web", label: "Website" },
    { value: "cold", label: "Cold Outreach" }
  ];

  const companySizes = [
    "1-10",
    "11-50", 
    "51-200",
    "201-500",
    "501-1000",
    "1000+"
  ];

  const salesReps = [
    "Sarah Johnson",
    "Michael Chen", 
    "Emily Rodriguez",
    "David Kim",
    "Lisa Thompson"
  ];

  useEffect(() => {
    if (lead) {
      setFormData({
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        companySize: lead.companySize || "",
        title: lead.title || "",
        source: lead.source || "",
        assignedRep: lead.assignedRep || "Sarah Johnson",
        notes: lead.notes || ""
      });
    }
  }, [lead]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }
    
    if (!formData.companySize.trim()) {
      newErrors.companySize = "Company size is required";
    }
    
    if (!formData.source.trim()) {
      newErrors.source = "Lead source is required";
    }
    
    if (!formData.assignedRep.trim()) {
      newErrors.assignedRep = "Assigned rep is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleCancel = () => {
    navigate(isEditing && lead ? `/leads/${lead.Id}` : "/leads");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">
          {isEditing ? "Update lead information and scoring" : "Capture new lead details with automatic scoring"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    required
                    placeholder="Enter first name"
                  />

                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    required
                    placeholder="Enter last name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    placeholder="Enter email address"
                  />

                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="Enter phone number"
                  />
                </div>

                <FormField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="Enter job title"
                />
              </div>
            </Card>

            {/* Company Information */}
            <Card className="p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
              <div className="space-y-4">
                <FormField
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  error={errors.company}
                  required
                  placeholder="Enter company name"
                />

                <FormField
                  label="Company Size"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  error={errors.companySize}
                  required
                >
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                      errors.companySize ? 'border-error' : ''
                    }`}
                  >
                    <option value="">Select company size</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
              <FormField
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                error={errors.notes}
                placeholder="Enter any additional notes about this lead..."
              >
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary resize-none"
                  placeholder="Enter any additional notes about this lead..."
                />
              </FormField>
            </Card>
          </div>

          {/* Lead Management */}
          <div>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Management</h2>
              <div className="space-y-4">
                <FormField
                  label="Lead Source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  error={errors.source}
                  required
                >
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                      errors.source ? 'border-error' : ''
                    }`}
                  >
                    <option value="">Select lead source</option>
                    {sources.map(source => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Assigned Rep"
                  name="assignedRep"
                  value={formData.assignedRep}
                  onChange={handleChange}
                  error={errors.assignedRep}
                  required
                >
                  <select
                    name="assignedRep"
                    value={formData.assignedRep}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                      errors.assignedRep ? 'border-error' : ''
                    }`}
                  >
                    <option value="">Select sales rep</option>
                    {salesReps.map(rep => (
                      <option key={rep} value={rep}>{rep}</option>
                    ))}
                  </select>
                </FormField>

                {(formData.source || formData.companySize) && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                      <ApperIcon name="Target" className="inline h-4 w-4 mr-1" />
                      Lead Score Preview
                    </h3>
                    <div className="text-sm text-blue-700">
                      <p>Score will be calculated based on:</p>
                      <ul className="mt-1 space-y-1">
                        {formData.source && (
                          <li>• Source ({formData.source}): {
                            formData.source === 'referral' ? '80 pts' : 
                            formData.source === 'web' ? '60 pts' : '40 pts'
                          }</li>
                        )}
                        {formData.companySize && (
                          <li>• Company size multiplier</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {isEditing ? "Update Lead" : "Create Lead"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;