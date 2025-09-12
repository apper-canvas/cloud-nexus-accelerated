import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { leadService } from "@/services/api/leadService";

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Leads", href: "/leads" },
    { label: lead ? `${lead.firstName} ${lead.lastName}` : "Lead Details" }
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

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const updatedLead = await leadService.updateStatus(parseInt(id), newStatus);
      setLead(updatedLead);
      toast.success(`Lead status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update lead status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      await leadService.delete(parseInt(id));
      toast.success("Lead deleted successfully");
      navigate("/leads");
    } catch (err) {
      console.error("Error deleting lead:", err);
      toast.error("Failed to delete lead");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800", 
      qualified: "bg-green-100 text-green-800",
      unqualified: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLead} />;
  if (!lead) return <Error message="Lead not found" onRetry={() => navigate("/leads")} />;

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lead.firstName} {lead.lastName}
          </h1>
          <p className="text-gray-600">{lead.title} at {lead.company}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={`/leads/${lead.Id}/edit`}>
            <Button variant="outline" className="w-full sm:w-auto">
              <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="w-full sm:w-auto"
          >
            <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Information */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{lead.firstName} {lead.lastName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">
                  <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                    {lead.email}
                  </a>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">
                  <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                    {lead.phone}
                  </a>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-gray-900">{lead.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="text-gray-900">{lead.company}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Company Size</label>
                <p className="text-gray-900">{lead.companySize} employees</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Lead Source</label>
                <p className="text-gray-900 capitalize">{lead.source}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned Rep</label>
                <p className="text-gray-900">{lead.assignedRep}</p>
              </div>
            </div>
            
            {lead.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900 mt-1">{lead.notes}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Status & Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Current Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Lead Score</label>
                <p className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                  {lead.score}/100
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Update Status</label>
                <div className="space-y-2">
                  {['new', 'contacted', 'qualified', 'unqualified'].map(status => (
                    <Button
                      key={status}
                      variant={lead.status === status ? "default" : "outline"}
                      size="sm"
                      disabled={updating || lead.status === status}
                      onClick={() => handleStatusChange(status)}
                      className="w-full justify-start"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm text-gray-900">
                  {new Date(lead.createdAt).toLocaleDateString()} at{" "}
                  {new Date(lead.createdAt).toLocaleTimeString()}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">
                  {new Date(lead.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(lead.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;