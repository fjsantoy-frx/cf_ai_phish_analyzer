export default {
  async fetch(request, env) {
    // Add CORS headers so your website can talk to this Worker
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response("OK", { headers: corsHeaders });

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const { content } = await request.json();
      
      // Call Llama 3.3
      const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-awq', {
        messages: [
          { role: 'system', content: 'You are a Collegiate Athletics Cybersecurity Expert. Analyze the text for NIL fraud or eligibility scams.' },
          { role: 'user', content: content }
        ]
      });

      // Save to KV Memory
      const id = crypto.randomUUID();
      await env.THREAT_HISTORY.put(`threat_${id}`, JSON.stringify({
        content: content.substring(0, 200),
        result: aiResponse.response,
        timestamp: new Date().toISOString()
      }));

      return new Response(JSON.stringify(aiResponse), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  }
};
