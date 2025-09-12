import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Loading from '@/components/ui/Loading';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import CompanySelector from '@/components/molecules/CompanySelector';
import invoiceService from '@/services/api/invoiceService';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    companyId: '',
    companyName: '',
    dueDate: '',
    paymentTerms: 'Net 30',
    taxRate: 0.10,
    notes: '',
    lineItems: [
      { Id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
    ]
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0
  });

  useEffect(() => {
    calculateTotals();
  }, [formData.lineItems, formData.taxRate]);

  useEffect(() => {
    if (formData.paymentTerms) {
      const days = parseInt(formData.paymentTerms.replace('Net ', ''));
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.paymentTerms]);

  const calculateTotals = () => {
    const calculatedTotals = invoiceService.calculateTotals(formData.lineItems, formData.taxRate);
    setTotals(calculatedTotals);
  };

  const handleCompanySelect = (company) => {
    setFormData(prev => ({
      ...prev,
      companyId: company.value,
      companyName: company.label
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedItems = [...formData.lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }

    setFormData(prev => ({ ...prev, lineItems: updatedItems }));
  };

  const addLineItem = () => {
    const newId = Math.max(...formData.lineItems.map(item => item.Id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { Id: newId, description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!formData.companyId) {
      toast.error('Please select a company');
      return;
    }

    if (formData.lineItems.some(item => !item.description || item.quantity <= 0 || item.rate <= 0)) {
      toast.error('Please fill in all line item details');
      return;
    }

    try {
      setLoading(true);
      const invoiceData = {
        ...formData,
        ...totals,
        status: isDraft ? 'Draft' : 'Sent'
      };

      const newInvoice = await invoiceService.create(invoiceData);
      toast.success(`Invoice ${isDraft ? 'saved as draft' : 'created and sent'} successfully`);
      navigate(`/invoices/${newInvoice.Id}`);
    } catch (err) {
      toast.error('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Invoices", href: "/invoices" },
    { label: "Create Invoice" }
  ];

  if (loading) return <Loading message="Creating invoice..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-gray-600">Generate a new invoice for your customer</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Step {step} of 3</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            <span className={`ml-2 text-sm ${step >= stepNumber ? 'text-primary font-medium' : 'text-gray-500'}`}>
              {stepNumber === 1 && 'Company & Terms'}
              {stepNumber === 2 && 'Line Items'}
              {stepNumber === 3 && 'Review & Send'}
            </span>
            {stepNumber < 3 && (
              <div className={`w-20 h-1 ml-4 ${step > stepNumber ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Company & Payment Terms</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company">Company *</Label>
                <CompanySelector
                  value={formData.companyId ? { value: formData.companyId, label: formData.companyName } : null}
                  onChange={handleCompanySelect}
                  placeholder="Select company..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="paymentTerms">Payment Terms *</Label>
                <select
                  id="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Net 90">Net 90</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.taxRate * 100}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) / 100 || 0 }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes or payment instructions..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!formData.companyId}>
                Next: Add Line Items
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
              <Button variant="outline" size="sm" onClick={addLineItem}>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Item
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Description</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900 w-24">Qty</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900 w-32">Rate</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900 w-32">Amount</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.lineItems.map((item, index) => (
                    <tr key={item.Id} className="border-b border-gray-100">
                      <td className="py-3 px-2">
                        <Input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                          placeholder="Description of work or product..."
                          className="w-full"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        {formData.lineItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Previous
              </Button>
              <Button onClick={() => setStep(3)} disabled={formData.lineItems.some(item => !item.description)}>
                Next: Review
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Invoice</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Invoice Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium">{formData.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Terms:</span>
                      <span className="font-medium">{formData.paymentTerms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Rate:</span>
                      <span className="font-medium">{(formData.taxRate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {formData.notes && (
                  <div className="bg-gray-50 rounded-lg p-6 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-700">{formData.notes}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Line Items</h4>
                  <div className="space-y-2 text-sm">
                    {formData.lineItems.map((item, index) => (
                      <div key={item.Id} className="flex justify-between">
                        <span className="text-gray-700">{item.description} ({item.quantity}x)</span>
                        <span className="font-medium">${item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">${totals.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>${totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Previous
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleSubmit(true)}>
                  Save as Draft
                </Button>
                <Button onClick={() => handleSubmit(false)}>
                  Create & Send Invoice
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CreateInvoice;