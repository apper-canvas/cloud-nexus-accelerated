import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import CompanyForm from "@/components/organisms/CompanyForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { companyService } from "@/services/api/companyService";

const EditCompany = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCompany = async () => {
    try {
      setError("");
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await companyService.getById(parseInt(id));
      if (!data) {
        setError("Company not found.");
        return;
      }
      setCompany(data);
    } catch (err) {
      setError("Failed to load company details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await companyService.update(parseInt(id), formData);
    } catch (error) {
      throw new Error("Failed to update company");
    }
  };

  useEffect(() => {
    loadCompany();
  }, [id]);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Companies", href: "/companies" },
    { label: company?.name || "Edit Company" }
  ];

  if (loading) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Loading message="Loading company..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Error message={error} onRetry={loadCompany} />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <CompanyForm 
        company={company}
        onSubmit={handleSubmit}
        isEditing={true}
      />
    </div>
  );
};

export default EditCompany;