import { toast } from "react-toastify";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import CompanyForm from "@/components/organisms/CompanyForm";
import { companyService } from "@/services/api/companyService";

const AddCompany = () => {
  const handleSubmit = async (formData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await companyService.create(formData);
    } catch (error) {
      throw new Error("Failed to create company");
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Companies", href: "/companies" },
    { label: "Add Company" }
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <CompanyForm 
        onSubmit={handleSubmit}
        isEditing={false}
      />
    </div>
  );
};

export default AddCompany;