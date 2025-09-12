import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import LeadForm from "@/components/organisms/LeadForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { leadService } from "@/services/api/leadService";

const AddLead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Leads", href: "/leads" },
    { label: "Add Lead" }
  ];

  const handleSubmit = async (leadData) => {
    try {
      setLoading(true);
      setError(null);
      const newLead = await leadService.create(leadData);
      toast.success("Lead created successfully!");
      navigate(`/leads/${newLead.Id}`);
    } catch (err) {
      console.error("Error creating lead:", err);
      setError(err.message);
      toast.error("Failed to create lead");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (error) return <Error message={error} onRetry={() => setError(null)} />;

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <LeadForm 
        onSubmit={handleSubmit}
        isSubmitting={loading}
        title="Add New Lead"
      />
    </div>
  );
};

export default AddLead;