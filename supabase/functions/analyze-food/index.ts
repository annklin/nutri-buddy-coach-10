import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { text, imageBase64, mode } = await req.json();

    const systemPrompt = `Você é um nutricionista especializado em análise de alimentos. Sua tarefa é identificar alimentos e estimar seus valores nutricionais por 100g de porção.

REGRAS:
- Sempre responda em JSON válido
- Se o usuário não informar quantidade, defina "needsQuantity": true e sugira uma quantidade padrão
- Se não conseguir identificar o alimento, retorne "error": "Não foi possível reconhecer o alimento."
- NUNCA invente valores nutricionais. Use valores reais de tabelas nutricionais conhecidas (TACO, USDA)
- Informe quando os valores são estimativas com "isEstimate": true
- Se o texto for ambíguo ou não fizer sentido como alimento, retorne "needsClarification": true com uma pergunta

Formato de resposta JSON:
{
  "foods": [
    {
      "name": "nome do alimento",
      "quantity": "quantidade identificada ou sugerida (ex: 100g, 1 unidade)",
      "grams": 100,
      "nutrients": {
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "sugar": 0,
        "fat": 0,
        "sodium": 0,
        "fiber": 0
      },
      "isEstimate": true
    }
  ],
  "needsQuantity": false,
  "needsClarification": false,
  "clarificationQuestion": "",
  "error": null
}`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (mode === 'photo' && imageBase64) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: "Identifique o(s) alimento(s) nesta imagem e estime os valores nutricionais." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      });
    } else if (text) {
      messages.push({
        role: "user",
        content: `Analise este alimento e retorne os valores nutricionais: "${text}"`,
      });
    } else {
      return new Response(JSON.stringify({ error: "Nenhum dado enviado." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em breve." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao analisar alimento." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Erro ao processar resposta da IA." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-food error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
