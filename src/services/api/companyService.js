class CompanyService {
  constructor() {
    this.tableName = 'company_c';
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
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "relationship_stage_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_count_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "last_contact_date_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch companies: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error);
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
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "relationship_stage_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_count_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "last_contact_date_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch company: ${response.message}`);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching company by ID:", error);
      return null;
    }
  }

  async create(companyData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
          Name: companyData.name_c || companyData.name,
          Tags: companyData.Tags || "",
          name_c: companyData.name_c || companyData.name,
          industry_c: companyData.industry_c || companyData.industry,
          size_c: companyData.size_c || companyData.size,
          location_c: companyData.location_c || companyData.location,
          website_c: companyData.website_c || companyData.website,
          relationship_stage_c: companyData.relationship_stage_c || companyData.relationshipStage,
          description_c: companyData.description_c || companyData.description,
          contact_count_c: companyData.contact_count_c || 0,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create company: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to create company");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  }

  async update(id, companyData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
          Id: id,
          Name: companyData.name_c || companyData.name,
          Tags: companyData.Tags || "",
          name_c: companyData.name_c || companyData.name,
          industry_c: companyData.industry_c || companyData.industry,
          size_c: companyData.size_c || companyData.size,
          location_c: companyData.location_c || companyData.location,
          website_c: companyData.website_c || companyData.website,
          relationship_stage_c: companyData.relationship_stage_c || companyData.relationshipStage,
          description_c: companyData.description_c || companyData.description,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update company: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to update company");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating company:", error);
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
        console.error(`Failed to delete company: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          throw new Error(result.message || "Failed to delete company");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting company:", error);
      throw error;
    }
  }

  async getCompanyOptions() {
    try {
      const companies = await this.getAll();
      return companies.map(company => ({
        value: company.Id,
        label: company.name_c || company.Name || company.name
      }));
    } catch (error) {
      console.error("Error getting company options:", error);
      return [];
    }
  }
}

export const companyService = new CompanyService();