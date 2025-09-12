class ActivityService {
  constructor() {
    this.tableName = 'activity_c';
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        where: [],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      // Apply filters
      if (filters.entityType && filters.entityId) {
        const entityIdField = `${filters.entityType}_id_c`;
        params.where.push({
          "FieldName": entityIdField,
          "Operator": "EqualTo", 
          "Values": [parseInt(filters.entityId)]
        });
      }

      if (filters.type) {
        params.where.push({
          "FieldName": "type_c",
          "Operator": "EqualTo",
          "Values": [filters.type]
        });
      }

      if (filters.startDate) {
        params.where.push({
          "FieldName": "date_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [filters.startDate]
        });
      }

      if (filters.endDate) {
        params.where.push({
          "FieldName": "date_c",
          "Operator": "LessThanOrEqualTo",
          "Values": [filters.endDate]
        });
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch activities: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch activity: ${response.message}`);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching activity by ID:", error);
      return null;
    }
  }

  async getByEntity(entityType, entityId) {
    try {
      const filters = {
        entityType,
        entityId: parseInt(entityId)
      };
      return await this.getAll(filters);
    } catch (error) {
      console.error("Error fetching activities by entity:", error);
      throw error;
    }
  }

  async create(activityData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
          Name: activityData.title_c || activityData.title,
          Tags: activityData.Tags || "",
          type_c: activityData.type_c || activityData.type,
          title_c: activityData.title_c || activityData.title,
          description_c: activityData.description_c || activityData.description,
          outcome_c: activityData.outcome_c || activityData.outcome,
          date_c: activityData.date_c || activityData.date || new Date().toISOString(),
          duration_c: activityData.duration_c || activityData.duration,
          contact_id_c: activityData.contact_id_c || activityData.contactId,
          company_id_c: activityData.company_id_c || activityData.companyId,
          deal_id_c: activityData.deal_id_c || activityData.dealId,
          user_id_c: activityData.user_id_c || activityData.userId,
          user_name_c: activityData.user_name_c || activityData.userName,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create activity: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to create activity");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  }

  async update(id, activityData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
          Id: id,
          Name: activityData.title_c || activityData.title,
          Tags: activityData.Tags || "",
          type_c: activityData.type_c || activityData.type,
          title_c: activityData.title_c || activityData.title,
          description_c: activityData.description_c || activityData.description,
          outcome_c: activityData.outcome_c || activityData.outcome,
          date_c: activityData.date_c || activityData.date,
          duration_c: activityData.duration_c || activityData.duration,
          contact_id_c: activityData.contact_id_c || activityData.contactId,
          company_id_c: activityData.company_id_c || activityData.companyId,
          deal_id_c: activityData.deal_id_c || activityData.dealId,
          user_id_c: activityData.user_id_c || activityData.userId,
          user_name_c: activityData.user_name_c || activityData.userName,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update activity: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to update activity");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating activity:", error);
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
        console.error(`Failed to delete activity: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          throw new Error(result.message || "Failed to delete activity");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  }

  async getRecentActivities(limit = 5) {
    try {
      const activities = await this.getAll();
      return activities.slice(0, limit);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
  }

async getActivityStats() {
    try {
      const activities = await this.getAll();
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const thisWeek = activities.filter(a => new Date(a.date_c) >= weekAgo).length;
      const thisMonth = activities.filter(a => new Date(a.date_c) >= monthAgo).length;
      
      const byType = activities.reduce((acc, activity) => {
        const type = activity.type_c || activity.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      return {
        total: activities.length,
        thisWeek,
        thisMonth,
        byType
      };
    } catch (error) {
      console.error("Error fetching activity stats:", error);
      return {
        total: 0,
        thisWeek: 0,
        thisMonth: 0,
        byType: {}
      };
    }
  }

  // Task-specific methods
  async getTasks(filters = {}) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        where: [
          {"FieldName": "type_c", "Operator": "EqualTo", "Values": ["task"]}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };

      // Add status filter
      if (filters.status === 'completed') {
        params.where.push({"FieldName": "outcome_c", "Operator": "HasValue", "Values": [""]});
      } else if (filters.status === 'pending') {
        params.where.push({"FieldName": "outcome_c", "Operator": "DoesNotHaveValue", "Values": [""]});
      }

      // Add assignee filter
      if (filters.assignee) {
        params.where.push({"FieldName": "user_name_c", "Operator": "EqualTo", "Values": [filters.assignee]});
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks:", response.message);
        return [];
      }

      return response.data?.map(task => ({
        ...task,
        id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        status: task.outcome_c ? 'completed' : 'pending',
        dueDate: task.date_c,
        assignee: task.user_name_c,
        priority: this.extractPriorityFromTags(task.Tags),
        contactId: task.contact_id_c,
        companyId: task.company_id_c,
        dealId: task.deal_id_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  async getTasksByStatus(status) {
    return this.getTasks({ status });
  }

  async getTasksByAssignee(assignee) {
    return this.getTasks({ assignee });
  }

  async getOverdueTasks() {
    try {
      const allTasks = await this.getTasks({ status: 'pending' });
      const today = new Date();
      return allTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < today;
      });
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
      return [];
    }
  }

  async getTaskStats() {
    try {
      const allTasks = await this.getTasks();
      const pendingTasks = allTasks.filter(t => t.status === 'pending');
      const completedTasks = allTasks.filter(t => t.status === 'completed');
      const overdueTasks = await this.getOverdueTasks();

      const today = new Date();
      const thisWeek = allTasks.filter(t => {
        if (!t.createdAt) return false;
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return new Date(t.createdAt) >= weekAgo;
      }).length;

      const byPriority = allTasks.reduce((acc, task) => {
        const priority = task.priority || 'medium';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

      return {
        total: allTasks.length,
        pending: pendingTasks.length,
        completed: completedTasks.length,
        overdue: overdueTasks.length,
        thisWeek,
        completionRate: allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0,
        byPriority
      };
    } catch (error) {
      console.error("Error fetching task stats:", error);
      return {
        total: 0,
        pending: 0,
        completed: 0,
        overdue: 0,
        thisWeek: 0,
        completionRate: 0,
        byPriority: {}
      };
    }
  }

  async createTask(taskData) {
    const activityData = {
      title_c: taskData.title,
      description_c: taskData.description,
      type_c: 'task',
      date_c: taskData.dueDate || new Date().toISOString(),
      user_name_c: taskData.assignee,
      Tags: this.formatTagsWithPriority(taskData.priority, taskData.tags),
      contact_id_c: taskData.contactId,
      company_id_c: taskData.companyId,
      deal_id_c: taskData.dealId,
      duration_c: taskData.estimatedHours
    };

    return this.create(activityData);
  }

  async updateTaskStatus(taskId, completed, completionNotes = '') {
    const updateData = {
      outcome_c: completed ? (completionNotes || 'Task completed') : null,
      updated_at_c: new Date().toISOString()
    };

    return this.update(taskId, updateData);
  }

  extractPriorityFromTags(tags) {
    if (!tags) return 'medium';
    const tagList = tags.toLowerCase().split(',');
    if (tagList.includes('high')) return 'high';
    if (tagList.includes('low')) return 'low';
    return 'medium';
  }

  formatTagsWithPriority(priority, additionalTags = '') {
    const priorityTag = priority || 'medium';
    const tags = additionalTags ? `${priorityTag},${additionalTags}` : priorityTag;
    return tags;
  }
}

export const activityService = new ActivityService();