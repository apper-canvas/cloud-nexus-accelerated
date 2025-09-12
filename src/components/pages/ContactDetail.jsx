import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import ContactDetails from "@/components/organisms/ContactDetails";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { activityService } from "@/services/api/activityService";
const ContactDetail = () => {
const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [linkedCompany, setLinkedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadContact = async () => {
    try {
      setError("");
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await contactService.getById(parseInt(id));
      if (!data) {
        setError("Contact not found.");
        return;
      }
      setContact(data);
      
      // Load linked company if contact has one
      if (data.company) {
        try {
          const companies = await companyService.getAll();
          const company = companies.find(c => c.name === data.company);
          if (company) {
            setLinkedCompany(company);
          }
        } catch (companyErr) {
          console.error("Failed to load company details:", companyErr);
        }
      }
    } catch (err) {
      setError("Failed to load contact details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContact();
  }, [id]);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Contacts", href: "/contacts" },
    { label: contact?.name || "Contact Detail" }
  ];

  if (loading) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Loading message="Loading contact details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Error message={error} onRetry={loadContact} />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
<ContactDetails contact={contact} linkedCompany={linkedCompany} contactId={parseInt(id)} />
    </div>
  );
};

export default ContactDetail;