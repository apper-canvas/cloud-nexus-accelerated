class ContactService {
  constructor() {
    this.tableName = 'contact_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
{"field": {"Name": "Tags"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "last_contact_date_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch contacts: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
{"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "last_contact_date_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch contact: ${response.message}`);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching contact by ID:", error);
      return null;
    }
  }

  async create(contactData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
Name: contactData.firstName && contactData.lastName ? 
                `${contactData.firstName} ${contactData.lastName}` : 
                contactData.firstName || contactData.name_c || contactData.name || "",
          Tags: contactData.Tags || "",
          name_c: contactData.firstName && contactData.lastName ? 
                  `${contactData.firstName} ${contactData.lastName}` : 
                  contactData.firstName || contactData.name_c || contactData.name || "",
          email_c: contactData.email_c || contactData.email,
          phone_c: contactData.phone_c || contactData.phone,
          position_c: contactData.position_c || contactData.position,
          company_c: contactData.company_c || contactData.company,
          address_c: contactData.address_c || contactData.address,
          notes_c: contactData.notes_c || contactData.notes,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create contact: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to create contact");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
          Id: id,
Name: contactData.firstName && contactData.lastName ? 
                `${contactData.firstName} ${contactData.lastName}` : 
                contactData.firstName || contactData.name_c || contactData.name || "",
          Tags: contactData.Tags || "",
          name_c: contactData.firstName && contactData.lastName ? 
                  `${contactData.firstName} ${contactData.lastName}` : 
                  contactData.firstName || contactData.name_c || contactData.name || "",
          email_c: contactData.email_c || contactData.email,
          phone_c: contactData.phone_c || contactData.phone,
          position_c: contactData.position_c || contactData.position,
          company_c: contactData.company_c || contactData.company,
          address_c: contactData.address_c || contactData.address,
          notes_c: contactData.notes_c || contactData.notes,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update contact: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to update contact");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = { 
        RecordIds: [id] 
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete contact: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          throw new Error(result.message || "Failed to delete contact");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
}

export const contactService = new ContactService();