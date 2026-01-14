export default {
  async fetch(request, env) {
    // 1. DASHBOARD: Show your website if someone just visits the link
    if (request.method === "GET") {
      // This uses the 'assets' binding from your wrangler.toml
      return env.ASSETS.fetch(request);
    }

    // 2. SECURITY CHECK: Only allow POST requests for the AI analyzer
    if (request.method !== "POST") {
      return new Response("Send a POST request with content.", { status: 405 });
    }

    try {
      const { content } = await request.json();
      const timestamp = new Date().toISOString();

      // 3. AI ANALYSIS: Running the 'fast' version of Llama 3.3
      const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: 'You are a Cybersecurity Analyst for an Athletic Department. Analyze the text for NIL fraud or eligibility scams.' },
          { role: 'user', content: content }
        ]
      });

      // 4. LOG TO KV: Save the analysis for your senior project portfolio
      await env.THREAT_HISTORY.put(`threat_${timestamp}`, JSON.stringify({
        content: content.substring(0, 100),
        analysis: aiResponse.response,
        date: timestamp
      }));

      // 5. RETURN RESULT: Send the AI's feedback back to your website
      return new Response(JSON.stringify({ analysis: aiResponse.response }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to analyze film: " + err.message }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      });
    }
  }
};
