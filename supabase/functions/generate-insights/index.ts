import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data, fileName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare data summary for analysis
    const dataSummary = {
      fileName,
      rowCount: data.length,
      columns: Object.keys(data[0]),
      sampleData: data.slice(0, 5)
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a data analyst expert. Analyze the provided data and generate actionable insights and recommendations. Keep your response clear, structured, and in Indonesian language."
          },
          {
            role: "user",
            content: `Analyze this dataset and provide:
1. Key Insights (3-5 important findings from the data)
2. Action Plan Recommendations (3-5 specific actions to take based on the insights)

Dataset summary:
- File: ${dataSummary.fileName}
- Total rows: ${dataSummary.rowCount}
- Columns: ${dataSummary.columns.join(', ')}
- Sample data: ${JSON.stringify(dataSummary.sampleData)}

Format your response as JSON with this structure:
{
  "insights": ["insight 1", "insight 2", ...],
  "actionPlan": ["action 1", "action 2", ...]
}`
          }
        ]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsedContent = jsonMatch ? JSON.parse(jsonMatch[0]) : { insights: [], actionPlan: [] };

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-insights:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
