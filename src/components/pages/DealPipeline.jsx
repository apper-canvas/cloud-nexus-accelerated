import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { dealService } from "@/services/api/dealService";
import { companyService } from "@/services/api/companyService";
import DealCard from "@/components/organisms/DealCard";
import DealDetailModal from "@/components/organisms/DealDetailModal";
const DealPipeline = () => {
const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stages = [
    { id: 'Prospecting', name: 'Prospecting', color: 'bg-gray-500', probability: 20 },
    { id: 'Qualification', name: 'Qualification', color: 'bg-blue-500', probability: 40 },
    { id: 'Proposal', name: 'Proposal', color: 'bg-yellow-500', probability: 60 },
    { id: 'Negotiation', name: 'Negotiation', color: 'bg-orange-500', probability: 80 },
    { id: 'Closed', name: 'Closed', color: 'bg-green-500', probability: 100 }
  ];

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
    return deals.filter(deal => deal.stage === stageId);
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
            <div className="text-sm text-gray-600">
              Total Pipeline: {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
            </div>
            <div className="text-sm text-gray-600">
              Weighted Forecast: {formatCurrency(deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0))}
            </div>
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