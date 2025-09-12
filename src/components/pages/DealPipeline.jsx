import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import { dealService } from "@/services/api/dealService";
import { companyService } from "@/services/api/companyService";
import ApperIcon from "@/components/ApperIcon";
import DealDetailModal from "@/components/organisms/DealDetailModal";
import DealCard from "@/components/organisms/DealCard";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Label from "@/components/atoms/Label";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
const DealPipeline = () => {
const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    rep: '',
    dateFrom: '',
    dateTo: '',
    minValue: '',
    maxValue: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredDeals, setFilteredDeals] = useState([]);

  const stages = [
    { id: 'Prospecting', name: 'Prospecting', color: 'bg-gray-500', probability: 20 },
    { id: 'Qualification', name: 'Qualification', color: 'bg-blue-500', probability: 40 },
    { id: 'Proposal', name: 'Proposal', color: 'bg-yellow-500', probability: 60 },
    { id: 'Negotiation', name: 'Negotiation', color: 'bg-orange-500', probability: 80 },
    { id: 'Closed', name: 'Closed', color: 'bg-green-500', probability: 100 }
  ];

  const salesReps = [...new Set(deals.map(deal => deal.assignedRep))].filter(Boolean);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
try {
      setLoading(true);
      const [dealsData, companiesData] = await Promise.all([
        dealService.getAll(),
        companyService.getAll()
      ]);
      setDeals(dealsData);
      setCompanies(companiesData);
      setFilteredDeals(dealsData); // Initialize filtered deals
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const dealId = parseInt(active.id);
    const newStage = over.id;
    const stageInfo = stages.find(s => s.id === newStage);

    try {
      await dealService.updateStage(dealId, newStage, stageInfo.probability);
      
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.Id === dealId 
            ? { ...deal, stage: newStage, probability: stageInfo.probability }
            : deal
        )
      );

      toast.success(`Deal moved to ${stageInfo.name}`);
    } catch (err) {
      toast.error('Failed to update deal stage');
    }

    setActiveId(null);
  };

const getDealsByStage = (stageId) => {
    return filteredDeals.filter(deal => deal.stage === stageId);
  };

  const applyFilters = (dealsToFilter = deals) => {
    let filtered = [...dealsToFilter];

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
      filtered = filtered.filter(deal => deal.value >= parseInt(filters.minValue));
    }

    if (filters.maxValue) {
      filtered = filtered.filter(deal => deal.value <= parseInt(filters.maxValue));
    }

    setFilteredDeals(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    
    // Apply filters with debounce effect would be ideal, but for now apply immediately
    setTimeout(() => {
      applyFilters();
    }, 100);
  };

  const clearFilters = () => {
    setFilters({
      rep: '',
      dateFrom: '',
      dateTo: '',
      minValue: '',
      maxValue: ''
    });
    setFilteredDeals([...deals]);
  };

  const exportForecastData = () => {
    const csvData = filteredDeals.map(deal => {
      const company = companies.find(c => c.Id === deal.companyId);
      return {
        'Deal Title': deal.title,
        'Company': company ? company.name : 'Unknown',
        'Stage': deal.stage,
        'Value': deal.value,
        'Probability': deal.probability + '%',
        'Weighted Value': Math.round(deal.value * deal.probability / 100),
        'Expected Close Date': deal.expectedCloseDate,
        'Assigned Rep': deal.assignedRep
      };
    });

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `forecast-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${filteredDeals.length} deals to CSV`);
  };

  const handleDealClick = (dealId) => {
    setSelectedDealId(dealId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDealId(null);
    // Refresh deals data after modal closes to show any updates
    loadData();
  };

  const getStageMetrics = (stageId) => {
    const stageDeals = getDealsByStage(stageId);
    const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedValue = stageDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
    return { count: stageDeals.length, totalValue, weightedValue };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getConversionRate = (stageIndex) => {
    if (stageIndex === 0) return null;
    const currentStageDeals = getDealsByStage(stages[stageIndex].id).length;
    const previousStageDeals = getDealsByStage(stages[stageIndex - 1].id).length;
    if (previousStageDeals === 0) return 0;
    return Math.round((currentStageDeals / (currentStageDeals + previousStageDeals)) * 100);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const activeDeal = deals.find(deal => deal.Id === parseInt(activeId));

  return (
    <div>
      <Breadcrumbs items={[
        { label: "Dashboard", href: "/" },
        { label: "Deal Pipeline" }
      ]} />
      
<div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Deal Pipeline</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportForecastData}
              disabled={filteredDeals.length === 0}
            >
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link to="/deals/new">
              <Button variant="primary" size="sm">
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                New Deal
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-700">Sales Rep</Label>
                <select
                  value={filters.rep}
                  onChange={(e) => handleFilterChange('rep', e.target.value)}
                  className="mt-1 block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All Reps</option>
                  {salesReps.map(rep => (
                    <option key={rep} value={rep}>{rep}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-700">From Date</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-700">To Date</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-700">Min Value</Label>
                <Input
                  type="number"
                  value={filters.minValue}
                  onChange={(e) => handleFilterChange('minValue', e.target.value)}
                  placeholder="$0"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-700">Max Value</Label>
                <Input
                  type="number"
                  value={filters.maxValue}
                  onChange={(e) => handleFilterChange('maxValue', e.target.value)}
                  placeholder="No limit"
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {filteredDeals.length} of {deals.length} deals
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div>
            Total Pipeline: {formatCurrency(filteredDeals.reduce((sum, deal) => sum + deal.value, 0))}
          </div>
          <div>
            Weighted Forecast: {formatCurrency(filteredDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0))}
</div>
        </div>
      </div>

      <DndContext 
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {stages.map((stage, stageIndex) => {
            const metrics = getStageMetrics(stage.id);
            const conversionRate = getConversionRate(stageIndex);
            const stageDeals = getDealsByStage(stage.id);

            return (
              <div key={stage.id} className="flex flex-col">
                <Card className="mb-4 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                      <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    </div>
                    <Badge variant="secondary">{metrics.count}</Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Total: {formatCurrency(metrics.totalValue)}</div>
                    <div>Weighted: {formatCurrency(metrics.weightedValue)}</div>
                    {conversionRate !== null && (
                      <div className="flex items-center gap-1">
                        <ApperIcon name="TrendingUp" className="h-3 w-3" />
                        {conversionRate}% conversion
                      </div>
                    )}
                  </div>
                </Card>

                <SortableContext items={stageDeals.map(d => d.Id.toString())} strategy={verticalListSortingStrategy}>
                  <div className="flex-1 space-y-3 min-h-[400px] p-2 bg-gray-50 rounded-lg">
                    {stageDeals.map(deal => {
                      const company = companies.find(c => c.Id === deal.companyId);
return (
                        <DealCard 
                          key={deal.Id}
                          deal={deal}
                          company={company}
                          isDragging={activeId === deal.Id.toString()}
                          onClick={() => handleDealClick(deal.Id)}
                        />
                      );
                    })}
                    
                    {stageDeals.length === 0 && (
                      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        No deals in this stage
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeId && activeDeal ? (
            <DealCard 
              deal={activeDeal}
              company={companies.find(c => c.Id === activeDeal.companyId)}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
</DndContext>
      
      <DealDetailModal
        dealId={selectedDealId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DealPipeline;