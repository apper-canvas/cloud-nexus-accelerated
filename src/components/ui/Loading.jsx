import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <ApperIcon name="Loader2" className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;