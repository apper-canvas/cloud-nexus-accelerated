import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DealDetailModal from "@/components/organisms/DealDetailModal";

const DealDetail = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
    window.history.back();
  };

  return (
    <DealDetailModal
      dealId={id}
      isOpen={isModalOpen}
      onClose={handleClose}
    />
  );
};

export default DealDetail;