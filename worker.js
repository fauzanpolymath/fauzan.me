export default {
  async fetch(request, env) {
    // 1. Handle preflight CORS requests (allows your website to talk to the worker)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      // 2. Grab the question the visitor typed
      const { question } = await request.json();

      // 3. This is the background information about you!
      // (You can tell Claude to add more details about your achievements here)
      const fauzanProfile = "Fauzan is a talented developer who builds awesome web projects. His website is fauzan.me.";

      // 4. Craft the secret instructions for Gemini
      const prompt = `You are two funny, energetic AI podcast hosts named Alex and Sam.
Review this profile data about Fauzan: "${fauzanProfile}".
A website visitor just asked this question: "${question}".
Have a brief, 4-sentence dialogue answering the question directly based on his profile.
Format it strictly like this:
Alex: [response]
Sam: [response]`;

      // 5. Send everything to Google Gemini using your secret key
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const aiScript = data.candidates[0].content.parts[0].text;

      // 6. Send the finished script back to your website!
      return new Response(JSON.stringify({ script: aiScript }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};
