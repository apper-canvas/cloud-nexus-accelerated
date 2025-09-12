import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import CompanyDetails from "@/components/organisms/CompanyDetails";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { companyService } from "@/services/api/companyService";
import { activityService } from "@/services/api/activityService";
const CompanyDetail = () => {
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

  useEffect(() => {
    loadCompany();
  }, [id]);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Companies", href: "/companies" },
    { label: company?.name || "Company Detail" }
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
<CompanyDetails company={company} companyId={parseInt(id)} />
    </div>
  );
};

export default CompanyDetail;