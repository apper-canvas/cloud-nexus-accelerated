import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import ContactList from "@/components/organisms/ContactList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { contactService } from "@/services/api/contactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContacts = async () => {
    try {
      setError("");
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(contact => contact.Id !== contactId));
      toast.success("Contact deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete contact. Please try again.");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Contacts" }
  ];

  if (loading) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Loading message="Loading contacts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Error message={error} onRetry={loadContacts} />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <ContactList 
        contacts={contacts}
        onDeleteContact={handleDeleteContact}
      />
    </div>
  );
};

export default Contacts;