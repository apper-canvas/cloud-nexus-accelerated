import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import MetricCard from '@/components/molecules/MetricCard';
import invoiceService from '@/services/api/invoiceService';

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [invoicesData, summaryData] = await Promise.all([
        invoiceService.getAll(),
        invoiceService.getStatusSummary()
      ]);
      setInvoices(invoicesData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (id, invoiceNumber) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      return;
    }

    try {
      await invoiceService.delete(id);
      toast.success('Invoice deleted successfully');
      await loadData();
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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.companyName.toLowerCase().includes(filter.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Invoices" }
  ];

  if (loading) return <Loading message="Loading invoices..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your customer invoices and payments</p>
        </div>
        <Button onClick={() => navigate('/invoices/create')} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Create Invoice
        </Button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Outstanding"
            value={`$${summary.totalOutstanding.toLocaleString()}`}
            icon="DollarSign"
            trend={{ value: `${summary.sent + summary.overdue} invoices`, isPositive: false }}
            className="text-red-600"
          />
          <MetricCard
            title="Total Paid"
            value={`$${summary.totalPaid.toLocaleString()}`}
            icon="CheckCircle"
            trend={{ value: `${summary.paid} invoices`, isPositive: true }}
            className="text-green-600"
          />
          <MetricCard
            title="Draft Invoices"
            value={summary.draft}
            icon="FileText"
            trend={{ value: "Pending review", isPositive: null }}
            className="text-gray-600"
          />
          <MetricCard
            title="Overdue Invoices"
            value={summary.overdue}
            icon="AlertTriangle"
            trend={{ value: "Requires attention", isPositive: false }}
            className="text-red-600"
          />
        </div>
      )}

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search invoices..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Draft', 'Sent', 'Paid', 'Overdue'].map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Invoice</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Company</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Issue Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Due Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr
                  key={invoice.Id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/invoices/${invoice.Id}`)}
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-600">{invoice.paymentTerms}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{invoice.companyName}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{invoice.issueDate}</td>
                  <td className="py-4 px-4 text-gray-600">{invoice.dueDate}</td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">${invoice.total.toLocaleString()}</div>
                    {invoice.outstandingAmount > 0 && (
                      <div className="text-sm text-red-600">
                        Outstanding: ${invoice.outstandingAmount.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/invoices/${invoice.Id}/edit`);
                        }}
                      >
                        <ApperIcon name="Edit" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInvoice(invoice.Id, invoice.invoiceNumber);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-600 mb-4">
                {filter || statusFilter !== 'All'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first invoice.'
                }
              </p>
              {!filter && statusFilter === 'All' && (
                <Button onClick={() => navigate('/invoices/create')}>
                  Create Your First Invoice
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Invoices;