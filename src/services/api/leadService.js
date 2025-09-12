import leadsData from "@/services/mockData/leads.json";

class LeadService {
  constructor() {
    this.leads = [...leadsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.leads];
  }

  async getById(id) {
    await this.delay();
    const lead = this.leads.find(l => l.Id === id);
    if (!lead) {
      throw new Error("Lead not found");
    }
    return { ...lead };
  }

  async create(leadData) {
    await this.delay();
    
    // Calculate lead score
    const score = this.calculateLeadScore(leadData);
    
    const newLead = {
      ...leadData,
      Id: Math.max(...this.leads.map(l => l.Id), 0) + 1,
      score,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.leads.push(newLead);
    return { ...newLead };
  }

  async update(id, leadData) {
    await this.delay();
    const index = this.leads.findIndex(l => l.Id === id);
    if (index === -1) {
      throw new Error("Lead not found");
    }
    
    // Recalculate score if relevant data changed
    let score = this.leads[index].score;
    if (leadData.source || leadData.companySize) {
      score = this.calculateLeadScore({ ...this.leads[index], ...leadData });
    }
    
    const updatedLead = {
      ...this.leads[index],
      ...leadData,
      Id: id,
      score,
      updatedAt: new Date().toISOString()
    };
    
    this.leads[index] = updatedLead;
    return { ...updatedLead };
  }

  async delete(id) {
    await this.delay();
    const index = this.leads.findIndex(l => l.Id === id);
    if (index === -1) {
      throw new Error("Lead not found");
    }
    
    this.leads.splice(index, 1);
    return true;
  }

  async getByFilters(filters = {}) {
    await this.delay();
    let filtered = [...this.leads];

    if (filters.status) {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    if (filters.source) {
      filtered = filtered.filter(lead => lead.source === filters.source);
    }

    if (filters.assignedRep) {
      filtered = filtered.filter(lead => lead.assignedRep === filters.assignedRep);
    }

    if (filters.minScore) {
      filtered = filtered.filter(lead => lead.score >= filters.minScore);
    }

    if (filters.maxScore) {
      filtered = filtered.filter(lead => lead.score <= filters.maxScore);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm) ||
        lead.lastName.toLowerCase().includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm) ||
        lead.company.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  calculateLeadScore(leadData) {
    let score = 0;
    
    // Source quality scoring
    const sourceScores = {
      referral: 80,
      web: 60,
      cold: 40
    };
    
    score += sourceScores[leadData.source] || 40;
    
    // Company size multiplier
    const sizeMultipliers = {
      "1-10": 1.0,
      "11-50": 1.1,
      "51-200": 1.15,
      "201-500": 1.2,
      "501-1000": 1.25,
      "1000+": 1.3
    };
    
    const multiplier = sizeMultipliers[leadData.companySize] || 1.0;
    score = Math.round(score * multiplier);
    
    // Cap at 100
    return Math.min(score, 100);
  }

  async getLeadsByRep(repName) {
    await this.delay();
    return this.leads.filter(lead => lead.assignedRep === repName);
  }

  async updateStatus(id, newStatus) {
    await this.delay();
    const index = this.leads.findIndex(l => l.Id === id);
    if (index === -1) {
      throw new Error("Lead not found");
    }
    
    this.leads[index] = {
      ...this.leads[index],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.leads[index] };
  }
}

export const leadService = new LeadService();