class ReportService {
  constructor() {
    this.tableName = 'report_c';
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

  async getAll(filters = {}) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "kpis_c"}},
          {"field": {"Name": "chart_data_c"}},
          {"field": {"Name": "report_metrics_c"}},
          {"field": {"Name": "lead_report_data_c"}},
          {"field": {"Name": "deal_report_data_c"}},
          {"field": {"Name": "performance_report_data_c"}}
        ],
        where: [],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch reports: ${response.message}`);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
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
          {"field": {"Name": "kpis_c"}},
          {"field": {"Name": "chart_data_c"}},
          {"field": {"Name": "report_metrics_c"}},
          {"field": {"Name": "lead_report_data_c"}},
          {"field": {"Name": "deal_report_data_c"}},
          {"field": {"Name": "performance_report_data_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch report: ${response.message}`);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching report by ID:", error);
      return null;
    }
  }

  async create(reportData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
          Name: reportData.Name || reportData.name,
          Tags: reportData.Tags || "",
          kpis_c: reportData.kpis_c || reportData.kpis || "",
          chart_data_c: reportData.chart_data_c || reportData.chartData || "",
          report_metrics_c: reportData.report_metrics_c || reportData.reportMetrics || "",
          lead_report_data_c: reportData.lead_report_data_c || reportData.leadReportData || "",
          deal_report_data_c: reportData.deal_report_data_c || reportData.dealReportData || "",
          performance_report_data_c: reportData.performance_report_data_c || reportData.performanceReportData || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create report: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to create report");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

  async update(id, reportData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
          Id: id,
          Name: reportData.Name || reportData.name,
          Tags: reportData.Tags || "",
          kpis_c: reportData.kpis_c || reportData.kpis || "",
          chart_data_c: reportData.chart_data_c || reportData.chartData || "",
          report_metrics_c: reportData.report_metrics_c || reportData.reportMetrics || "",
          lead_report_data_c: reportData.lead_report_data_c || reportData.leadReportData || "",
          deal_report_data_c: reportData.deal_report_data_c || reportData.dealReportData || "",
          performance_report_data_c: reportData.performance_report_data_c || reportData.performanceReportData || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update report: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to update report");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating report:", error);
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
        console.error(`Failed to delete report: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          throw new Error(result.message || "Failed to delete report");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  }

  // KPI Calculation Methods
  async getKPIs() {
    try {
      const { dealService } = await import('./dealService.js');
      const { leadService } = await import('./leadService.js');
      const { companyService } = await import('./companyService.js');

      const [deals, leads, companies] = await Promise.all([
        dealService.getAll().catch(() => []),
        leadService.getAll().catch(() => []),
        companyService.getAll().catch(() => [])
      ]);

      // Calculate total revenue from closed deals
      const closedDeals = deals.filter(deal => deal.stage_c === 'Closed' || deal.stage === 'Closed');
      const totalRevenue = closedDeals.reduce((sum, deal) => sum + (parseFloat(deal.value_c || deal.value || 0)), 0);

      // Calculate deals closed this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const dealsClosedThisMonth = closedDeals.filter(deal => {
        const closeDate = new Date(deal.expected_close_date_c || deal.expectedCloseDate);
        return closeDate >= thisMonth;
      }).length;

      // Calculate lead conversion rate
      const qualifiedLeads = leads.filter(lead => lead.status_c === 'qualified' || lead.status === 'qualified').length;
      const totalLeads = leads.length;
      const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : 0;

      // Calculate average deal size
      const avgDealSize = closedDeals.length > 0 ? (totalRevenue / closedDeals.length) : 0;

      return {
        totalRevenue,
        dealsClosedThisMonth,
        leadConversionRate: conversionRate,
        averageDealSize: avgDealSize,
        totalLeads,
        qualifiedLeads,
        totalCompanies: companies.length,
        openDeals: deals.filter(deal => deal.stage_c !== 'Closed' && deal.stage !== 'Closed').length
      };
    } catch (error) {
      console.error("Error calculating KPIs:", error);
      return {
        totalRevenue: 0,
        dealsClosedThisMonth: 0,
        leadConversionRate: 0,
        averageDealSize: 0,
        totalLeads: 0,
        qualifiedLeads: 0,
        totalCompanies: 0,
        openDeals: 0
      };
    }
  }

  // Chart Data Generation
  async getPipelineHealthData() {
    try {
      const { dealService } = await import('./dealService.js');
      const deals = await dealService.getAll().catch(() => []);

      const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed'];
      const pipelineData = stages.map(stage => {
        const stageDeals = deals.filter(deal => (deal.stage_c || deal.stage) === stage);
        const totalValue = stageDeals.reduce((sum, deal) => sum + (parseFloat(deal.value_c || deal.value || 0)), 0);
        return {
          stage,
          count: stageDeals.length,
          value: totalValue
        };
      });

      return pipelineData;
    } catch (error) {
      console.error("Error generating pipeline health data:", error);
      return [];
    }
  }

  async getLeadSourceData() {
    try {
      const { leadService } = await import('./leadService.js');
      const leads = await leadService.getAll().catch(() => []);

      const sources = ['referral', 'web', 'cold'];
      const sourceData = sources.map(source => {
        const sourceLeads = leads.filter(lead => (lead.source_c || lead.source) === source);
        const qualified = sourceLeads.filter(lead => (lead.status_c || lead.status) === 'qualified').length;
        const conversionRate = sourceLeads.length > 0 ? ((qualified / sourceLeads.length) * 100).toFixed(1) : 0;
        return {
          source: source.charAt(0).toUpperCase() + source.slice(1),
          count: sourceLeads.length,
          qualified,
          conversionRate: parseFloat(conversionRate)
        };
      });

      return sourceData;
    } catch (error) {
      console.error("Error generating lead source data:", error);
      return [];
    }
  }

  async getSalesRepPerformance() {
    try {
      const { dealService } = await import('./dealService.js');
      const { activityService } = await import('./activityService.js');
      const [deals, activities] = await Promise.all([
        dealService.getAll().catch(() => []),
        activityService.getAll().catch(() => [])
      ]);

      const reps = [...new Set(deals.map(deal => deal.assigned_rep_c || deal.assignedRep).filter(Boolean))];
      
      const repPerformance = reps.map(rep => {
        const repDeals = deals.filter(deal => (deal.assigned_rep_c || deal.assignedRep) === rep);
        const closedDeals = repDeals.filter(deal => (deal.stage_c || deal.stage) === 'Closed');
        const totalValue = closedDeals.reduce((sum, deal) => sum + (parseFloat(deal.value_c || deal.value || 0)), 0);
        const repActivities = activities.filter(activity => (activity.user_name_c || activity.userName) === rep);

        return {
          rep,
          totalDeals: repDeals.length,
          closedDeals: closedDeals.length,
          totalValue,
          activities: repActivities.length,
          winRate: repDeals.length > 0 ? ((closedDeals.length / repDeals.length) * 100).toFixed(1) : 0
        };
      });

      return repPerformance.sort((a, b) => b.totalValue - a.totalValue);
    } catch (error) {
      console.error("Error generating sales rep performance data:", error);
      return [];
    }
  }

  // Lead Report Data
  async getLeadReports() {
    try {
      const { leadService } = await import('./leadService.js');
      const leads = await leadService.getAll().catch(() => []);

      const conversionBySource = await this.getLeadSourceData();
      
      // Lead aging analysis
      const now = new Date();
      const leadAging = leads.map(lead => {
        const createdDate = new Date(lead.created_at_c || lead.createdAt);
        const daysSinceCreated = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
        return {
          ...lead,
          daysSinceCreated
        };
      });

      const agingBuckets = {
        '0-7 days': leadAging.filter(lead => lead.daysSinceCreated <= 7).length,
        '8-30 days': leadAging.filter(lead => lead.daysSinceCreated > 7 && lead.daysSinceCreated <= 30).length,
        '31-90 days': leadAging.filter(lead => lead.daysSinceCreated > 30 && lead.daysSinceCreated <= 90).length,
        '90+ days': leadAging.filter(lead => lead.daysSinceCreated > 90).length
      };

      // Qualification metrics
      const qualificationMetrics = {
        new: leads.filter(lead => (lead.status_c || lead.status) === 'new').length,
        contacted: leads.filter(lead => (lead.status_c || lead.status) === 'contacted').length,
        qualified: leads.filter(lead => (lead.status_c || lead.status) === 'qualified').length,
        unqualified: leads.filter(lead => (lead.status_c || lead.status) === 'unqualified').length
      };

      return {
        conversionBySource,
        agingBuckets,
        qualificationMetrics,
        totalLeads: leads.length
      };
    } catch (error) {
      console.error("Error generating lead reports:", error);
      return {
        conversionBySource: [],
        agingBuckets: {},
        qualificationMetrics: {},
        totalLeads: 0
      };
    }
  }

  // Deal Report Data
  async getDealReports() {
    try {
      const { dealService } = await import('./dealService.js');
      const deals = await dealService.getAll().catch(() => []);

      // Pipeline velocity (average days in each stage)
      const pipelineVelocity = await this.calculatePipelineVelocity(deals);

      // Win/Loss analysis
      const winLossAnalysis = {
        won: deals.filter(deal => (deal.stage_c || deal.stage) === 'Closed' && (deal.probability_c || deal.probability) >= 100).length,
        lost: deals.filter(deal => (deal.stage_c || deal.stage) === 'Closed' && (deal.probability_c || deal.probability) < 100).length,
        inProgress: deals.filter(deal => (deal.stage_c || deal.stage) !== 'Closed').length
      };

      // Forecasting accuracy
      const forecastingAccuracy = await this.calculateForecastingAccuracy(deals);

      return {
        pipelineVelocity,
        winLossAnalysis,
        forecastingAccuracy,
        totalDeals: deals.length
      };
    } catch (error) {
      console.error("Error generating deal reports:", error);
      return {
        pipelineVelocity: {},
        winLossAnalysis: {},
        forecastingAccuracy: 0,
        totalDeals: 0
      };
    }
  }

  async calculatePipelineVelocity(deals) {
    // Simplified pipeline velocity calculation
    const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation'];
    const velocity = {};

    stages.forEach(stage => {
      const stageDeals = deals.filter(deal => (deal.stage_c || deal.stage) === stage);
      // Average time would require historical stage change data
      // For now, using estimated average based on deal age
      const avgDays = stageDeals.length > 0 ? 
        stageDeals.reduce((sum, deal) => {
          const createdDate = new Date(deal.created_at_c || deal.createdAt);
          const daysSinceCreated = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
          return sum + daysSinceCreated;
        }, 0) / stageDeals.length : 0;

      velocity[stage] = Math.round(avgDays);
    });

    return velocity;
  }

  async calculateForecastingAccuracy(deals) {
    // Simplified forecasting accuracy - comparing expected vs actual close dates
    const closedDeals = deals.filter(deal => (deal.stage_c || deal.stage) === 'Closed');
    if (closedDeals.length === 0) return 0;

    let accurateForecasts = 0;
    closedDeals.forEach(deal => {
      const expectedDate = new Date(deal.expected_close_date_c || deal.expectedCloseDate);
      const actualDate = new Date(deal.updated_at_c || deal.updatedAt);
      const diffDays = Math.abs((expectedDate - actualDate) / (1000 * 60 * 60 * 24));
      
      // Consider accurate if within 7 days
      if (diffDays <= 7) {
        accurateForecasts++;
      }
    });

    return ((accurateForecasts / closedDeals.length) * 100).toFixed(1);
  }
}

export const reportService = new ReportService();