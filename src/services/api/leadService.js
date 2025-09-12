class LeadService {
  constructor() {
    this.tableName = 'lead_c';
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "company_size_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "assigned_rep_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch leads: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching leads:", error);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "company_size_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "assigned_rep_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch lead: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching lead by ID:", error);
      throw error;
    }
  }

  async create(leadData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Calculate lead score
      const score = this.calculateLeadScore(leadData);

      const params = {
        records: [{
          Name: `${leadData.first_name_c || leadData.firstName} ${leadData.last_name_c || leadData.lastName}`,
          Tags: leadData.Tags || "",
          first_name_c: leadData.first_name_c || leadData.firstName,
          last_name_c: leadData.last_name_c || leadData.lastName,
          email_c: leadData.email_c || leadData.email,
          phone_c: leadData.phone_c || leadData.phone,
          company_c: leadData.company_c || leadData.company,
          company_size_c: leadData.company_size_c || leadData.companySize,
          title_c: leadData.title_c || leadData.title,
          source_c: leadData.source_c || leadData.source,
          status_c: leadData.status_c || leadData.status || "new",
          score_c: score,
          assigned_rep_c: leadData.assigned_rep_c || leadData.assignedRep,
          notes_c: leadData.notes_c || leadData.notes,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create lead: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to create lead");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  }

  async update(id, leadData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Recalculate score if relevant data changed
      let score = leadData.score_c || leadData.score;
      if (leadData.source_c || leadData.source || leadData.company_size_c || leadData.companySize) {
        score = this.calculateLeadScore(leadData);
      }

      const params = {
        records: [{
          Id: id,
          Name: leadData.first_name_c || leadData.lastName ? 
            `${leadData.first_name_c || leadData.firstName} ${leadData.last_name_c || leadData.lastName}` : 
            leadData.Name,
          Tags: leadData.Tags || "",
          first_name_c: leadData.first_name_c || leadData.firstName,
          last_name_c: leadData.last_name_c || leadData.lastName,
          email_c: leadData.email_c || leadData.email,
          phone_c: leadData.phone_c || leadData.phone,
          company_c: leadData.company_c || leadData.company,
          company_size_c: leadData.company_size_c || leadData.companySize,
          title_c: leadData.title_c || leadData.title,
          source_c: leadData.source_c || leadData.source,
          status_c: leadData.status_c || leadData.status,
          score_c: score,
          assigned_rep_c: leadData.assigned_rep_c || leadData.assignedRep,
          notes_c: leadData.notes_c || leadData.notes,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update lead: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to update lead");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating lead:", error);
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
        console.error(`Failed to delete lead: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          throw new Error(result.message || "Failed to delete lead");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  }

  calculateLeadScore(leadData) {
    let score = 0;
    
    // Source quality scoring
    const sourceScores = {
      referral: 80,
      web: 60,
      cold: 40
    };
    
    const source = leadData.source_c || leadData.source;
    score += sourceScores[source] || 40;
    
    // Company size multiplier
    const sizeMultipliers = {
      "1-10": 1.0,
      "11-50": 1.1,
      "51-200": 1.15,
      "201-500": 1.2,
      "501-1000": 1.25,
      "1000+": 1.3
    };
    
    const companySize = leadData.company_size_c || leadData.companySize;
    const multiplier = sizeMultipliers[companySize] || 1.0;
    score = Math.round(score * multiplier);
    
    // Cap at 100
    return Math.min(score, 100);
  }

  async updateStatus(id, newStatus) {
    try {
      return await this.update(id, { status_c: newStatus });
    } catch (error) {
      console.error("Error updating lead status:", error);
      throw error;
    }
  }
}

export const leadService = new LeadService();