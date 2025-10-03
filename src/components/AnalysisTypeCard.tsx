import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnalysisTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const AnalysisTypeCard = ({ title, description, icon: Icon, color }: AnalysisTypeCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 cursor-pointer hover:scale-105">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300" />
      
      <div className="relative p-6 space-y-4">
        <div className={`inline-flex p-3 rounded-xl bg-${color}/10 border border-${color}/20`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="pt-2">
          <span className="text-sm text-primary group-hover:underline">
            Pelajari lebih lanjut →
          </span>
        </div>
      </div>
    </Card>
  );
};

export default AnalysisTypeCard;
