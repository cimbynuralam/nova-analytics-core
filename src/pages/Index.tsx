import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AnalysisSection from "@/components/AnalysisSection";
import FileUploadSection from "@/components/FileUploadSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        <HeroSection />
        <AnalysisSection />
        <FileUploadSection />
      </main>

      <footer className="border-t border-border/50 py-8 mt-20">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2025 DataVision AI. Powered by Advanced AI Technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
