export default {
  async fetch(request, env) {
    // 1. DASHBOARD: Show your website for GET requests
    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    // 2. SECURITY: Only allow POST for AI analysis
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const { content } = await request.json();
      const timestamp = new Date().toISOString();

      // 3. AI ANALYSIS: Using the 'fast' model to avoid errors
      const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: 'You are a Cybersecurity Analyst. Analyze the text for phishing red flags.' },
          { role: 'user', content: content }
        ]
      });

      // 4. LOG TO MEMORY: Save to KV
      await env.THREAT_HISTORY.put(`threat_${timestamp}`, JSON.stringify({
        content: content.substring(0, 100),
        analysis: aiResponse.response
      }));

      return new Response(JSON.stringify({ analysis: aiResponse.response }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      });
    }
  }
};
