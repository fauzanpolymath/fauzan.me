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
      // 2. Grab the question the visitor typed (if any) and the requested mode
      const { question, mode } = await request.json();

      // 3. This is the background information about you!
      // (You can tell Claude to add more details about your achievements here)
      const fauzanProfile = `Fauzan Battiwala is a Dubai-based operations and AI professional with roughly eight years of experience spanning banking escalations, contact-centre transformation, mobility platforms, and fintech marketplaces. He started in high-stakes customer operations at Citibank US (via TCS, Mumbai, 2016-2017), then led a Six Sigma DMAIC project for Hello Mineral Water (Oct 2016-Mar 2017) that raised NPS from 28% to 93% and SLA compliance from 34% to 88%.

At Hinduja Global Solutions Interactive (Dec 2018-Dec 2020), he managed enterprise CRM operations for Disney+, Toyota India, Aster DM Healthcare, and Walmart/Sam's Club, leading a zero-downtime Salesforce-to-Freshdesk migration for Disney+ and improving first-contact resolution from 46% to 62%.

At Towr Portal (Feb 2021-Apr 2022) in Dubai, he built Zoho CRM automation that grew B2B acquisition by 120% and scaled monthly orders from ~50 to 1,500. At LiftMyCar (Apr 2022-Jan 2024), he deployed a 360.io conversational AI chatbot across WhatsApp, web, and social channels, integrated Zoho CRM with Stripe, and redesigned the booking journey from 8 steps to 4-5.

At Kobet Technologies DMCC (Oct 2024-Mar 2026), a fintech marketplace with 14 gift card trading apps and 700,000 active users per app, Fauzan became the AI deployment lead: he selected and deployed Crisp AI, running 20 AI agents in production with compliance approval and canary rollouts, achieving an 83% cost reduction, 30% reduction in human agent workload, and 3-7% uplift in CSAT/NPS. He also designed a Google Cloud Vision OCR pipeline that reduced failed transactions by 15-20%, and worked on a multi-layer fraud detection stack using Claude/GPT-4o Vision Agents, CLIP embeddings in Pinecone for sub-50ms semantic duplicate detection across 14 apps, and LangGraph orchestration with Kafka.

Independently, he built a maritime document automation pipeline (83% faster processing), HarbourMind (a FastAPI + Gemini 2.5 Flash service with a 32x async speedup), and an end-to-end encrypted React Native messaging app. He holds an MBA from Welingkar Institute, a BBA in Computer Applications, and is a Six Sigma Green Belt. His core philosophy: find the truth in the data, redesign the system around it, automate what should be automated, govern what you automate, and prove the result with numbers. His website is fauzan.me.`;

      let aiScript;

      if (mode === "interrupt") {
        // 4a. A visitor interrupted the intro podcast with their own question
        if (!env.GEMINI_API_KEY) {
          throw new Error("GEMINI_API_KEY secret is not set on this Worker.");
        }
        const prompt = `You are two funny, energetic AI podcast hosts named Alex and Sam, mid-way through recording an introductory episode about Fauzan.
Review this profile data about Fauzan: "${fauzanProfile}".
A website visitor just interrupted with this question: "${question}".
Write a brief dialogue where Alex first reacts with excitement that a visitor has sent in a question live, then Sam reads it out, then both hosts give a 2-sentence answer based on his profile, then wrap up warmly.
Format it strictly like this, with each line starting with the speaker name:
Alex: [reaction]
Sam: [reads out the question and answers]
Alex: [answers]
Sam: [wrap-up]`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY.trim()}`;
        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
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
        aiScript = data.candidates[0].content.parts[0].text;

      } else if (mode === "intro_part1") {
        // 4b. First couple of lines of the intro — generated fast so audio starts almost instantly
        aiScript = INTRO_SCRIPT_PART1;

      } else if (mode === "intro_part2") {
        // 4c. The rest of the intro, fetched in parallel while part 1 plays
        aiScript = INTRO_SCRIPT_PART2;

      } else {
        // 4c. Standalone question (no intro playing)
        if (!env.GEMINI_API_KEY) {
          throw new Error("GEMINI_API_KEY secret is not set on this Worker.");
        }
        const prompt = `You are two funny, energetic AI podcast hosts named Alex and Sam.
