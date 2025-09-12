import React, { useState } from 'react'
import Activities from '@/components/pages/Activities'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DealPipeline from "@/components/pages/DealPipeline";
import DealDetail from "@/components/pages/DealDetail";
import AddDeal from "@/components/pages/AddDeal";
import ContactDetail from "@/components/pages/ContactDetail";
import EditCompany from "@/components/pages/EditCompany";
import Contacts from "@/components/pages/Contacts";
import ComingSoon from "@/components/pages/ComingSoon";
import Companies from "@/components/pages/Companies";
import EditContact from "@/components/pages/EditContact";
import CompanyDetail from "@/components/pages/CompanyDetail";
import AddContact from "@/components/pages/AddContact";
import AddCompany from "@/components/pages/AddCompany";
import Dashboard from "@/components/pages/Dashboard";
import Leads from "@/components/pages/Leads";
import AddLead from "@/components/pages/AddLead";
import LeadDetail from "@/components/pages/LeadDetail";
import EditLead from "@/components/pages/EditLead";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

// Pages
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={handleMenuClick} />
            
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/contacts/new" element={<AddContact />} />
                  <Route path="/contacts/:id" element={<ContactDetail />} />
                  <Route path="/contacts/:id/edit" element={<EditContact />} />
                  <Route 
path="/companies" 
                  element={<Companies />}
                />
                <Route 
                  path="/companies/new" 
                  element={<AddCompany />}
                />
                <Route 
                  path="/companies/:id" 
                  element={<CompanyDetail />}
                />
                <Route 
                  path="/companies/:id/edit" 
                  element={<EditCompany />}
                />
                  <Route 
path="/leads" 
                    element={<Leads />} 
                  />
                  <Route 
                    path="/leads/new" 
                    element={<AddLead />} 
                  />
                  <Route 
                    path="/leads/:id" 
                    element={<LeadDetail />} 
                  />
                  <Route 
                    path="/leads/:id/edit" 
                    element={<EditLead />}
                  />
<Route 
                    path="/deals" 
element={<DealPipeline />}
                />
                <Route 
                  path="/deals/new" 
                  element={<AddDeal />}
                />
                <Route 
                  path="/deals/:id" 
                  element={<DealDetail />}
                />
                  <Route
                    path="/invoices" 
                    element={
                      <ComingSoon 
                        title="Invoice Management"
                        description="Create, track, and manage customer invoices."
                        icon="FileText"
                        breadcrumbs={[
                          { label: "Dashboard", href: "/" },
                          { label: "Invoices" }
                        ]}
                      />
                    } 
                  />
<Route 
                    path="/activities" 
                    element={
                      <Activities />
                    } 
                  />
                  <Route 
                    path="/reports" 
                    element={
                      <ComingSoon 
                        title="Reports & Analytics"
                        description="Generate insights from your sales and customer data."
                        icon="BarChart3"
                        breadcrumbs={[
                          { label: "Dashboard", href: "/" },
                          { label: "Reports" }
                        ]}
                      />
                    } 
                  />
                </Routes>
              </div>
            </main>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;