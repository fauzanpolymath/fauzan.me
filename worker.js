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
      const fauzanProfile = `Fauzan Battiwala is a Dubai-based operations and AI professional with roughly eight years of experience spanning banking escalations, contact-centre transformation, mobility platforms, and fintech marketplaces. He started in high-stakes customer operations at Citibank US (via TCS, Mumbai, 2016-2017), then led a Six Sigma DMAIC project for Hello Mineral Water (Oct 2016-Mar 2017) that raised NPS from 28% to 93% and SLA compliance from 34% to 88%.

At Hinduja Global Solutions Interactive (Dec 2018-Dec 2020), he managed enterprise CRM operations for Disney+, Toyota India, Aster DM Healthcare, and Walmart/Sam's Club, leading a zero-downtime Salesforce-to-Freshdesk migration for Disney+ and improving first-contact resolution from 46% to 62%.

At Towr Portal (Feb 2021-Apr 2022) in Dubai, he built Zoho CRM automation that grew B2B acquisition by 120% and scaled monthly orders from ~50 to 1,500. At LiftMyCar (Apr 2022-Jan 2024), he deployed a 360.io conversational AI chatbot across WhatsApp, web, and social channels, integrated Zoho CRM with Stripe, and redesigned the booking journey from 8 steps to 4-5.

At Kobet Technologies DMCC (Oct 2024-Mar 2026), a fintech marketplace with 14 gift card trading apps and 700,000 active users per app, Fauzan became the AI deployment lead: he selected and deployed Crisp AI, running 20 AI agents in production with compliance approval and canary rollouts, achieving an 83% cost reduction, 30% reduction in human agent workload, and 3-7% uplift in CSAT/NPS. He also designed a Google Cloud Vision OCR pipeline that reduced failed transactions by 15-20%, and worked on a multi-layer fraud detection stack using Claude/GPT-4o Vision Agents, CLIP embeddings in Pinecone for sub-50ms semantic duplicate detection across 14 apps, and LangGraph orchestration with Kafka.

Independently, he built a maritime document automation pipeline (83% faster processing), HarbourMind (a FastAPI + Gemini 2.5 Flash service with a 32x async speedup), and an end-to-end encrypted React Native messaging app. He holds an MBA from Welingkar Institute, a BBA in Computer Applications, and is a Six Sigma Green Belt. His core philosophy: find the truth in the data, redesign the system around it, automate what should be automated, govern what you automate, and prove the result with numbers. His website is fauzan.me.`;

      // 4. Craft the secret instructions for Gemini
      const prompt = `You are two funny, energetic AI podcast hosts named Alex and Sam.
Review this profile data about Fauzan: "${fauzanProfile}".
A website visitor just asked this question: "${question}".
Have a brief, 4-sentence dialogue answering the question directly based on his profile.
Format it strictly like this:
Alex: [response]
Sam: [response]`;

      // 5. Send everything to Google Gemini using your secret key
      if (!env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY secret is not set on this Worker.");
      }
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY.trim()}`;

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Gemini HTTP ${response.status}: ${rawText.slice(0, 300) || '(empty body)'}`);
      }
      if (!data.candidates || !data.candidates[0]) {
        throw new Error(data.error?.message || "Gemini returned no response: " + JSON.stringify(data));
      }
      const aiScript = data.candidates[0].content.parts[0].text;

      // 6. Turn the script into real podcast audio using Gemini's TTS model
      const ttsUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${env.GEMINI_API_KEY.trim()}`;

      const ttsResponse = await fetch(ttsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `TTS the following conversation between Alex and Sam:\n${aiScript}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  { speaker: "Alex", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } },
                  { speaker: "Sam", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
                ],
              },
            },
          },
        })
      });

      const ttsRawText = await ttsResponse.text();
      let ttsData;
      try {
        ttsData = JSON.parse(ttsRawText);
      } catch {
        throw new Error(`Gemini TTS HTTP ${ttsResponse.status}: ${ttsRawText.slice(0, 300) || '(empty body)'}`);
      }
      const audioPart = ttsData.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (!audioPart) {
        throw new Error(ttsData.error?.message || "Gemini TTS returned no audio: " + JSON.stringify(ttsData));
      }

      const mimeType = audioPart.inlineData.mimeType || "audio/L16;rate=24000";
      const rateMatch = mimeType.match(/rate=(\d+)/);
      const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
      const wavBase64 = pcmToWavBase64(audioPart.inlineData.data, sampleRate);

      // 7. Send the finished script and audio back to your website!
      return new Response(JSON.stringify({ script: aiScript, audio: wavBase64 }), {
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

// Wraps raw 16-bit PCM audio (as returned by Gemini TTS) in a WAV header so browsers can play it.
function pcmToWavBase64(pcmBase64, sampleRate) {
  const binary = atob(pcmBase64);
  const pcmLength = binary.length;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;

  const buffer = new ArrayBuffer(44 + pcmLength);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcmLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, pcmLength, true);

  const bytes = new Uint8Array(buffer, 44);
  for (let i = 0; i < pcmLength; i++) bytes[i] = binary.charCodeAt(i);

  let resultBinary = "";
  const allBytes = new Uint8Array(buffer);
  for (let i = 0; i < allBytes.length; i++) resultBinary += String.fromCharCode(allBytes[i]);
  return btoa(resultBinary);
}