Review this profile data about Fauzan: "${fauzanProfile}".
A website visitor just asked this question: "${question}".
Have a brief, 2-sentence dialogue answering the question directly based on his profile.
Format it strictly like this:
Alex: [response]
Sam: [response]`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY.trim()}`;
        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
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
        aiScript = data.candidates[0].content.parts[0].text;
      }

      // 6. Perform the script as speech with Google Cloud Text-to-Speech (one voice per host)
      const VOICE_NAMES = {
        Alex: "en-GB-Chirp3-HD-Charon", // male
        Sam: "en-GB-Chirp3-HD-Leda",    // female
      };

      const lines = aiScript.split("\n").map(l => l.trim()).filter(Boolean);
      const audioChunks = [];
      for (const line of lines) {
        const match = line.match(/^(Alex|Sam):\s*(.+)$/);
        if (!match) continue;
        const [, speaker, text] = match;
        const voiceName = VOICE_NAMES[speaker];

        if (!env.GOOGLE_TTS_API_KEY) {
          throw new Error("GOOGLE_TTS_API_KEY secret is not set on this Worker.");
        }
        const ttsRes = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_TTS_API_KEY.trim()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice: { languageCode: "en-GB", name: voiceName },
            audioConfig: { audioEncoding: "MP3" },
          }),
        });

        const ttsRawText = await ttsRes.text();
        let ttsJson;
        try {
          ttsJson = JSON.parse(ttsRawText);
        } catch {
          throw new Error(`Google TTS HTTP ${ttsRes.status}: ${ttsRawText.slice(0, 300) || '(empty body)'}`);
        }
        if (!ttsJson.audioContent) {
          throw new Error(ttsJson.error?.message || "Google TTS returned no audio: " + JSON.stringify(ttsJson));
        }
        audioChunks.push(Uint8Array.from(atob(ttsJson.audioContent), c => c.charCodeAt(0)));
      }

      if (audioChunks.length === 0) {
        throw new Error("No audio lines were generated from the script: " + aiScript);
      }

      const totalLength = audioChunks.reduce((sum, b) => sum + b.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of audioChunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      let binary = "";
      for (let i = 0; i < combined.length; i++) binary += String.fromCharCode(combined[i]);
      const mp3Base64 = btoa(binary);

      // 7. Send the finished audio back to your website!
      return new Response(JSON.stringify({ audio: mp3Base64, mimeType: "audio/mpeg" }), {
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

// The default ~6-minute introductory episode, used when a visitor hits "Start Listening".
// Split into two parts so playback can start almost instantly with part 1 while part 2
// (the bulk of the episode) is generated in parallel.
const INTRO_SCRIPT_PART1 = `Alex: Hey everyone, welcome back to the show — today we're doing something a little different. We're putting one of our favourite case studies, Fauzan Battiwala, under the microscope.
Sam: I love this one. It's basically an eight-year tour through banking, CRM, automation, and now full-blown AI deployment. Where do we even start?`;

const INTRO_SCRIPT_PART2 = `Alex: Right at the beginning. Fauzan's career kicks off at Citibank US, working through TCS in Mumbai, handling high-stakes escalations — the cases nobody else could close.
Sam: That's such a classic origin story. High-pressure customer ops, real money, real regulations. He came out of that with two habits that follow him everywhere: chase the root cause, and trust the data trail.
Alex: And he didn't waste time. Around the same period, he led a Six Sigma DMAIC project for Hello Mineral Water in Mumbai — a company that was genuinely struggling.
Sam: The numbers on that one are wild. NPS went from twenty-eight percent to ninety-three percent. SLA compliance jumped from thirty-four to eighty-eight percent. In six months.
Alex: That's not a small tweak, that's a turnaround. And it set the template he reuses for the rest of his career — measure it, diagnose it, redesign it, and bring the people along with the change.
Sam: Fast forward to Hinduja Global Solutions Interactive, end of twenty-eighteen through twenty-twenty. Now he's operating at enterprise scale.
Alex: We're talking Disney Plus, Toyota India, Aster DM Healthcare, Walmart and Sam's Club. He led a zero-downtime migration of Disney Plus's CRM from Salesforce to Freshdesk.
Sam: Zero downtime, for a brand like that — that's a systems-thinking achievement, not just a project tick-box. He also pushed first-contact resolution from forty-six to sixty-two percent in three months.
Alex: Then he moves to Dubai. Towr Portal, twenty twenty-one to twenty twenty-two — this is where he starts building automation instead of just managing it.
Sam: He set up Zoho CRM workflows that auto-converted web enquiries into sales orders with instant alerts, plus a one-day SLA enforced automatically. B2B acquisition grew by a hundred and twenty percent.
Alex: And monthly orders went from around fifty to fifteen hundred. One person, building systems that did the work of a whole coordination team.
Sam: Next stop, LiftMyCar, twenty twenty-two to twenty twenty-four. This is where he ships his first production conversational AI — a three-sixty-io chatbot across WhatsApp, web, and social.
Alex: Full lifecycle ownership — decision trees, fallback handling, escalation logic, human handoff. Plus he redesigned the booking journey from eight steps down to four or five.
Sam: And then — Kobet Technologies DMCC. This is the big one. Fourteen gift card trading apps, seven hundred thousand active users per app. Fauzan becomes the company's AI deployment lead.
Alex: He evaluated AI CRM platforms costing up to fifty thousand dollars a month, ran a live proof of concept, and picked Crisp at three hundred dollars a month. That's an eighty-three percent cost reduction.
Sam: Twenty AI agents, live in production, with compliance approval and canary rollouts. Thirty percent reduction in human agent workload, and a three to seven percent uplift across CSAT and NPS.
Alex: He also built a Google Cloud Vision OCR pipeline that cut failed transactions by fifteen to twenty percent, and worked on a multi-layer fraud detection stack — CLIP embeddings in Pinecone, finding duplicate cards across all fourteen apps in under fifty milliseconds.
Sam: And on his own time, he's built a maritime document automation pipeline that's eighty-three percent faster, HarbourMind — a FastAPI and Gemini service with a thirty-two times speedup — and an end-to-end encrypted messaging app.
Alex: MBA from Welingkar Institute, Six Sigma Green Belt, and a philosophy that's stayed consistent the whole way through — find the truth in the data, redesign around it, automate what should be automated, and prove it with numbers.
Sam: Honestly, that's the through-line of this whole episode. The tools changed completely over eight years — the discipline never did.
Alex: If you've got a question for Fauzan, type it in below — we'll grab it live and dig in right here on the show.
Sam: Thanks for listening, everyone — back after this question!`;

