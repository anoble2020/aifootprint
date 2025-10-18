import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.tsx";
import { PlatformCombobox } from "./ui/combobox";
import { Calculator as CalcIcon, Upload } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const Calculator = ({ onCalculate }) => {
  const [platform, setPlatform] = useState("cursor");
  const [tokens, setTokens] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  const { toast } = useToast();

  // Update activeTab when component mounts to ensure instructions are correct
  useEffect(() => {
    setActiveTab("manual");
  }, []);

  const getInstructions = (platform, method) => {
    const instructions = {
      cursor: {
        manual: {
          title: "Manual Token Entry for Cursor",
          steps: [
            "Login to Cursor and navigate to 'Dashboard'",
            "Click on 'Usage' to view your token usage",
            "Look for 'Total Tokens' or 'Tokens Used' in the usage summary",
            "Enter the total token count in the input field below"
          ]
        },
        upload: {
          title: "Upload CSV from Cursor",
          steps: [
            "Login to Cursor and navigate to 'Dashboard'",
            "Click on 'Usage'",
            "Select a date range above the 'All Events' table",
            "Click on the 'Export CSV' button",
            "Download the CSV file and upload it below"
          ]
        }
      },
      openai: {
        manual: {
          title: "Manual Token Entry for OpenAI",
          steps: [
            "Login to OpenAI Platform",
            "Navigate to 'Usage' section",
            "View your token usage summary",
            "Enter the total token count in the input field below"
          ]
        },
        url: {
          title: "Export CSV URL from OpenAI",
          steps: [
            "Login to OpenAI Platform",
            "Navigate to 'Usage' section",
            "Click 'Export' to generate a CSV URL",
            "Copy the URL and paste it below"
          ]
        },
        upload: {
          title: "Upload CSV from OpenAI",
          steps: [
            "Login to OpenAI Platform",
            "Navigate to 'Usage' section",
            "Click 'Export' to download CSV file",
            "Upload the downloaded CSV file below"
          ]
        }
      },
      claude: {
        manual: {
          title: "Manual Token Entry for Claude",
          steps: [
            "Login to Claude (Anthropic Console)",
            "Navigate to 'Usage' or 'Billing' section",
            "View your token usage summary",
            "Enter the total token count in the input field below"
          ]
        },
        url: {
          title: "Export CSV URL from Claude",
          steps: [
            "Login to Claude (Anthropic Console)",
            "Navigate to 'Usage' or 'Billing' section",
            "Export your usage data as CSV",
            "Copy the generated URL and paste it below"
          ]
        },
        upload: {
          title: "Upload CSV from Claude",
          steps: [
            "Login to Claude (Anthropic Console)",
            "Navigate to 'Usage' or 'Billing' section",
            "Export your usage data as CSV",
            "Download and upload the CSV file below"
          ]
        }
      },
      gemini: {
        manual: {
          title: "Manual Token Entry for Gemini",
          steps: [
            "Login to Google AI Studio",
            "Navigate to 'Usage' or 'Billing' dashboard",
            "View your token usage summary",
            "Enter the total token count in the input field below"
          ]
        },
        url: {
          title: "Export CSV URL from Gemini",
          steps: [
            "Login to Google AI Studio",
            "Navigate to 'Usage' or 'Billing' dashboard",
            "Export your usage data as CSV",
            "Copy the generated URL and paste it below"
          ]
        },
        upload: {
          title: "Upload CSV from Gemini",
          steps: [
            "Login to Google AI Studio",
            "Navigate to 'Usage' or 'Billing' dashboard",
            "Export your usage data as CSV",
            "Download and upload the CSV file below"
          ]
        }
      }
    };
    
    return instructions[platform]?.[method] || instructions.cursor.manual;
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error("CSV file is empty or invalid");
    }

    // Better CSV parsing that handles quoted values with commas
    const parseCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    console.log("CSV Headers:", headers);
    console.log("Number of columns:", headers.length);
    
    // Look for "total tokens" column (case insensitive) - this should be column I
    let totalTokensIndex = headers.findIndex(h => 
      h.toLowerCase().includes("total tokens") || 
      h.toLowerCase().includes("total_tokens")
    );
    
    console.log("Found tokens column at index:", totalTokensIndex);
    
    // If not found, try column I (index 8) as fallback
    if (totalTokensIndex === -1 && headers.length > 8) {
      totalTokensIndex = 8;
      console.log("Using fallback column I (index 8)");
    }
    
    if (totalTokensIndex === -1) {
      throw new Error("Could not find 'Total Tokens' column in CSV. Expected column I (index 8).");
    }

    let totalTokens = 0;
    let processedRows = 0;
    let skippedRows = 0;
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const tokenValue = parseFloat(values[totalTokensIndex]?.replace(/"/g, '') || '0');
      if (!isNaN(tokenValue)) {
        totalTokens += tokenValue;
        processedRows++;
      } else {
        skippedRows++;
        console.log(`Skipped row ${i}: invalid token value "${values[totalTokensIndex]}"`);
      }
    }
    
    console.log(`Processed ${processedRows} rows, skipped ${skippedRows} rows, total tokens: ${totalTokens.toLocaleString()}`);
    console.log("Sample values from column:", lines.slice(1, 4).map(line => {
      const values = parseCSVLine(line);
      return values[totalTokensIndex]?.replace(/"/g, '');
    }));

    return totalTokens;
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const tokenNum = parseFloat(tokens);
    if (!isNaN(tokenNum) && tokenNum > 0) {
      onCalculate(tokenNum);
      toast({
        title: "Calculation Successful",
        description: `Calculated ${tokenNum.toLocaleString()} tokens.`,
      });
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of tokens.",
        variant: "destructive",
      });
    }
  };


  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result;
        const totalTokens = parseCSV(csvText);
        
        toast({
          title: "CSV processed successfully",
          description: `Found ${totalTokens.toLocaleString()} total tokens`,
        });
        
        onCalculate(totalTokens);
      } catch (error) {
        toast({
          title: "Error processing CSV",
          description: error instanceof Error ? error.message : "Could not process CSV file",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <section className="flex-1 flex justify-center items-center p-4 relative">
      <div className="w-full max-w-2xl overflow-y-auto max-h-full p-4 relative z-10">
        <Card className="border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CalcIcon className="h-6 w-6 text-fern" />
            </div>
            <CardTitle className="text-2xl font-bold text-white drop-shadow-lg">Calculate Your Impact</CardTitle>
            <CardDescription className="text-sm mt-1 text-white/90 drop-shadow-md">
              Choose your AI platform and import your usage data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative z-10">
              <label className="text-sm font-medium mb-2 block text-white drop-shadow-md">AI Platform</label>
              <div className="relative">
                <PlatformCombobox 
                  value={platform} 
                  onValueChange={setPlatform}
                  className="h-10 justify-start flex max-w-[100px] glassmorphism-input"
                />
              </div>
            </div>

            <div className="mb-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg relative z-0 border border-white/30">
              <h3 className="font-semibold mb-2 text-xs text-white drop-shadow-md">{getInstructions(platform, activeTab).title}</h3>
              <ol className="space-y-1 text-xs text-white/90 drop-shadow-sm">
                {getInstructions(platform, activeTab).steps.map((step, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="font-medium">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Tabs defaultValue="manual" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="upload">Upload CSV</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-4">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="tokens" className="text-sm font-medium text-white drop-shadow-md">
                      Token Count
                    </label>
                    <Input
                      id="tokens"
                      type="number"
                      placeholder="e.g., 1000000"
                      value={tokens}
                      onChange={(e) => setTokens(e.target.value)}
                      className="h-10 glassmorphism-input"
                      min="1"
                      step="1"
                    />
                    <p className="text-xs text-white/80 drop-shadow-sm">
                      Enter the total number of tokens manually
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-10 text-sm font-semibold transition-all hover:scale-[1.02] button"
                    size="sm"
                  >
                    Calculate Environmental Impact
                  </Button>
                </form>
              </TabsContent>


              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="csvFile" className="text-sm font-medium flex items-center gap-2 text-white drop-shadow-md">
                      <Upload className="h-4 w-4" />
                      Upload CSV File
                    </label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="h-10 cursor-pointer glassmorphism-input"
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-white/80 drop-shadow-sm">
                      Upload your exported CSV file to calculate tokens
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Calculator;