import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const CompanyForm = ({ company, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    location: "",
    website: "",
    relationshipStage: "",
    description: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Manufacturing",
    "Finance",
    "Retail",
    "Education",
    "Real Estate",
    "Consulting",
    "Other"
  ];

  const sizeOptions = [
    "1-10",
    "11-50", 
    "51-200",
    "201-500",
    "501-1000",
    "1000+"
  ];

  const relationshipStageOptions = [
    "Lead",
    "Prospect",
    "Active Client",
    "Former Client",
    "Partner"
  ];

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        industry: company.industry || "",
        size: company.size || "",
        location: company.location || "",
        website: company.website || "",
        relationshipStage: company.relationshipStage || "",
        description: company.description || ""
      });
    }
  }, [company]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }
    
    if (!formData.size.trim()) {
      newErrors.size = "Company size is required";
    }
    
    if (!formData.relationshipStage.trim()) {
      newErrors.relationshipStage = "Relationship stage is required";
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = "Please enter a valid website URL";
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
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      toast.success(
        isEditing 
          ? "Company updated successfully!" 
          : "Company created successfully!"
      );
      navigate(isEditing ? `/companies/${company.Id}` : "/companies");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(isEditing ? `/companies/${company?.Id}` : "/companies");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mr-4">
            <ApperIcon name="Building" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Company" : "Add New Company"}
            </h1>
            <p className="text-gray-600">
              {isEditing 
                ? "Update company information and details" 
                : "Create a new company profile"
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="Enter company name"
            />

            <FormField
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              error={errors.industry}
              required
            >
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.industry ? 'border-error' : ''
                }`}
              >
                <option value="">Select industry</option>
                {industryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Company Size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              error={errors.size}
              required
            >
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.size ? 'border-error' : ''
                }`}
              >
                <option value="">Select company size</option>
                {sizeOptions.map(option => (
                  <option key={option} value={option}>{option} employees</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Relationship Stage"
              name="relationshipStage"
              value={formData.relationshipStage}
              onChange={handleChange}
              error={errors.relationshipStage}
              required
            >
              <select
                name="relationshipStage"
                value={formData.relationshipStage}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.relationshipStage ? 'border-error' : ''
                }`}
              >
                <option value="">Select relationship stage</option>
                {relationshipStageOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="Enter location"
            />

            <FormField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              error={errors.website}
              placeholder="https://company.com"
            />
          </div>

          <FormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Enter company description"
          >
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary resize-none"
              placeholder="Enter company description"
            />
          </FormField>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Company" : "Create Company"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanyForm;