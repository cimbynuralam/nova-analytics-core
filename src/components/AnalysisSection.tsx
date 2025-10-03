import { TrendingUp, PieChart, BarChart3, LineChart, Target, Zap } from "lucide-react";
import AnalysisTypeCard from "./AnalysisTypeCard";

const analysisTypes = [
  {
    title: "Analisis Tren",
    description: "Identifikasi pola dan tren dalam data Anda untuk prediksi yang lebih akurat",
    icon: TrendingUp,
    color: "primary",
  },
  {
    title: "Analisis Distribusi",
    description: "Pahami bagaimana data Anda terdistribusi dengan visualisasi yang komprehensif",
    icon: PieChart,
    color: "accent",
  },
  {
    title: "Analisis Komparatif",
    description: "Bandingkan metrik dan KPI untuk insight yang lebih mendalam",
    icon: BarChart3,
    color: "primary",
  },
  {
    title: "Analisis Prediktif",
    description: "Gunakan machine learning untuk memprediksi tren masa depan",
    icon: LineChart,
    color: "accent",
  },
  {
    title: "Analisis Segmentasi",
    description: "Kelompokkan data Anda berdasarkan karakteristik yang relevan",
    icon: Target,
    color: "primary",
  },
  {
    title: "Analisis Real-time",
    description: "Monitor dan analisis data secara langsung untuk keputusan cepat",
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
            Pilih Jenis <span className="text-primary">Analisis</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pilih metode analisis yang sesuai dengan kebutuhan bisnis Anda
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
