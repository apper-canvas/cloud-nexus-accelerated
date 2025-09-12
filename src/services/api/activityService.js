import activitiesData from '@/services/mockData/activities.json';

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll(filters = {}) {
    await this.delay();
    let filtered = [...this.activities];

    if (filters.entityType && filters.entityId) {
      const entityIdField = `${filters.entityType}Id`;
      filtered = filtered.filter(activity => activity[entityIdField] === parseInt(filters.entityId));
    }

    if (filters.type) {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    if (filters.startDate) {
      filtered = filtered.filter(activity => new Date(activity.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(activity => new Date(activity.date) <= new Date(filters.endDate));
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await this.delay();
    return this.activities.find(activity => activity.Id === parseInt(id)) || null;
  }

  async getByEntity(entityType, entityId) {
    await this.delay();
    const entityIdField = `${entityType}Id`;
    return this.activities
      .filter(activity => activity[entityIdField] === parseInt(entityId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async create(activityData) {
    await this.delay();
    const newActivity = {
      ...activityData,
      Id: Math.max(...this.activities.map(a => a.Id), 0) + 1,
      date: activityData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.activities.push(newActivity);

    // Update last contact date on related entities
    await this.updateEntityLastContact(newActivity);
    
    return newActivity;
  }

  async update(id, activityData) {
    await this.delay();
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Activity not found');
    }

    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return this.activities[index];
  }

  async delete(id) {
    await this.delay();
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const deleted = this.activities.splice(index, 1)[0];
    return deleted;
  }

  async updateEntityLastContact(activity) {
    const now = new Date().toISOString();
    
    // Update contact last contact date
    if (activity.contactId) {
      const { contactService } = await import('@/services/api/contactService');
      const contact = await contactService.getById(activity.contactId);
      if (contact) {
        await contactService.update(activity.contactId, { lastContactDate: now });
      }
    }

    // Update company last contact date  
    if (activity.companyId) {
      const { companyService } = await import('@/services/api/companyService');
      const company = await companyService.getById(activity.companyId);
      if (company) {
        await companyService.update(activity.companyId, { lastContactDate: now });
      }
    }

    // Update deal last contact date
    if (activity.dealId) {
      const { dealService } = await import('@/services/api/dealService');
      const deal = await dealService.getById(activity.dealId);
      if (deal) {
        await dealService.update(activity.dealId, { lastContactDate: now });
      }
    }
  }

  async getRecentActivities(limit = 5) {
    await this.delay();
    return this.activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  async getActivityStats() {
    await this.delay();
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = this.activities.filter(a => new Date(a.date) >= weekAgo).length;
    const thisMonth = this.activities.filter(a => new Date(a.date) >= monthAgo).length;
    
    const byType = this.activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total: this.activities.length,
      thisWeek,
      thisMonth,
      byType
    };
  }
}

export const activityService = new ActivityService();