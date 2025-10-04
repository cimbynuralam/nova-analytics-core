import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Lightbulb, ListChecks, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface DataVisualizationProps {
  data: any[];
  fileName: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', '#10b981', '#f59e0b', '#ef4444'];

const DataVisualization = ({ data, fileName }: DataVisualizationProps) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [actionPlan, setActionPlan] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateInsights();
  }, [data, fileName]);

  const generateInsights = async () => {
    if (!data || data.length === 0) return;

    setIsGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ data, fileName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }

      const result = await response.json();
      setInsights(result.insights || []);
      setActionPlan(result.actionPlan || []);
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!data || data.length === 0) return null;

  // Get numeric columns for visualization
  const numericColumns = Object.keys(data[0]).filter(key => 
    !isNaN(parseFloat(data[0][key])) && isFinite(data[0][key])
  );

  // Get first text column for labels
  const labelColumn = Object.keys(data[0]).find(key => 
    isNaN(parseFloat(data[0][key])) || !isFinite(data[0][key])
  ) || Object.keys(data[0])[0];

  // Prepare data for charts (limit to first 10 rows for readability)
  const chartData = data.slice(0, 10).map(row => {
    const item: any = { name: row[labelColumn] || 'N/A' };
    numericColumns.forEach(col => {
      item[col] = parseFloat(row[col]) || 0;
    });
    return item;
  });

  // Calculate summary statistics
  const stats = numericColumns.map(col => {
    const values = data.map(row => parseFloat(row[col]) || 0);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { column: col, sum, avg, max, min };
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 gradient-text">Data Analysis Results</h2>
        <p className="text-muted-foreground">File: {fileName}</p>
        <p className="text-sm text-muted-foreground mt-1">{data.length} rows analyzed</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.slice(0, 4).map((stat, idx) => (
          <Card key={idx} className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.column}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stat.avg.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Range: {stat.min.toFixed(1)} - {stat.max.toFixed(1)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights and Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Key Insights
            </CardTitle>
            <CardDescription>AI-generated analysis of your data</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Generating insights...</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {insights.map((insight, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary font-semibold">{idx + 1}.</span>
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-accent" />
              Action Plan Recommendations
            </CardTitle>
            <CardDescription>Suggested next steps based on insights</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Generating recommendations...</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {actionPlan.map((action, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-accent font-semibold">{idx + 1}.</span>
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Bar Chart Analysis
            </CardTitle>
            <CardDescription>Comparative view of numeric values</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                {numericColumns.slice(0, 3).map((col, idx) => (
                  <Bar key={col} dataKey={col} fill={COLORS[idx]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Trend Analysis
            </CardTitle>
            <CardDescription>Time series or sequential data view</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                {numericColumns.slice(0, 3).map((col, idx) => (
                  <Line key={col} type="monotone" dataKey={col} stroke={COLORS[idx]} strokeWidth={2} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        {numericColumns.length > 0 && (
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-secondary" />
                Distribution Analysis
              </CardTitle>
              <CardDescription>Proportion of first numeric column</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.slice(0, 6)}
                    dataKey={numericColumns[0]}
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {chartData.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Data Table Preview */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>First 5 rows of your dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {Object.keys(data[0]).slice(0, 4).map(key => (
                      <th key={key} className="text-left p-2 font-medium text-muted-foreground">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      {Object.keys(row).slice(0, 4).map(key => (
                        <td key={key} className="p-2">{row[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataVisualization;
