import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.deals];
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
      ...dealData,
      stage: dealData.stage || 'Prospecting',
      probability: dealData.probability || 20,
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