import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

async getAll() {
    await this.delay(300);
    return [...this.deals];
  }

  async getByFilters(filters = {}) {
    await this.delay(300);
    let filtered = [...this.deals];

    if (filters.rep) {
      filtered = filtered.filter(deal => deal.assignedRep === filters.rep);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(deal => 
        new Date(deal.expectedCloseDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(deal => 
        new Date(deal.expectedCloseDate) <= new Date(filters.dateTo)
      );
    }

    if (filters.minValue) {
      filtered = filtered.filter(deal => deal.value >= filters.minValue);
    }

    if (filters.maxValue) {
      filtered = filtered.filter(deal => deal.value <= filters.maxValue);
    }

    return filtered;
  }

  async getById(id) {
    await this.delay(200);
    const deal = this.deals.find(d => d.Id === id);
    return deal ? { ...deal } : null;
  }

async create(dealData) {
    await this.delay(400);
    const highestId = Math.max(...this.deals.map(d => d.Id), 0);
    const newDeal = {
      Id: highestId + 1,
      title: dealData.title,
      value: dealData.value,
      expectedCloseDate: dealData.expectedCloseDate,
      companyId: dealData.companyId,
      contactId: dealData.contactId,
      stage: dealData.stage || 'Prospecting',
      probability: dealData.probability || 20,
      assignedRep: dealData.assignedRep,
      description: dealData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await this.delay(400);
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.deals[index] };
  }

  async getDealsByRep(repName) {
    await this.delay(200);
    return this.deals.filter(deal => deal.assignedRep === repName);
  }

  async getDealsByDateRange(startDate, endDate) {
    await this.delay(200);
    return this.deals.filter(deal => {
      const dealDate = new Date(deal.expectedCloseDate);
      return dealDate >= new Date(startDate) && dealDate <= new Date(endDate);
    });
  }

  async getDealsByValueRange(minValue, maxValue) {
    await this.delay(200);
    return this.deals.filter(deal => 
      deal.value >= minValue && deal.value <= maxValue
    );
  }

  async updateStage(id, newStage, probability) {
    await this.delay(300);
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }

    this.deals[index] = {
      ...this.deals[index],
      stage: newStage,
      probability: probability,
      updatedAt: new Date().toISOString()
    };

    return { ...this.deals[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals.splice(index, 1);
    return true;
  }

  async getDealsByStage(stage) {
    await this.delay(200);
    return this.deals.filter(deal => deal.stage === stage).map(deal => ({ ...deal }));
  }

  async getDealsByCompany(companyId) {
    await this.delay(200);
    return this.deals.filter(deal => deal.companyId === companyId).map(deal => ({ ...deal }));
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const dealService = new DealService();