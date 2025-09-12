import { toast } from "react-toastify";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import ContactForm from "@/components/organisms/ContactForm";
import { contactService } from "@/services/api/contactService";

const AddContact = () => {
  const handleSubmit = async (formData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await contactService.create(formData);
    } catch (error) {
      throw new Error("Failed to create contact");
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Contacts", href: "/contacts" },
    { label: "Add Contact" }
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <ContactForm 
        onSubmit={handleSubmit}
        isEditing={false}
      />
    </div>
  );
};

export default AddContact;