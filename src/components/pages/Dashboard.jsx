import React, { useEffect, useState } from "react";
import { contactService } from "@/services/api/contactService";
import { reportService } from "@/services/api/reportService";
import DashboardOverview from "@/components/organisms/DashboardOverview";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Dashboard = () => {
const [contacts, setContacts] = useState([]);
  const [reportKpis, setReportKpis] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const [contactsData, kpisData] = await Promise.all([
        contactService.getAll(),
        reportService.getKPIs()
      ]);
      
      setContacts(contactsData);
      setReportKpis(kpisData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" }
  ];

  if (loading) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Loading message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
<div>
        <Breadcrumbs items={breadcrumbs} />
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

const metrics = {
    totalContacts: contacts.length,
    activeLeads: reportKpis.totalLeads || 0,
    openDeals: reportKpis.openDeals || 0,
    revenue: reportKpis.totalRevenue || 0,
    dealsClosed: reportKpis.dealsClosedThisMonth || 0,
    conversionRate: reportKpis.leadConversionRate || 0
  };

const quickActions = [
    {
      title: "Add Contact",
      description: "Create a new contact",
      icon: "UserPlus",
      href: "/contacts/new"
    },
    {
      title: "Add Company",
      description: "Create a new company",
      icon: "Building",
      href: "/companies/new"
    },
    {
      title: "New Lead",
      description: "Add a new lead",
      icon: "Target",
      href: "/leads/new"
    },
    {
      title: "Create Deal",
      description: "Start a new deal",
      icon: "Plus",
      href: "/deals/new"
    },
    {
      title: "View Reports",
      description: "Analytics & insights",
      icon: "BarChart3",
      href: "/reports"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      description: "New contact added: John Smith",
      type: "contact",
      icon: "UserPlus",
      createdAt: new Date(2024, 0, 15, 14, 30)
    },
    {
      id: 2,
      description: "Deal closed: Tech Solutions Inc",
      type: "deal",
      icon: "TrendingUp",
      createdAt: new Date(2024, 0, 15, 11, 45)
    },
    {
      id: 3,
      description: "Follow-up email sent to Sarah Johnson",
      type: "activity",
      icon: "Mail",
      createdAt: new Date(2024, 0, 14, 16, 20)
    },
    {
      id: 4,
      description: "Meeting scheduled with ABC Corp",
      type: "activity",
      icon: "Calendar",
      createdAt: new Date(2024, 0, 14, 10, 15)
    },
    {
      id: 5,
      description: "New lead: Enterprise Software Ltd",
      type: "lead",
      icon: "Target",
      createdAt: new Date(2024, 0, 13, 15, 30)
    }
  ];

  return (
<div>
      <Breadcrumbs items={breadcrumbs} />
      <DashboardOverview 
        metrics={metrics}
        reportKpis={reportKpis}
        recentActivities={recentActivities}
        quickActions={quickActions}
      />
    </div>
  );
};

export default Dashboard;