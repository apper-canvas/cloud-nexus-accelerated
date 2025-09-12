import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.contacts];
  }

  async getById(id) {
    await this.delay(200);
    const contact = this.contacts.find(c => c.Id === id);
    return contact ? { ...contact } : null;
  }

  async create(contactData) {
    await this.delay(400);
    const highestId = Math.max(...this.contacts.map(c => c.Id), 0);
    const newContact = {
      Id: highestId + 1,
...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactDate: null
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await this.delay(400);
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    return { ...this.contacts[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts.splice(index, 1);
    return true;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const contactService = new ContactService();