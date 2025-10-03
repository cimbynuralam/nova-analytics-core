import { TrendingUp, PieChart, BarChart3, LineChart, Target, Zap } from "lucide-react";
import AnalysisTypeCard from "./AnalysisTypeCard";

const analysisTypes = [
  {
    title: "Trend Analysis",
    description: "Identify patterns and trends in your data for more accurate predictions",
    icon: TrendingUp,
    color: "primary",
  },
  {
    title: "Distribution Analysis",
    description: "Understand how your data is distributed with comprehensive visualizations",
    icon: PieChart,
    color: "accent",
  },
  {
    title: "Comparative Analysis",
    description: "Compare metrics and KPIs for deeper insights",
    icon: BarChart3,
    color: "primary",
  },
  {
    title: "Predictive Analysis",
    description: "Use machine learning to predict future trends",
    icon: LineChart,
    color: "accent",
  },
  {
    title: "Segmentation Analysis",
    description: "Group your data based on relevant characteristics",
    icon: Target,
    color: "primary",
  },
  {
    title: "Real-time Analysis",
    description: "Monitor and analyze data in real-time for quick decisions",
    icon: Zap,
    color: "accent",
  },
];

const AnalysisSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground">
            Choose Analysis <span className="text-primary">Type</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the analysis method that fits your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysisTypes.map((type, index) => (
            <div
              key={type.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AnalysisTypeCard {...type} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
