export default {
  async fetch(request, env) {
    // 1. SERVE FRONTEND: If a user visits the site, show the dashboard
    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    // 2. BACKEND LOGIC: Handle the AI analysis (POST requests)
    if (request.method !== "POST") {
      return new Response("Send a POST request with content.", { status: 405 });
    }

    const { content } = await request.json();
    const timestamp = new Date().toISOString();

    // 3. AI ANALYSIS: Using the 'fast' version of Llama 3.3
    const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: 'You are a Cybersecurity Analyst. Analyze the text for phishing red flags.' },
        { role: 'user', content: content }
      ]
    });

    // 4. SAVE TO MEMORY
    await env.THREAT_HISTORY.put(`threat_${timestamp}`, JSON.stringify({
      content: content.substring(0, 100),
      analysis: aiResponse.response
    }));

    return new Response(JSON.stringify({ analysis: aiResponse.response }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
