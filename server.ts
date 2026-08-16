import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT || 3000);

const resolvePort = (port: number): number => {
  if (!Number.isInteger(port) || port <= 0) return 3000;
  return port;
};

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Route: Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Home & Decor" });
});

// API Route: Paystack Transaction Initialization Mock
app.post("/api/paystack/initialize", (req, res) => {
  const { amount, email, currency = "NGN", metadata } = req.body;
  const ref = `PST-${Date.now()}-${Math.floor(Math.random() * 899999 + 100000)}`;
  
  res.json({
    status: true,
    message: "Authorization URL created",
    data: {
      authorization_url: `https://checkout.paystack.com/simulate-${ref}`,
      access_code: `ac_${Math.random().toString(36).substring(2, 10)}`,
      reference: ref,
      amount,
      currency,
      email,
      metadata
    }
  });
});

// API Route: Paystack Verification Endpoint
app.post("/api/paystack/verify", (req, res) => {
  const { reference } = req.body;
  res.json({
    status: true,
    message: "Verification successful",
    data: {
      id: Math.floor(Math.random() * 100000000),
      domain: "test",
      status: "success",
      reference: reference || `PST-${Date.now()}`,
      amount: req.body.amount || 1500000,
      gateway_response: "Successful",
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      channel: req.body.channel || "card",
      currency: "NGN",
      ip_address: "127.0.0.1"
    }
  });
});

// API Route: Gemini AI Room Decor Advisor
app.post("/api/ai/decor-advisor", async (req, res) => {
  try {
    const { roomType, styleTheme, budget, spaceSize } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if Gemini API key isn't provided
      return res.json({
        recommendation: `Based on your request for a ${roomType || "Dorm Room"} with a ${styleTheme || "Cozy Warm"} theme: We recommend combining our RGB Smart LED Strip Lights along with Non-Marking Wall Hooks and a Multi-Compartment Desk Organizer. This setup maximizes space without damaging walls!`,
        suggestedProductIds: ["hd-led-01", "hd-hook-01", "hd-org-01", "hd-plant-01"],
        tips: [
          "Use damage-free adhesive strips for wall mounting.",
          "Keep high-frequency desk items within arm's reach in tiered trays.",
          "Layer lighting with warm ambient LED strips behind your monitor or bed frame."
        ]
      });
    }

    const prompt = `You are a high-end interior stylist specializing in small space and student room decor for school/dorm rooms. 
The user is asking for room decor recommendations with:
- Room Type: ${roomType || 'Dorm Room'}
- Style Theme: ${styleTheme || 'Cozy Soft Aesthetic'}
- Budget Level: ${budget || 'Mid-range ($30-$80)'}
- Space Size: ${spaceSize || 'Compact Desk & Bedside'}

Provide a personalized, encouraging room styling advice response (around 120-150 words) with 3 practical space-saving tips.
Focus strictly on small decor items like LED lighting, wall adhesive hooks, desk organizers, mini planters, cable accessories, and photo clip strings. DO NOT suggest any furniture like beds, tables, chairs, or wardrobes. Return valid JSON formatted as:
{
  "recommendation": "text string",
  "tips": ["tip 1", "tip 2", "tip 3"],
  "suggestedProductCategories": ["LED Lighting", "Wall Hooks", "Desk Organizers", "Mini Planters"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "{}";
    const data = JSON.parse(responseText);
    return res.json(data);
  } catch (err: any) {
    console.error("Gemini AI Decor Advisor Error:", err);
    return res.status(500).json({
      error: "Failed to generate decor recommendations",
      fallback: "Pair warm fairy light strings with adhesive hooks and a tier desk tray for an instant cozy study setup!"
    });
  }
});

// Diagnostic endpoint for image serving
app.get("/api/test-images", (_req, res) => {
  try {
    const imagesPath = path.join(process.cwd(), "public/images");
    const images = fs.readdirSync(imagesPath).slice(0, 5);
    res.json({ 
      status: "Images folder found", 
      path: imagesPath,
      sampleImages: images,
      totalCount: fs.readdirSync(imagesPath).length
    });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

// Serve static image files with high priority
app.use("/images", express.static(path.join(process.cwd(), "public/images"), { maxAge: '1d' }));
app.use("/images", express.static(path.join(process.cwd(), "src/assets/images"), { maxAge: '1d' }));
app.use(express.static(path.join(process.cwd(), "public"), { maxAge: '1d' }));

// Serve Vite dev server or static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const startOnPort = (port: number) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`🏠 Home & Decor Server running on http://localhost:${port}`);
      console.log(`📸 Test images: http://localhost:${port}/api/test-images`);
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        const fallbackPort = resolvePort(port + 1);
        console.warn(`Port ${port} is busy, retrying on ${fallbackPort}...`);
        startOnPort(fallbackPort);
        return;
      }

      console.error("Server startup error:", err);
      process.exit(1);
    });
  };

  startOnPort(resolvePort(DEFAULT_PORT));
}

startServer();
