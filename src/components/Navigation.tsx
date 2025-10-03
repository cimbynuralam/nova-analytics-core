import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Upload } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <BarChart3 className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 blur-xl bg-primary/30 group-hover:bg-primary/50 transition-all" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DataVision
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hover:bg-secondary hover:text-primary transition-all">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/25">
              Mulai Analisis
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
