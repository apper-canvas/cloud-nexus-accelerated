import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import CompanySelector from "@/components/molecules/CompanySelector";
import ApperIcon from "@/components/ApperIcon";
const ContactForm = ({ contact, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    company: "",
    address: "",
    notes: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        position: contact.position || "",
        company: contact.company || "",
        address: contact.address || "",
        notes: contact.notes || ""
      });
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
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
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      toast.success(isEditing ? "Contact updated successfully!" : "Contact created successfully!");
      navigate("/contacts");
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/contacts");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <ApperIcon name="User" className="h-6 w-6 text-primary mr-3" />
        <h2 className="text-xl font-bold text-gray-900">
          {isEditing ? "Edit Contact" : "Add New Contact"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Enter full name"
          />

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
            required
            placeholder="Enter phone number"
          />

          <FormField
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            error={errors.position}
            placeholder="Enter job position"
          />

<FormField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
            required
          >
            <CompanySelector
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
              required
              placeholder="Select company"
            />
          </FormField>

          <FormField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="Enter address"
          />
        </div>

        <FormField
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          error={errors.notes}
        >
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Add any additional notes about this contact..."
          />
        </FormField>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
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
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {isEditing ? "Update Contact" : "Create Contact"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ContactForm;