import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import invoiceService from '@/services/api/invoiceService';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'Bank Transfer',
    reference: ''
  });

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const invoiceData = await invoiceService.getById(id);
      setInvoice(invoiceData);
      setPaymentData(prev => ({ ...prev, amount: invoiceData.outstandingAmount }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    if (parseFloat(paymentData.amount) > invoice.outstandingAmount) {
      toast.error('Payment amount cannot exceed outstanding balance');
      return;
    }

    try {
      const updatedInvoice = await invoiceService.addPayment(invoice.Id, {
        amount: parseFloat(paymentData.amount),
        method: paymentData.method,
        reference: paymentData.reference
      });
      
      setInvoice(updatedInvoice);
      setShowPaymentModal(false);
      setPaymentData({ amount: '', method: 'Bank Transfer', reference: '' });
      toast.success('Payment recorded successfully');
    } catch (err) {
      toast.error('Failed to record payment');
    }
  };

  const handleDeleteInvoice = async () => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      return;
    }

    try {
      await invoiceService.delete(invoice.Id);
      toast.success('Invoice deleted successfully');
      navigate('/invoices');
    } catch (err) {
      toast.error('Failed to delete invoice');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loading message="Loading invoice..." />;
  if (error) return <Error message={error} onRetry={loadInvoice} />;
  if (!invoice) return <Error message="Invoice not found" />;

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Invoices", href: "/invoices" },
    { label: invoice.invoiceNumber }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
          <p className="text-gray-600">{invoice.companyName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/invoices/${invoice.Id}/edit`)}>
              <ApperIcon name="Edit" size={16} className="mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <ApperIcon name="Printer" size={16} className="mr-2" />
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeleteInvoice}
              className="text-red-600 hover:text-red-800"
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
                <p className="text-sm text-gray-600">Issue Date: {invoice.issueDate}</p>
              </div>
              <div className="text-right">
<div className="text-2xl font-bold text-gray-900">${(invoice.total ?? 0).toLocaleString()}</div>
                {(invoice.outstandingAmount ?? 0) > 0 && (
                  <div className="text-sm text-red-600">
                    Outstanding: ${(invoice.outstandingAmount ?? 0).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Bill To</h3>
                <p className="text-gray-700">{invoice.companyName}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Payment Terms</h3>
                <p className="text-gray-700">{invoice.paymentTerms}</p>
                <p className="text-sm text-gray-600">Due: {invoice.dueDate}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Line Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 font-semibold text-gray-900">Description</th>
                      <th className="text-right py-2 font-semibold text-gray-900 w-20">Qty</th>
                      <th className="text-right py-2 font-semibold text-gray-900 w-24">Rate</th>
                      <th className="text-right py-2 font-semibold text-gray-900 w-24">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
{(invoice.lineItems ?? []).map(item => (
                      <tr key={item.Id} className="border-b border-gray-100">
                        <td className="py-3 text-gray-900">{item.description}</td>
                        <td className="py-3 text-right text-gray-700">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-700">${item.rate.toFixed(2)}</td>
                        <td className="py-3 text-right font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({(invoice.taxRate * 100).toFixed(1)}%):</span>
                    <span className="font-medium">${invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                  {invoice.paidAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Paid:</span>
                      <span>-${invoice.paidAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.outstandingAmount > 0 && (
                    <div className="flex justify-between text-sm font-medium text-red-600">
                      <span>Outstanding:</span>
                      <span>${invoice.outstandingAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="border-t pt-6 mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-700 text-sm">{invoice.notes}</p>
              </div>
            )}
          </Card>

          {invoice.payments && invoice.payments.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
              <div className="space-y-3">
                {invoice.payments.map(payment => (
                  <div key={payment.Id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">
                        {payment.method} • {payment.date}
                        {payment.reference && ` • Ref: ${payment.reference}`}
                      </div>
                    </div>
                    <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {invoice.outstandingAmount > 0 && (
                <Button 
                  className="w-full" 
                  onClick={() => setShowPaymentModal(true)}
                >
                  <ApperIcon name="CreditCard" size={16} className="mr-2" />
                  Record Payment
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <ApperIcon name="Send" size={16} className="mr-2" />
                Send Reminder
              </Button>
              <Button variant="outline" className="w-full">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Download PDF
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Invoice Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{invoice.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due:</span>
                <span>{invoice.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge size="sm" className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
              {invoice.outstandingAmount > 0 && (
                <div className="flex justify-between font-medium text-red-600">
                  <span>Outstanding:</span>
                  <span>${invoice.outstandingAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Record Payment</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPaymentModal(false)}>
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Payment Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={invoice.outstandingAmount}
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Outstanding: ${invoice.outstandingAmount.toFixed(2)}
                </p>
              </div>

              <div>
                <Label htmlFor="method">Payment Method *</Label>
                <select
                  id="method"
                  value={paymentData.method}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>

              <div>
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  type="text"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="Transaction ID, check number, etc."
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPayment}>
                  Record Payment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;