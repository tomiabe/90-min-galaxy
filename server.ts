/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { PRESET_MATCHES } from './src/presets.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.log('No valid GEMINI_API_KEY found. App will run in preset-only or simulation mode.');
}

// Define the response schema for match search
const matchResponseSchema = {
  type: Type.OBJECT,
  properties: {
    competition: { type: Type.STRING, description: 'Competition name, e.g. FIFA World Cup Final 2026' },
    date: { type: Type.STRING, description: 'Date of the match (YYYY-MM-DD)' },
    stadium: { type: Type.STRING, description: 'Stadium name and location' },
    homeTeam: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: 'Full country/club name' },
        code: { type: Type.STRING, description: '3-letter abbreviation, e.g. ARG, USA' },
        color: { type: Type.STRING, description: 'A gorgeous bright HEX color representing their primary kit (avoid boring grays/blacks unless vital)' },
        secondaryColor: { type: Type.STRING, description: 'A gorgeous HEX color representing their secondary kit color' },
      },
      required: ['name', 'color'],
    },
    awayTeam: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: 'Full country/club name' },
        code: { type: Type.STRING, description: '3-letter abbreviation, e.g. FRA, GER' },
        color: { type: Type.STRING, description: 'A gorgeous bright HEX color representing their primary kit (must contrast well with homeTeam.color)' },
        secondaryColor: { type: Type.STRING, description: 'A gorgeous HEX color representing their secondary kit color' },
      },
      required: ['name', 'color'],
    },
    score: {
      type: Type.OBJECT,
      properties: {
        home: { type: Type.INTEGER },
        away: { type: Type.INTEGER },
      },
      required: ['home', 'away'],
    },
    summary: { 
      type: Type.STRING, 
      description: 'A beautiful, highly artistic, single-paragraph description summarizing the flow, texture, and emotional arc of this match as if it were a physical galaxy. Use cosmic/stellar metaphors like supernova explosions, dark matter voids, solar flares, and crystallization.' 
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          minute: { type: Type.INTEGER, description: 'The match minute (1 to 120+)' },
          type: { 
            type: Type.STRING, 
            description: 'MUST be one of: KICK_OFF, GOAL, YELLOW_CARD, RED_CARD, SUBSTITUTION, HALF_TIME, FULL_TIME, COMMENTARY' 
          },
          team: { type: Type.STRING, description: "Must be 'home', 'away', or 'neutral'" },
          player: { type: Type.STRING, description: 'Name of the main player involved' },
          playerIn: { type: Type.STRING, description: 'Name of player entering (substitutions only)' },
          playerOut: { type: Type.STRING, description: 'Name of player leaving (substitutions only)' },
          detail: { type: Type.STRING, description: 'A dramatic description of the event incorporating poetic cosmic/space terminology.' },
          intensity: { type: Type.NUMBER, description: 'The emotional/dramatic weight of this moment from 0.0 to 1.0 (Goals should be 1.0, red cards 0.8-0.9, yellow cards 0.5-0.6, commentary 0.2-0.8 based on severity)' },
        },
        required: ['minute', 'type', 'team', 'detail', 'intensity'],
      },
    },
  },
  required: ['competition', 'date', 'homeTeam', 'awayTeam', 'score', 'summary', 'timeline'],
};

// API Endpoints
app.get('/api/presets', (req, res) => {
  res.json(PRESET_MATCHES);
});

app.post('/api/match-galaxy', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required and must be a string' });
  }

  // Check if query is a preset ID
  const preset = PRESET_MATCHES.find(p => p.id === query || p.id.toLowerCase() === query.toLowerCase());
  if (preset) {
    console.log(`Serving preset match: ${preset.homeTeam.name} vs ${preset.awayTeam.name}`);
    return res.json(preset);
  }

  if (!ai) {
    // Fall back to a semi-random preset if Gemini isn't configured
    console.log('No Gemini client available. Falling back to preset.');
    const randomPreset = PRESET_MATCHES[Math.floor(Math.random() * PRESET_MATCHES.length)];
    return res.json({
      ...randomPreset,
      id: `sim-${Date.now()}`,
      query: query,
      summary: `[DEMO - API Key Missing] This is a cosmic playback simulation of the historic ${randomPreset.homeTeam.name} vs ${randomPreset.awayTeam.name} match, styled to match your request for "${query}". Set up your GEMINI_API_KEY in the Secrets panel to search and render ANY football match from the internet!`,
    });
  }

  try {
    console.log(`Searching and translating match via Gemini: "${query}"`);
    
    const prompt = `You are a cosmic archivist and high-end generative artist.
Search the web for the soccer match matching: "${query}".
It can be a historical match, a club match, or a very recent 2026 World Cup match. If you can't find real detailed events, use your knowledge of the match or construct a highly realistic and detailed match timeline that tells its true dramatic story.

You MUST compile a detailed timeline of events from the match, mapping football milestones to cosmic events:
- Kick-off (minute 1) starts the dust swirl.
- Goals (each one gets a detailed player name, minute, and intensity 1.0).
- Yellow Cards (player name, minute, amber pulse ripple).
- Red Cards (player name, minute, violent red burst).
- Substitutions (players involved, minute).
- Halftime (around minute 45).
- Fulltime (final minute: 90, 120, etc.).
- Critical moments or near-misses (penalties awarded/saved, close shots, fight/friction) labeled as type COMMENTARY.

Generate team colors representing their real kits (home or away). The colors must be beautiful, vibrant, and contrast strongly with each other (e.g., #E02424 and #3B82F6).
Write a beautiful poetic 'summary' paragraph of the match describing its physical flow as a rotating galaxy of particles.
Include a unique random ID for each event.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: matchResponseSchema,
        temperature: 0.2, // Keep it relatively deterministic to adhere to factual events
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gemini returned an empty response');
    }

    const matchData = JSON.parse(textOutput);
    
    // Add unique IDs to the generated timeline
    if (matchData.timeline && Array.isArray(matchData.timeline)) {
      matchData.timeline = matchData.timeline.map((event: any, index: number) => ({
        id: `gen-${index}-${Date.now()}`,
        ...event
      }));
      // Sort timeline by minute to be absolutely safe
      matchData.timeline.sort((a: any, b: any) => a.minute - b.minute);
    }

    // Add search-specific metadata
    const resultMatchData = {
      id: `gen-${Date.now()}`,
      query,
      ...matchData
    };

    res.json(resultMatchData);
  } catch (error: any) {
    console.error('Error generating match galaxy:', error);
    // Graceful fallback to random preset
    const randomPreset = PRESET_MATCHES[Math.floor(Math.random() * PRESET_MATCHES.length)];
    res.json({
      ...randomPreset,
      id: `err-sim-${Date.now()}`,
      query: query,
      summary: `[Simulation Fallback] We had trouble connecting to the cosmic football archives for "${query}" (Error: ${error.message || 'Rate limit or connection issue'}). We have rendered the beautiful, legendary ${randomPreset.homeTeam.name} vs ${randomPreset.awayTeam.name} galaxy instead!`,
    });
  }
});

// Configure Vite or Static Files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
