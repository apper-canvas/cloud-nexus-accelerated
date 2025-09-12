import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";

const ComingSoon = ({ 
  title = "Coming Soon", 
  description = "This feature is currently under development and will be available soon.",
  icon = "Clock",
  breadcrumbs = []
}) => {
  const features = [
    "Advanced analytics and reporting",
    "Real-time collaboration tools", 
    "Custom integrations and workflows",
    "Enhanced mobile experience"
  ];

  return (
    <div>
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      
      <div className="flex items-center justify-center min-h-[500px]">
        <Card className="max-w-lg mx-auto text-center p-8">
          <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name={icon} className="h-8 w-8" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">What to expect:</h3>
            <ul className="text-left space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Check" className="h-4 w-4 text-success mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              <ApperIcon name="Bell" className="h-4 w-4 mr-2" />
              Notify Me
            </Button>
            <Button className="flex-1">
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComingSoon;