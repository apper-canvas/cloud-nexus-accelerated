class DealService {
  constructor() {
    this.tableName = 'deal_c';
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "assigned_rep_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch deals: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "assigned_rep_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch deal: ${response.message}`);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching deal by ID:", error);
      return null;
    }
  }

  async create(dealData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
          Name: dealData.title_c || dealData.title,
          Tags: dealData.Tags || "",
          title_c: dealData.title_c || dealData.title,
          company_id_c: dealData.company_id_c || dealData.companyId,
          value_c: dealData.value_c || dealData.value,
          stage_c: dealData.stage_c || dealData.stage || 'Prospecting',
          probability_c: dealData.probability_c || dealData.probability || 20,
          expected_close_date_c: dealData.expected_close_date_c || dealData.expectedCloseDate,
          assigned_rep_c: dealData.assigned_rep_c || dealData.assignedRep,
          description_c: dealData.description_c || dealData.description || '',
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create deal: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to create deal");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
          Id: id,
          Name: dealData.title_c || dealData.title,
          Tags: dealData.Tags || "",
          title_c: dealData.title_c || dealData.title,
          company_id_c: dealData.company_id_c || dealData.companyId,
          value_c: dealData.value_c || dealData.value,
          stage_c: dealData.stage_c || dealData.stage,
          probability_c: dealData.probability_c || dealData.probability,
          expected_close_date_c: dealData.expected_close_date_c || dealData.expectedCloseDate,
          assigned_rep_c: dealData.assigned_rep_c || dealData.assignedRep,
          description_c: dealData.description_c || dealData.description,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update deal: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to update deal");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating deal:", error);
      throw error;
    }
  }

  async updateStage(id, newStage, probability) {
    try {
      return await this.update(id, { 
        stage_c: newStage,
        probability_c: probability 
      });
    } catch (error) {
      console.error("Error updating deal stage:", error);
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
        console.error(`Failed to delete deal: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          throw new Error(result.message || "Failed to delete deal");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }
  }

  async getDealsByStage(stage) {
    try {
      const deals = await this.getAll();
      return deals.filter(deal => (deal.stage_c || deal.stage) === stage);
    } catch (error) {
      console.error("Error fetching deals by stage:", error);
      return [];
    }
  }

  async getDealsByCompany(companyId) {
    try {
      const deals = await this.getAll();
      return deals.filter(deal => (deal.company_id_c || deal.companyId) === companyId);
    } catch (error) {
      console.error("Error fetching deals by company:", error);
      return [];
    }
  }
}

export const dealService = new DealService();