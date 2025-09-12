import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import LeadList from "@/components/organisms/LeadList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { leadService } from "@/services/api/leadService";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Leads" }
  ];

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadService.getAll();
      setLeads(data);
    } catch (err) {
      console.error("Error loading leads:", err);
      setError(err.message);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      await leadService.delete(leadId);
      setLeads(prev => prev.filter(lead => lead.Id !== leadId));
      toast.success("Lead deleted successfully");
    } catch (err) {
      console.error("Error deleting lead:", err);
      toast.error("Failed to delete lead");
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const updatedLead = await leadService.updateStatus(leadId, newStatus);
      setLeads(prev => prev.map(lead => 
        lead.Id === leadId ? updatedLead : lead
      ));
      toast.success(`Lead status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating lead status:", err);
      toast.error("Failed to update lead status");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <LeadList 
        leads={leads} 
        onDeleteLead={handleDeleteLead}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Leads;