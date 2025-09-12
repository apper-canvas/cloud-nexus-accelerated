import companiesData from "@/services/mockData/companies.json";

class CompanyService {
  constructor() {
    this.companies = [...companiesData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.companies];
  }

  async getById(id) {
    await this.delay();
    const company = this.companies.find(c => c.Id === id);
    return company ? { ...company } : null;
  }

  async create(companyData) {
    await this.delay();
    const newCompany = {
      ...companyData,
      Id: Math.max(...this.companies.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.companies.push(newCompany);
    return { ...newCompany };
  }

  async update(id, companyData) {
    await this.delay();
    const index = this.companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Company not found");
    }
    
    const updatedCompany = {
      ...this.companies[index],
      ...companyData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    this.companies[index] = updatedCompany;
    return { ...updatedCompany };
  }

  async delete(id) {
    await this.delay();
    const index = this.companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Company not found");
    }
    this.companies.splice(index, 1);
    return true;
  }

  async getCompanyOptions() {
    await this.delay();
    return this.companies.map(company => ({
      value: company.Id,
      label: company.name
    }));
  }
}

export const companyService = new CompanyService();