import invoicesData from '@/services/mockData/invoices.json';

class InvoiceService {
  constructor() {
    this.invoices = [...invoicesData];
    this.nextId = Math.max(...this.invoices.map(inv => inv.Id), 0) + 1;
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.invoices];
  }

  async getById(id) {
    await this.delay();
    const invoice = this.invoices.find(inv => inv.Id === parseInt(id));
    if (!invoice) {
      throw new Error(`Invoice with ID ${id} not found`);
    }
    return { ...invoice };
  }

  async create(invoiceData) {
    await this.delay();
    
    const newInvoice = {
      ...invoiceData,
      Id: this.nextId++,
      invoiceNumber: this.generateInvoiceNumber(),
      issueDate: new Date().toISOString().split('T')[0],
      paidAmount: 0.00,
      outstandingAmount: invoiceData.total,
      payments: []
    };

    this.invoices.push(newInvoice);
    return { ...newInvoice };
  }

  async update(id, invoiceData) {
    await this.delay();
    
    const index = this.invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Invoice with ID ${id} not found`);
    }

    const updatedInvoice = {
      ...this.invoices[index],
      ...invoiceData,
      Id: parseInt(id)
    };

    this.invoices[index] = updatedInvoice;
    return { ...updatedInvoice };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Invoice with ID ${id} not found`);
    }

    this.invoices.splice(index, 1);
    return { success: true };
  }

  async getStatusSummary() {
    await this.delay();
    
    const summary = {
      total: this.invoices.length,
      draft: this.invoices.filter(inv => inv.status === 'Draft').length,
      sent: this.invoices.filter(inv => inv.status === 'Sent').length,
      paid: this.invoices.filter(inv => inv.status === 'Paid').length,
      overdue: this.invoices.filter(inv => inv.status === 'Overdue').length,
      totalOutstanding: this.invoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0),
      totalPaid: this.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
    };

    return summary;
  }

  async addPayment(invoiceId, paymentData) {
    await this.delay();
    
    const invoice = this.invoices.find(inv => inv.Id === parseInt(invoiceId));
    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }

    const payment = {
      ...paymentData,
      Id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    invoice.payments.push(payment);
    invoice.paidAmount += payment.amount;
    invoice.outstandingAmount = invoice.total - invoice.paidAmount;

    if (invoice.outstandingAmount <= 0) {
      invoice.status = 'Paid';
      invoice.outstandingAmount = 0;
    }

    return { ...invoice };
  }

  generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const nextNum = this.invoices.length + 1;
    return `INV-${year}-${nextNum.toString().padStart(3, '0')}`;
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