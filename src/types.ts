/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MatchEventType = 
  | 'KICK_OFF'
  | 'GOAL'
  | 'YELLOW_CARD'
  | 'RED_CARD'
  | 'SUBSTITUTION'
  | 'HALF_TIME'
  | 'FULL_TIME'
  | 'COMMENTARY';

export interface MatchEvent {
  id: string;
  minute: number;
  type: MatchEventType;
  team: 'home' | 'away' | 'neutral';
  player?: string;
  playerIn?: string;  // For substitutions
  playerOut?: string; // For substitutions
  detail?: string;    // Brief description of the event
  intensity: number;  // Emotional/narrative intensity (0.0 to 1.0)
}

export interface TeamInfo {
  name: string;
  code?: string;
  color: string;      // Visual primary color mapping for the team
  secondaryColor?: string;
}

export interface MatchData {
  id: string;
  query?: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  score: {
    home: number;
    away: number;
  };
  date: string;
  stadium?: string;
  competition: string;
  timeline: MatchEvent[];
  summary?: string;   // AI-generated poetic cosmic summary of the match
}

export interface GalaxyVisualConfig {
  speed: number;          // playback speed (minutes per second of animation)
  particleCount: number;  // baseline particles
  crystallized: boolean;  // whether final fulltime frozen state is active
  particleScale: number;  // size multiplier
  glowEnabled: boolean;   // visual style setting
}
