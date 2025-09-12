import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import LeadForm from "@/components/organisms/LeadForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { leadService } from "@/services/api/leadService";

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Leads", href: "/leads" },
    { label: lead ? `${lead.firstName} ${lead.lastName}` : "Lead", href: lead ? `/leads/${lead.Id}` : "/leads" },
    { label: "Edit" }
  ];

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadService.getById(parseInt(id));
      setLead(data);
    } catch (err) {
      console.error("Error loading lead:", err);
      setError(err.message);
      toast.error("Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (leadData) => {
    try {
      setSubmitting(true);
      setError(null);
      const updatedLead = await leadService.update(parseInt(id), leadData);
      toast.success("Lead updated successfully!");
      navigate(`/leads/${updatedLead.Id}`);
    } catch (err) {
      console.error("Error updating lead:", err);
      setError(err.message);
      toast.error("Failed to update lead");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLead} />;
  if (!lead) return <Error message="Lead not found" onRetry={() => navigate("/leads")} />;

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <LeadForm 
        lead={lead}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        isEditing={true}
        title="Edit Lead"
      />
    </div>
  );
};

export default EditLead;