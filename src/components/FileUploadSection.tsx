import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import DataVisualization from "./DataVisualization";

const FileUploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (file.name.endsWith('.xlsx')) {
            // Parse Excel file
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setParsedData(jsonData);
          } else if (file.name.endsWith('.csv')) {
            // Parse CSV file
            const text = e.target?.result as string;
            Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                setParsedData(results.data);
              }
            });
          }
          
          toast.success("File uploaded successfully!", {
            description: `${file.name} is ready for analysis`
          });
        } catch (error) {
          toast.error("Error parsing file", {
            description: "Please check your file format"
          });
        }
      };
      
      if (file.name.endsWith('.xlsx')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    } else {
      toast.error("Invalid file type", {
        description: "Please upload .xlsx or .csv files only"
      });
    }
  };

  return (
    <section id="upload-section" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground">
              Upload <span className="text-primary">Your Data</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Drag & drop your file or click to select from your computer
            </p>
          </div>

          <Card 
            className={`relative border-2 border-dashed transition-all duration-300 ${
              dragActive 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : 'border-border/50 bg-card/50 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="p-12">
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-glow-pulse" />
                  <Upload className="h-16 w-16 text-primary relative z-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Drop your file here
                  </h3>
                  <p className="text-muted-foreground">
                    or click the button below to select a file
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                    <span>.xlsx</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-accent" />
                    <span>.csv</span>
                  </div>
                </div>

                <label htmlFor="file-upload">
                  <Button 
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/30 cursor-pointer"
                    asChild
                  >
                    <span>
                      Select File
                    </span>
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".xlsx,.csv"
                    onChange={handleChange}
                  />
                </label>

                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card className="p-4 bg-secondary/30 border-border/50">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">Excel Support</h4>
                  <p className="text-xs text-muted-foreground">Full support for .xlsx files</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-secondary/30 border-border/50">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">CSV Support</h4>
                  <p className="text-xs text-muted-foreground">Standard CSV format</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-secondary/30 border-border/50">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">Quick Upload</h4>
                  <p className="text-xs text-muted-foreground">Fast upload process</p>
                </div>
              </div>
            </Card>
          </div>

          {parsedData.length > 0 && (
            <div className="mt-12">
              <DataVisualization data={parsedData} fileName={fileName} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FileUploadSection;
