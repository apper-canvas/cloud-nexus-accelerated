import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import CompanyList from "@/components/organisms/CompanyList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { companyService } from "@/services/api/companyService";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCompanies = async () => {
    try {
      setError("");
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      await companyService.delete(companyId);
      setCompanies(prev => prev.filter(company => company.Id !== companyId));
      toast.success("Company deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete company. Please try again.");
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Companies" }
  ];

  if (loading) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Loading message="Loading companies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Error message={error} onRetry={loadCompanies} />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <CompanyList 
        companies={companies}
        onDeleteCompany={handleDeleteCompany}
      />
    </div>
  );
};

export default Companies;