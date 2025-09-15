class InvoiceService {
  constructor() {
    this.tableName = 'invoice_c';
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
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "issue_date_c"}},
{"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "tax_rate_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "paid_amount_c"}},
          {"field": {"Name": "outstanding_amount_c"}},
          {"field": {"Name": "payment_terms_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "item_service_name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "tax_percent_c"}},
          {"field": {"Name": "discount_percent_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch invoices: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching invoices:", error);
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
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "company_name_c"}},
{"field": {"Name": "issue_date_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "tax_rate_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "paid_amount_c"}},
          {"field": {"Name": "outstanding_amount_c"}},
          {"field": {"Name": "payment_terms_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "item_service_name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "tax_percent_c"}},
          {"field": {"Name": "discount_percent_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch invoice: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching invoice by ID:", error);
      throw error;
    }
  }

  async create(invoiceData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
records: [{
          Name: invoiceData.invoice_number_c || this.generateInvoiceNumber(),
          Tags: invoiceData.Tags || "",
          invoice_number_c: invoiceData.invoice_number_c || this.generateInvoiceNumber(),
          company_id_c: invoiceData.company_id_c || invoiceData.companyId,
          company_name_c: invoiceData.company_name_c || invoiceData.companyName,
          issue_date_c: invoiceData.issue_date_c || new Date().toISOString().split('T')[0],
          due_date_c: invoiceData.due_date_c || invoiceData.dueDate,
          status_c: invoiceData.status_c || invoiceData.status || 'Draft',
          subtotal_c: invoiceData.subtotal_c || invoiceData.subtotal,
          tax_rate_c: invoiceData.tax_rate_c || invoiceData.taxRate,
          tax_amount_c: invoiceData.tax_amount_c || invoiceData.taxAmount,
          total_c: invoiceData.total_c || invoiceData.total,
          paid_amount_c: 0.00,
          outstanding_amount_c: invoiceData.total_c || invoiceData.total,
          payment_terms_c: invoiceData.payment_terms_c || invoiceData.paymentTerms,
          notes_c: invoiceData.notes_c || invoiceData.notes,
          item_service_name_c: invoiceData.item_service_name_c || "",
          description_c: invoiceData.description_c || "",
          tax_percent_c: invoiceData.tax_percent_c || 0,
          discount_percent_c: invoiceData.discount_percent_c || 0
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create invoice: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to create invoice");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }

  async update(id, invoiceData) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        records: [{
Id: id,
          Name: invoiceData.invoice_number_c || invoiceData.invoiceNumber,
          Tags: invoiceData.Tags || "",
          invoice_number_c: invoiceData.invoice_number_c || invoiceData.invoiceNumber,
          company_id_c: invoiceData.company_id_c || invoiceData.companyId,
          company_name_c: invoiceData.company_name_c || invoiceData.companyName,
          issue_date_c: invoiceData.issue_date_c || invoiceData.issueDate,
          due_date_c: invoiceData.due_date_c || invoiceData.dueDate,
          status_c: invoiceData.status_c || invoiceData.status,
          subtotal_c: invoiceData.subtotal_c || invoiceData.subtotal,
          tax_rate_c: invoiceData.tax_rate_c || invoiceData.taxRate,
          tax_amount_c: invoiceData.tax_amount_c || invoiceData.taxAmount,
          total_c: invoiceData.total_c || invoiceData.total,
          paid_amount_c: invoiceData.paid_amount_c || invoiceData.paidAmount,
          outstanding_amount_c: invoiceData.outstanding_amount_c || invoiceData.outstandingAmount,
          payment_terms_c: invoiceData.payment_terms_c || invoiceData.paymentTerms,
          notes_c: invoiceData.notes_c || invoiceData.notes,
          item_service_name_c: invoiceData.item_service_name_c || "",
          description_c: invoiceData.description_c || "",
          tax_percent_c: invoiceData.tax_percent_c || 0,
          discount_percent_c: invoiceData.discount_percent_c || 0
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update invoice: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to update invoice");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating invoice:", error);
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
        console.error(`Failed to delete invoice: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return { success: true };
        } else {
          throw new Error(result.message || "Failed to delete invoice");
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }
  }

  async getStatusSummary() {
    try {
      const invoices = await this.getAll();
      
      const summary = {
        total: invoices.length,
        draft: invoices.filter(inv => (inv.status_c || inv.status) === 'Draft').length,
        sent: invoices.filter(inv => (inv.status_c || inv.status) === 'Sent').length,
        paid: invoices.filter(inv => (inv.status_c || inv.status) === 'Paid').length,
        overdue: invoices.filter(inv => (inv.status_c || inv.status) === 'Overdue').length,
        totalOutstanding: invoices.reduce((sum, inv) => sum + (inv.outstanding_amount_c || inv.outstandingAmount || 0), 0),
        totalPaid: invoices.reduce((sum, inv) => sum + (inv.paid_amount_c || inv.paidAmount || 0), 0)
      };

      return summary;
    } catch (error) {
      console.error("Error getting status summary:", error);
      return {
        total: 0,
        draft: 0,
        sent: 0,
        paid: 0,
        overdue: 0,
        totalOutstanding: 0,
        totalPaid: 0
      };
    }
  }

  generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${year}-${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  }

  calculateTotals(lineItems, taxRate = 0) {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  }
}

export default new InvoiceService();