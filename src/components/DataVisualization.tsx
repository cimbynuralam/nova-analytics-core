import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Download } from "lucide-react";
import { toast } from "sonner";

interface DataVisualizationProps {
  data: any[];
  fileName: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', '#10b981', '#f59e0b', '#ef4444'];

const DataVisualization = ({ data, fileName }: DataVisualizationProps) => {
  if (!data || data.length === 0) return null;

  // Get numeric columns for visualization
  const numericColumns = Object.keys(data[0]).filter(key => 
    !isNaN(parseFloat(data[0][key])) && isFinite(data[0][key])
  );

  // Get first text column for labels
  const labelColumn = Object.keys(data[0]).find(key => 
    isNaN(parseFloat(data[0][key])) || !isFinite(data[0][key])
  ) || Object.keys(data[0])[0];

  // Check if label column is time-based (for trend chart)
  const isTimeBased = () => {
    const label = labelColumn.toLowerCase();
    return label.includes('year') || label.includes('date') || label.includes('month') || 
           label.includes('tahun') || label.includes('tanggal') || label.includes('bulan') ||
           label.includes('time') || label.includes('waktu') || label.includes('periode');
  };

  // Format number for display (no decimals for years)
  const formatNumber = (value: number, columnName: string) => {
    const colLower = columnName.toLowerCase();
    if (colLower.includes('year') || colLower.includes('tahun')) {
      return Math.round(value);
    }
    return value;
  };

  // Prepare data for charts (limit to first 10 rows for readability)
  const chartData = data.slice(0, 10).map(row => {
    const item: any = { name: row[labelColumn] || 'N/A' };
    numericColumns.forEach(col => {
      item[col] = formatNumber(parseFloat(row[col]) || 0, col);
    });
    return item;
  });

  // Download visualization as CSV
  const downloadVisualization = () => {
    try {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(val => {
          const str = String(val);
          return str.includes(',') ? `"${str}"` : str;
        }).join(',')
      );
      const csv = [headers, ...rows].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace(/\.[^/.]+$/, '')}_analysis.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Visualization downloaded successfully");
    } catch (error) {
      toast.error("Failed to download visualization");
    }
  };

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
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 gradient-text">Data Analysis Results</h2>
          <p className="text-muted-foreground">File: {fileName}</p>
          <p className="text-sm text-muted-foreground mt-1">{data.length} rows analyzed</p>
        </div>
        <Button 
          onClick={downloadVisualization}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Results
        </Button>
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

        {/* Line Chart - Only show for time-based data */}
        {isTimeBased() && (
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Trend Analysis
              </CardTitle>
              <CardDescription>Time series trend view</CardDescription>
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
        )}

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
                      {Object.keys(row).slice(0, 4).map(key => {
                        const value = row[key];
                        const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);
                        const displayValue = isNumeric 
                          ? parseFloat(value).toFixed(2)
                          : value;
                        return (
                          <td key={key} className="p-2">{displayValue}</td>
                        );
                      })}
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
