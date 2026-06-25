/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatchData } from './types';

export const PRESET_MATCHES: MatchData[] = [
  {
    id: 'arg-fra-2022',
    competition: 'FIFA World Cup Final 2022',
    date: '2022-12-18',
    stadium: 'Lusail Stadium, Qatar',
    homeTeam: {
      name: 'Argentina',
      code: 'ARG',
      color: '#75AADB', // Light Sky Blue
      secondaryColor: '#FFFFFF',
    },
    awayTeam: {
      name: 'France',
      code: 'FRA',
      color: '#071F42', // Deep Navy Blue
      secondaryColor: '#C8102E', // French Red
    },
    score: { home: 3, away: 3 },
    summary: 'A breathtaking cosmic clash of extreme emotional gravity. The galaxy was dominated early by steady, elegant sky-blue rings of Argentine control, punctuated by two sudden supernovas. A late French dark-matter distortion propelled by Mbappé triggered a series of chaotic, red-hot high-energy collisions, forcing extra time where stars collapsed and reborn, culminating in a beautiful, crystallizing state of absolute equilibrium.',
    timeline: [
      { id: '1', minute: 1, type: 'KICK_OFF', team: 'neutral', detail: 'The cosmic battle begins in Lusail. Dust particles begin to swirl.', intensity: 0.1 },
      { id: '2', minute: 21, type: 'COMMENTARY', team: 'home', detail: 'Di Maria is clipped in the box. A massive ripple of gravity spikes across the pitch.', intensity: 0.5 },
      { id: '3', minute: 23, type: 'GOAL', team: 'home', player: 'Lionel Messi', detail: 'Messi coolly slots the penalty! A sky-blue supernova erupts at the core, birthing a massive glowing star.', intensity: 1.0 },
      { id: '4', minute: 36, type: 'GOAL', team: 'home', player: 'Angel Di Maria', detail: 'A counter-attack of pure mathematical precision! Di Maria sweeps it home. A secondary supernova lights up the outer spiral arm.', intensity: 0.95 },
      { id: '5', minute: 41, type: 'SUBSTITUTION', team: 'away', playerIn: 'Kolo Muani', playerOut: 'Dembele', detail: 'Desperate reorganization of the French stellar cluster.', intensity: 0.4 },
      { id: '6', minute: 41, type: 'SUBSTITUTION', team: 'away', playerIn: 'Marcus Thuram', playerOut: 'Giroud', detail: 'Another physical particle injected to shift the orbital velocity.', intensity: 0.4 },
      { id: '7', minute: 45, type: 'HALF_TIME', team: 'neutral', detail: 'Intermission. The galaxy cools down, leaving a radiant sky-blue disk of control.', intensity: 0.2 },
      { id: '8', minute: 55, type: 'YELLOW_CARD', team: 'away', player: 'Adrien Rabiot', detail: 'Rabiot stops a break. Amber pulse energy radiates outwards.', intensity: 0.6 },
      { id: '9', minute: 64, type: 'SUBSTITUTION', team: 'home', playerIn: 'Acuna', playerOut: 'Di Maria', detail: 'Argentine defensive shielding deployed.', intensity: 0.3 },
      { id: '10', minute: 79, type: 'COMMENTARY', team: 'away', detail: 'Otamendi pulls down Kolo Muani! France awarded a lifeline. Tension vibrates through the space-time grid.', intensity: 0.7 },
      { id: '11', minute: 80, type: 'GOAL', team: 'away', player: 'Kylian Mbappé', detail: 'Mbappé powers the penalty in! A dark navy supernova erupts, cutting into the Argentine blue dominance.', intensity: 0.95 },
      { id: '12', minute: 81, type: 'GOAL', team: 'away', player: 'Kylian Mbappé', detail: 'UNBELIEVABLE! A majestic scissor volley! An absolute blinding navy-blue supernova ignites instantly. The galaxy is in total, fiery flux!', intensity: 1.0 },
      { id: '13', minute: 87, type: 'YELLOW_CARD', team: 'away', player: 'Marcus Thuram', detail: 'Thuram booked for simulation. Amber solar flare ripples.', intensity: 0.5 },
      { id: '14', minute: 90, type: 'COMMENTARY', team: 'home', detail: 'Messi unleashes a thunderbolt from distance, saved by Lloris! A stellar shockwave deflected.', intensity: 0.8 },
      { id: '15', minute: 102, type: 'SUBSTITUTION', team: 'home', playerIn: 'Lautaro Martinez', playerOut: 'Alvarez', detail: 'Fresh impact particle introduced at the core.', intensity: 0.35 },
      { id: '16', minute: 108, type: 'GOAL', team: 'home', player: 'Lionel Messi', detail: 'MESSI SCORES AGAIN! Chaos in the six-yard box! Argentine supernova fires up. The ball is scrambled over! Blinding sky-blue star ignited!', intensity: 1.0 },
      { id: '17', minute: 116, type: 'YELLOW_CARD', team: 'home', player: 'Leandro Paredes', detail: 'Violent challenge. A heavy amber pulse wave.', intensity: 0.6 },
      { id: '18', minute: 118, type: 'GOAL', team: 'away', player: 'Kylian Mbappé', detail: 'MBAPPE HAT-TRICK! Penalty converted. A third massive navy supernova lights up the night. The score is locked at 3-3!', intensity: 1.0 },
      { id: '19', minute: 120, type: 'COMMENTARY', team: 'away', detail: 'Kolo Muani clean through, but Emi Martinez makes a miraculous leg save! A cosmic deflection preventing a total galactic collapse!', intensity: 0.99 },
      { id: '20', minute: 121, type: 'FULL_TIME', team: 'neutral', detail: 'Full-time. The game moves to penalties. The physical match ends and the galaxy crystallizes into a permanent, legendary, double-ringed nebula of sky-blue and deep navy.', intensity: 0.9 },
    ],
  },
  {
    id: 'bra-ger-2014',
    competition: 'FIFA World Cup Semifinal 2014',
    date: '2014-07-08',
    stadium: 'Estádio Mineirão, Belo Horizonte',
    homeTeam: {
      name: 'Brazil',
      code: 'BRA',
      color: '#FDE047', // Vibrant Yellow
      secondaryColor: '#16A34A', // Green
    },
    awayTeam: {
      name: 'Germany',
      code: 'GER',
      color: '#FFFFFF', // Pure White / Light Gray
      secondaryColor: '#171717', // Black
    },
    score: { home: 1, away: 7 },
    summary: 'A dramatic, highly asymmetric gravitational collapse. What was expected to be a balanced binary star system turned into a terrifying cascade of blinding white-hot German supernovas in a brief 18-minute window. The Brazilian golden nebula was violently scattered, leaving a fading, dark-matter dominated structure with a single late golden spark of memory at the very end.',
    timeline: [
      { id: '1', minute: 1, type: 'KICK_OFF', team: 'neutral', detail: 'The match begins in Belo Horizonte. A stadium filled with golden solar flares.', intensity: 0.1 },
      { id: '2', minute: 11, type: 'GOAL', team: 'away', player: 'Thomas Müller', detail: 'Müller unmarked from a corner! A brilliant white-hot supernova ignites at the edge of the core.', intensity: 0.85 },
      { id: '3', minute: 23, type: 'GOAL', team: 'away', player: 'Miroslav Klose', detail: 'Klose breaks the all-time World Cup scoring record! A double-layered supernova explosion of historic proportions.', intensity: 0.95 },
      { id: '4', minute: 24, type: 'GOAL', team: 'away', player: 'Toni Kroos', detail: 'Another one! Kroos fires a lethal half-volley. A spectacular white flare ripples through the entire canvas.', intensity: 0.9 },
      { id: '5', minute: 26, type: 'GOAL', team: 'away', player: 'Toni Kroos', detail: 'UNREAL! Kroos scores again in 69 seconds! A second adjacent white supernova burst. The Brazilian defensive orbit completely disintegrates.', intensity: 0.95 },
      { id: '6', minute: 29, type: 'GOAL', team: 'away', player: 'Sami Khedira', detail: 'Five-nil! Khedira finishes a beautiful team move. A massive stellar shockwave wipes out the remaining golden dust particles.', intensity: 1.0 },
      { id: '7', minute: 45, type: 'HALF_TIME', team: 'neutral', detail: 'Halftime. A stunned, silent stasis wraps around the Belo Horizonte sector. The yellow glow is faint and crushed.', intensity: 0.3 },
      { id: '8', minute: 46, type: 'SUBSTITUTION', team: 'home', playerIn: 'Paulinho', playerOut: 'Fernandinho', detail: 'Brazil attempts a particle reconfiguration.', intensity: 0.3 },
      { id: '9', minute: 46, type: 'SUBSTITUTION', team: 'home', playerIn: 'Ramires', playerOut: 'Hulk', detail: 'Ramires injected into the decaying yellow field.', intensity: 0.3 },
      { id: '10', minute: 68, type: 'YELLOW_CARD', team: 'home', player: 'Dante', detail: 'Dante booked for a desperate challenge. Amber rings expand weakly.', intensity: 0.4 },
      { id: '11', minute: 69, type: 'GOAL', team: 'away', player: 'André Schürrle', detail: 'Germany makes it six. A cool finish, igniting a bright white star in the outer rim.', intensity: 0.8 },
      { id: '12', minute: 79, type: 'GOAL', team: 'away', player: 'André Schürrle', detail: 'A spectacular shot off the crossbar and in! A violent white burst, leaving a brilliant permanent star.', intensity: 0.85 },
      { id: '13', minute: 90, type: 'GOAL', team: 'home', player: 'Oscar', detail: 'A late consolation. Oscar scores a breakaway goal. A single, poignant golden supernova erupts in a sea of cold white stars.', intensity: 0.6 },
      { id: '14', minute: 91, type: 'FULL_TIME', team: 'neutral', detail: 'The collapse is complete. The galaxy crystallizes into a permanent, lopsided constellation of seven blinding white-dwarf stars and one lonely yellow spark.', intensity: 0.8 },
    ],
  },
  {
    id: 'spa-ned-2010',
    competition: 'FIFA World Cup Final 2010',
    date: '2010-07-11',
    stadium: 'Soccer City, Johannesburg',
    homeTeam: {
      name: 'Netherlands',
      code: 'NED',
      color: '#EA580C', // Deep Orange
      secondaryColor: '#1E3A8A', // Blue
    },
    awayTeam: {
      name: 'Spain',
      code: 'ESP',
      color: '#DC2626', // Bright Red
      secondaryColor: '#EAB308', // Yellow
    },
    score: { home: 0, away: 1 },
    summary: 'A highly volatile, high-friction celestial clash. The canvas is filled with intense, colliding orange and red energy fields, resulting in a record-breaking cascade of amber solar pulses (yellow cards). As the particles become increasingly turbulent, a massive red solar ejection (red card) occurs in extra time, followed immediately by a single, blinding scarlet supernova that locks the universe into an eternal Spanish victory.',
    timeline: [
      { id: '1', minute: 1, type: 'KICK_OFF', team: 'neutral', detail: 'Kick-off in Johannesburg. An orange and red cosmic dust storm begins.', intensity: 0.1 },
      { id: '2', minute: 15, type: 'YELLOW_CARD', team: 'away', player: 'Robin van Persie', detail: 'Van Persie fouls Capdevila. First amber shockwave ripples.', intensity: 0.5 },
      { id: '3', minute: 17, type: 'YELLOW_CARD', team: 'home', player: 'Carles Puyol', detail: 'Puyol pulls down Robben. Red-orange amber flare sparks.', intensity: 0.5 },
      { id: '4', minute: 22, type: 'YELLOW_CARD', team: 'away', player: 'Mark van Bommel', detail: 'Van Bommel booked. Amber ripple expands aggressively.', intensity: 0.6 },
      { id: '5', minute: 23, type: 'YELLOW_CARD', team: 'home', player: 'Sergio Ramos', detail: 'Ramos fouls Kuyt. Another rapid amber pulse.', intensity: 0.5 },
      { id: '6', minute: 28, type: 'YELLOW_CARD', team: 'away', player: 'Nigel de Jong', detail: 'De Jongs high-boot karate kick to Xabi Alonsos chest! A highly violent amber-red flash of solar energy.', intensity: 0.75 },
      { id: '7', minute: 45, type: 'HALF_TIME', team: 'neutral', detail: 'Halftime. The highly volatile particles swirl in a tense, warm orange-red nebula.', intensity: 0.2 },
      { id: '8', minute: 57, type: 'YELLOW_CARD', team: 'away', player: 'John Heitinga', detail: 'Heitinga booked for stopping Villa. Amber energy wave.', intensity: 0.5 },
      { id: '9', minute: 62, type: 'COMMENTARY', team: 'away', detail: 'Sneijder slides Robben clean through, but Iker Casillas makes a legendary toe-save! A massive dark matter shield deflects a certain collapse!', intensity: 0.95 },
      { id: '10', minute: 84, type: 'YELLOW_CARD', team: 'away', player: 'Gregory van der Wiel', detail: 'Friction continues to boil. Amber pulse wave.', intensity: 0.5 },
      { id: '11', minute: 90, type: 'HALF_TIME', team: 'neutral', detail: 'Normal time ends. The match enters extra time. Cosmic orbits are stretched and highly unstable.', intensity: 0.3 },
      { id: '12', minute: 109, type: 'RED_CARD', team: 'away', player: 'John Heitinga', detail: 'Heitinga receives a second yellow! A violent red explosion erupts as he is ejected from the orbital system, leaving a void.', intensity: 0.85 },
      { id: '13', minute: 116, type: 'GOAL', team: 'home', player: 'Andrés Iniesta', detail: 'INIESTA SCORES! Spain takes the lead! A glorious, blinding scarlet-gold supernova ignites the core. An unforgettable star is born!', intensity: 1.0 },
      { id: '14', minute: 117, type: 'YELLOW_CARD', team: 'home', player: 'Andrés Iniesta', detail: 'Iniesta removes his shirt in celebration. A beautiful golden solar wave.', intensity: 0.5 },
      { id: '15', minute: 120, type: 'FULL_TIME', team: 'neutral', detail: 'Spain are World Champions! The intense orange-red galaxy freezes, crystallizing into a magnificent red constellation orbiting a single, brilliant white-gold star.', intensity: 0.9 },
    ],
  },
];
