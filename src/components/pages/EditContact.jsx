import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import ContactForm from "@/components/organisms/ContactForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { contactService } from "@/services/api/contactService";

const EditContact = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
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
    } catch (err) {
      setError("Failed to load contact details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await contactService.update(parseInt(id), formData);
    } catch (error) {
      throw new Error("Failed to update contact");
    }
  };

  useEffect(() => {
    loadContact();
  }, [id]);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Contacts", href: "/contacts" },
{ label: (() => {
        if (contact?.first_name_c || contact?.last_name_c) {
          const firstName = contact.first_name_c || '';
          const lastName = contact.last_name_c || '';
          const fullName = `${firstName} ${lastName}`.trim();
          return fullName ? `Edit ${fullName}` : "Edit Contact";
        }
        return contact?.name_c || contact?.name ? `Edit ${contact.name_c || contact.name}` : "Edit Contact";
      })() 
    }
  ];

  if (loading) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <Loading message="Loading contact..." />
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
      <ContactForm 
        contact={contact}
        onSubmit={handleSubmit}
        isEditing={true}
      />
    </div>
  );
};

export default EditContact;