/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { MatchData, MatchEvent, GalaxyVisualConfig } from '../types';
import { Info, Volume2, VolumeX, Eye, Sparkles } from 'lucide-react';

interface GalaxyCanvasProps {
  matchData: MatchData | null;
  currentTime: number; // in minutes (0 to 120+)
  isPlaying: boolean;
  speed: number;
  crystallized: boolean;
  onEventTriggered?: (event: MatchEvent) => void;
  onCrystallizedChange?: (val: boolean) => void;
}

export default function GalaxyCanvas({
  matchData,
  currentTime,
  isPlaying,
  speed,
  crystallized,
  onEventTriggered,
  onCrystallizedChange,
}: GalaxyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  // References to keep state accessible inside the p5 loops without recreation
  const stateRef = useRef({
    currentTime,
    isPlaying,
    speed,
    crystallized,
    matchData,
    lastMinuteProcessed: 0,
  });

  // Track the selected legacy star to show a tooltip
  const [hoveredStar, setHoveredStar] = useState<{
    player: string;
    minute: number;
    teamName: string;
    type: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    stateRef.current = {
      currentTime,
      isPlaying,
      speed,
      crystallized,
      matchData,
      lastMinuteProcessed: stateRef.current.lastMinuteProcessed,
    };
  }, [currentTime, isPlaying, speed, crystallized, matchData]);

  // Handle match changes to reset internal processed states
  useEffect(() => {
    stateRef.current.lastMinuteProcessed = 0;
  }, [matchData?.id]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any existing p5 instances before starting a new one
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }

    const sketch = (p: p5) => {
      // Configuration & Physics variables
      let particles: Particle[] = [];
      let shockwaves: Shockwave[] = [];
      let legacyStars: LegacyStar[] = [];
      let centralBlackHoleMass = 1.0;
      let angleOffset = 0;
      let zoom = 1.0;
      let baseWidth = 800;
      let baseHeight = 600;

      // Color maps
      let homeColor: p5.Color;
      let awayColor: p5.Color;
      let neutralColor: p5.Color;

      // Particle class
      class Particle {
        x: number = 0;
        y: number = 0;
        vx: number = 0;
        vy: number = 0;
        angle: number = 0;
        radius: number = 0;
        speed: number = 0;
        size: number = 0;
        color: p5.Color;
        alpha: number = 255;
        team: 'home' | 'away' | 'neutral';
        trail: { x: number; y: number }[] = [];
        maxTrailLength: number = 10;
        friction: number = 0.98;
        pushX: number = 0;
        pushY: number = 0;

        constructor(radius: number, angle: number, team: 'home' | 'away' | 'neutral', size: number) {
          this.radius = radius;
          this.angle = angle;
          this.team = team;
          this.size = size || p.random(1.5, 3.5);
          
          // Speed based on Keplerian orbital mechanics (closer is faster)
          this.speed = p.random(0.005, 0.02) * (150 / (radius + 50));
          if (team === 'away') {
            this.speed = -this.speed; // Away team rotates counter-clockwise
          }
          
          // Color selection
          if (team === 'home') {
            const hColor = p.color(stateRef.current.matchData?.homeTeam.color || '#3B82F6');
            this.color = p.color(
              p.red(hColor) + p.random(-20, 20),
              p.green(hColor) + p.random(-20, 20),
              p.blue(hColor) + p.random(-20, 20)
            );
          } else if (team === 'away') {
            const aColor = p.color(stateRef.current.matchData?.awayTeam.color || '#EF4444');
            this.color = p.color(
              p.red(aColor) + p.random(-20, 20),
              p.green(aColor) + p.random(-20, 20),
              p.blue(aColor) + p.random(-20, 20)
            );
          } else {
            this.color = p.color(180, 180, 255);
          }
          this.alpha = p.random(100, 230);
          this.updatePosition();
        }

        updatePosition() {
          if (stateRef.current.crystallized) {
            // Apply heavy dampening for crystallization
            this.speed *= 0.95;
            this.pushX *= 0.9;
            this.pushY *= 0.9;
          }

          // Compute orbital coordinates
          this.angle += this.speed;
          
          // Add shockwave push
          this.pushX *= this.friction;
          this.pushY *= this.friction;

          const orbitX = Math.cos(this.angle) * this.radius;
          const orbitY = Math.sin(this.angle) * this.radius;

          this.x = orbitX + this.pushX;
          this.y = orbitY + this.pushY;

          // Record trail
          if (stateRef.current.isPlaying && !stateRef.current.crystallized) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrailLength) {
              this.trail.shift();
            }
          }
        }

        applyPush(forceX: number, forceY: number) {
          this.pushX += forceX;
          this.pushY += forceY;
        }

        draw() {
          p.noStroke();
          
          // Draw trails in additive blend mode
          if (!stateRef.current.crystallized && this.trail.length > 1) {
            p.noFill();
            p.stroke(p.red(this.color), p.green(this.color), p.blue(this.color), 30);
            p.strokeWeight(this.size * 0.5);
            p.beginShape();
            for (let pt of this.trail) {
              p.vertex(pt.x, pt.y);
            }
            p.endShape();
          }

          p.noStroke();
          // Adjust size and styling based on crystallization
          if (stateRef.current.crystallized) {
            // Draw crystal points (small diamond-like stars)
            p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), this.alpha);
            p.rectMode(p.CENTER);
            p.push();
            p.translate(this.x, this.y);
            p.rotate(p.QUARTER_PI);
            p.rect(0, 0, this.size * 1.2, this.size * 1.2);
            p.pop();
          } else {
            // Standard cosmic particle
            p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), this.alpha);
            p.ellipse(this.x, this.y, this.size, this.size);
          }
        }
      }

      // LegacyStar (Goal permanent marker) class
      class LegacyStar {
        x: number;
        y: number;
        radius: number;
        angle: number;
        color: p5.Color;
        size: number;
        player: string;
        minute: number;
        teamName: string;
        pulsePhase: number = 0;
        type: 'GOAL' | 'RED_CARD_VOID';

        constructor(radius: number, angle: number, color: p5.Color, player: string, minute: number, teamName: string, type: 'GOAL' | 'RED_CARD_VOID' = 'GOAL') {
          this.radius = radius;
          this.angle = angle;
          this.color = color;
          this.player = player;
          this.minute = minute;
          this.teamName = teamName;
          this.size = type === 'GOAL' ? p.random(14, 22) : 10;
          this.type = type;
          this.pulsePhase = p.random(100);
          this.updatePosition();
        }

        updatePosition() {
          // Legacy stars rotate very slowly with the overall galaxy
          const driftSpeed = stateRef.current.crystallized ? 0 : 0.0005;
          this.angle += driftSpeed;
          this.x = Math.cos(this.angle) * this.radius;
          this.y = Math.sin(this.angle) * this.radius;
        }

        draw() {
          this.pulsePhase += 0.04;
          const pulse = p.sin(this.pulsePhase) * (this.type === 'GOAL' ? 3 : 1.5);
          const currentSize = this.size + pulse;

          p.push();
          p.translate(this.x, this.y);

          if (this.type === 'GOAL') {
            // Draw a gorgeous star flare
            p.noStroke();
            // Core glow
            p.fill(255, 255, 255, 255);
            p.ellipse(0, 0, currentSize * 0.35, currentSize * 0.35);

            // Colored secondary flare
            p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), 80);
            p.ellipse(0, 0, currentSize * 0.8, currentSize * 0.8);

            // Halo
            p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), 30);
            p.ellipse(0, 0, currentSize * 1.5, currentSize * 1.5);

            // Draw four sharp star points (diamond-like flares)
            p.stroke(255, 255, 255, 200);
            p.strokeWeight(1.5);
            p.line(-currentSize * 0.8, 0, currentSize * 0.8, 0);
            p.line(0, -currentSize * 0.8, 0, currentSize * 0.8);
          } else {
            // Red Card Void Star - a dark pulsing hole with red rim
            p.noFill();
            p.stroke(220, 38, 38, 180 + p.sin(this.pulsePhase * 2) * 50);
            p.strokeWeight(2.5);
            p.ellipse(0, 0, currentSize, currentSize);
            
            p.fill(10, 10, 15, 255);
            p.noStroke();
            p.ellipse(0, 0, currentSize * 0.7, currentSize * 0.7);

            // Red central spark
            p.fill(239, 68, 68, 200);
            p.ellipse(0, 0, 3, 3);
          }

          // Label text displayed if hovered (or handled in react)
          p.pop();
        }

        checkHover(mx: number, my: number): boolean {
          const d = p.dist(mx, my, this.x + p.width / 2, this.y + p.height / 2);
          return d < this.size * 1.2;
        }
      }

      // Shockwave (Expanding energy) class
      class Shockwave {
        x: number = 0;
        y: number = 0;
        radius: number = 10;
        maxRadius: number;
        speed: number;
        color: p5.Color;
        thickness: number;
        type: 'GOAL' | 'YELLOW' | 'RED' | 'SUB';

        constructor(type: 'GOAL' | 'YELLOW' | 'RED' | 'SUB', color: p5.Color) {
          this.type = type;
          this.color = color;
          
          if (type === 'GOAL') {
            this.maxRadius = p.random(250, 380);
            this.speed = 4.5;
            this.thickness = 5;
          } else if (type === 'YELLOW') {
            this.maxRadius = p.random(150, 220);
            this.speed = 3.0;
            this.thickness = 3;
          } else if (type === 'RED') {
            this.maxRadius = p.random(220, 300);
            this.speed = 4.0;
            this.thickness = 4.5;
          } else { // SUB
            this.maxRadius = p.random(80, 120);
            this.speed = 2.0;
            this.thickness = 1.5;
          }
        }

        update() {
          this.radius += this.speed;
          
          // Affect particles caught in the ripple
          for (let part of particles) {
            const d = p.dist(part.x, part.y, this.x, this.y);
            // If particle is near the shockwave edge, push it outward
            if (d > this.radius - 15 && d < this.radius + 15) {
              const angle = Math.atan2(part.y - this.y, part.x - this.x);
              const pushIntensity = this.type === 'GOAL' ? 8.0 : this.type === 'RED' ? 12.0 : this.type === 'YELLOW' ? 4.0 : 2.0;
              // Push force falls off with distance
              const force = (pushIntensity * (1.0 - this.radius / this.maxRadius));
              part.applyPush(Math.cos(angle) * force, Math.sin(angle) * force);
            }
          }
        }

        draw() {
          p.noFill();
          const progress = this.radius / this.maxRadius;
          const alpha = p.map(progress, 0, 1, 255, 0);

          p.stroke(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
          p.strokeWeight(this.thickness * (1.0 - progress));
          p.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
        }

        isDead(): boolean {
          return this.radius >= this.maxRadius;
        }
      }

      p.setup = () => {
        // Create canvas fitting container width/height
        const w = containerRef.current?.clientWidth || baseWidth;
        const h = containerRef.current?.clientHeight || baseHeight;
        p.createCanvas(w, h);
        
        // Define colors
        homeColor = p.color(stateRef.current.matchData?.homeTeam.color || '#3B82F6');
        awayColor = p.color(stateRef.current.matchData?.awayTeam.color || '#EF4444');
        neutralColor = p.color(140, 140, 150);

        // Generate baseline ambient space particles
        generateUniverse();
      };

      p.windowResized = () => {
        const w = containerRef.current?.clientWidth || baseWidth;
        const h = containerRef.current?.clientHeight || baseHeight;
        p.resizeCanvas(w, h);
      };

      const generateUniverse = () => {
        particles = [];
        legacyStars = [];
        shockwaves = [];

        // Build stellar disk structure
        // Home team spiral arm (clockwise swirl)
        const homeCount = 180;
        for (let i = 0; i < homeCount; i++) {
          const r = p.random(20, 280);
          // Spiral angle calculation
          const angle = (r * 0.02) + p.random(-0.4, 0.4);
          particles.push(new Particle(r, angle, 'home', p.random(1.2, 3.2)));
        }

        // Away team spiral arm (counter-clockwise swirl)
        const awayCount = 180;
        for (let i = 0; i < awayCount; i++) {
          const r = p.random(20, 280);
          // Counter-spiral offset (e.g. rotated 180 deg)
          const angle = (r * 0.02) + p.PI + p.random(-0.4, 0.4);
          particles.push(new Particle(r, angle, 'away', p.random(1.2, 3.2)));
        }

        // Ambient dark matter / star dust (neutral field)
        const neutralCount = 120;
        for (let i = 0; i < neutralCount; i++) {
          const r = p.random(5, 350);
          const angle = p.random(p.TWO_PI);
          particles.push(new Particle(r, angle, 'neutral', p.random(0.8, 2.0)));
        }
      };

      // Handle custom match events
      const triggerVisualEvent = (event: MatchEvent) => {
        const teamColor = event.team === 'home' 
          ? homeColor 
          : event.team === 'away' 
            ? awayColor 
            : neutralColor;

        const minutesPercent = p.constrain(event.minute / 90, 0, 1.3);
        const radius = p.map(minutesPercent, 0, 1, 30, 260);
        // Angle depends on team side and minute
        const angle = event.team === 'away' ? (minutesPercent * 1.5) + p.PI : minutesPercent * 1.5;

        // Notify client
        if (onEventTriggered) {
          onEventTriggered(event);
        }

        if (event.type === 'GOAL') {
          // 1. Create a huge shockwave
          const wave = new Shockwave('GOAL', teamColor);
          wave.x = 0;
          wave.y = 0;
          shockwaves.push(wave);

          // 2. Spawn temporary explosion particles with velocities
          const burstColor = event.team === 'home' ? homeColor : awayColor;
          const burstCount = 120;
          for (let i = 0; i < burstCount; i++) {
            const tempPart = new Particle(radius, angle + p.random(-0.5, 0.5), event.team, p.random(2, 5));
            const speedMag = p.random(3.5, 8.5);
            const burstAngle = p.random(p.TWO_PI);
            
            tempPart.applyPush(p.cos(burstAngle) * speedMag, p.sin(burstAngle) * speedMag);
            tempPart.alpha = 255;
            tempPart.maxTrailLength = 15;
            particles.push(tempPart);
          }

          // 3. Anchor a permanent gorgeous Legacy Star
          const teamName = event.team === 'home' 
            ? (stateRef.current.matchData?.homeTeam.name || 'Home') 
            : (stateRef.current.matchData?.awayTeam.name || 'Away');
          
          legacyStars.push(new LegacyStar(radius, angle, burstColor, event.player || 'Goal Scored', event.minute, teamName, 'GOAL'));
        } 
        
        else if (event.type === 'YELLOW_CARD') {
          const wave = new Shockwave('YELLOW', p.color(245, 158, 11)); // Amber
          wave.x = p.cos(angle) * radius;
          wave.y = p.sin(angle) * radius;
          shockwaves.push(wave);

          // Spawn a small spray of amber sparks
          for (let i = 0; i < 30; i++) {
            const pX = p.cos(angle) * radius;
            const pY = p.sin(angle) * radius;
            const spark = new Particle(radius + p.random(-20, 20), angle + p.random(-0.2, 0.2), 'neutral', p.random(1, 2.5));
            spark.color = p.color(253, 224, 71); // amber sparks
            spark.alpha = 240;
            const sparkAngle = p.random(p.TWO_PI);
            const sparkSpeed = p.random(1.5, 3.5);
            spark.applyPush(p.cos(sparkAngle) * sparkSpeed, p.sin(sparkAngle) * sparkSpeed);
            particles.push(spark);
          }
        } 
        
        else if (event.type === 'RED_CARD') {
          const wave = new Shockwave('RED', p.color(220, 38, 38)); // Blood Red
          wave.x = p.cos(angle) * radius;
          wave.y = p.sin(angle) * radius;
          shockwaves.push(wave);

          // Void creation sparks
          for (let i = 0; i < 50; i++) {
            const spark = new Particle(radius, angle + p.random(-0.3, 0.3), 'neutral', p.random(2, 4));
            spark.color = p.color(239, 68, 68);
            const sparkAngle = p.random(p.TWO_PI);
            const sparkSpeed = p.random(3.0, 6.0);
            spark.applyPush(p.cos(sparkAngle) * sparkSpeed, p.sin(sparkAngle) * sparkSpeed);
            particles.push(spark);
          }

          // Anchor a "Void Star"
          const teamName = event.team === 'home' 
            ? (stateRef.current.matchData?.homeTeam.name || 'Home') 
            : (stateRef.current.matchData?.awayTeam.name || 'Away');
          
          legacyStars.push(new LegacyStar(radius, angle, p.color(220, 38, 38), event.player || 'Sent Off', event.minute, teamName, 'RED_CARD_VOID'));
        } 
        
        else if (event.type === 'SUBSTITUTION') {
          const subColor = p.color(16, 185, 129); // Green ripple
          const wave = new Shockwave('SUB', subColor);
          wave.x = p.cos(angle) * radius;
          wave.y = p.sin(angle) * radius;
          shockwaves.push(wave);

          // Trigger transmutation particle flow: green/cyan spark swirl
          for (let i = 0; i < 15; i++) {
            const spark = new Particle(radius, angle, 'neutral', p.random(1.5, 3.0));
            spark.color = p.color(52, 211, 153);
            const sparkAngle = angle + p.PI + p.random(-0.5, 0.5); // shoot out outwards
            const sparkSpeed = p.random(1.0, 2.5);
            spark.applyPush(p.cos(sparkAngle) * sparkSpeed, p.sin(sparkAngle) * sparkSpeed);
            particles.push(spark);
          }
        }
      };

      // Watch timeline events as currentTime updates in real-time
      const checkAndProcessTimeline = () => {
        const data = stateRef.current.matchData;
        if (!data || !data.timeline) return;

        const currentMin = stateRef.current.currentTime;
        const lastProcessed = stateRef.current.lastMinuteProcessed;

        if (currentMin === 0) {
          // Clear legacy stars and reset
          if (legacyStars.length > 0) legacyStars = [];
          stateRef.current.lastMinuteProcessed = 0;
          return;
        }

        // Find events that fell in the window between last processed and current time
        const eventsToProcess = data.timeline.filter(
          (ev) => ev.minute > lastProcessed && ev.minute <= currentMin
        );

        if (eventsToProcess.length > 0) {
          eventsToProcess.forEach((ev) => {
            triggerVisualEvent(ev);
          });
        }

        stateRef.current.lastMinuteProcessed = currentMin;
      };

      // Rendering draw loop
      p.draw = () => {
        // Deep space void render with micro trails
        p.background(8, 8, 12, 40); // Leaves a trailing glow behind particles
        
        // Dynamic center coordinates
        p.translate(p.width / 2, p.height / 2);

        // Zoom/scale based on galaxy bounds
        p.scale(zoom);

        // Additive blending for gorgeous glowing gas/particle structures
        p.blendMode(p.ADD);

        // Process physics timeline
        checkAndProcessTimeline();

        // 1. Draw central black hole core
        drawCentralHole();

        // 2. Draw shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
          const wave = shockwaves[i];
          wave.update();
          wave.draw();
          if (wave.isDead()) {
            shockwaves.splice(i, 1);
          }
        }

        // 3. Draw ambient space dust particles
        // Draw constellation lines if crystallized!
        if (stateRef.current.crystallized) {
          drawCrystallizedNetwork();
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const part = particles[i];
          part.updatePosition();
          part.draw();
          
          // Delete extra particles that spawned from explosions once faded
          if (part.alpha < 10) {
            particles.splice(i, 1);
          }
        }

        // 4. Draw Legacy stars (Goals & Red Cards)
        for (let star of legacyStars) {
          star.updatePosition();
          star.draw();
        }

        // Revert blend mode for standard UI or tooltips if needed
        p.blendMode(p.BLEND);

        // Slow camera rotation
        angleOffset += 0.001;

        // Check for hover events on legacy stars to report back to React
        checkMouseHover();
      };

      const drawCentralHole = () => {
        // Core gravity center
        const coreSize = 25 + p.sin(p.frameCount * 0.05) * 4;
        
        // Radial glow ring
        p.noStroke();
        p.fill(255, 255, 255, 10);
        p.ellipse(0, 0, coreSize * 1.8, coreSize * 1.8);
        
        p.fill(p.red(homeColor), p.green(homeColor), p.blue(homeColor), 20);
        p.ellipse(0, 0, coreSize * 1.4, coreSize * 1.4);

        p.fill(p.red(awayColor), p.green(awayColor), p.blue(awayColor), 20);
        p.ellipse(0, 0, coreSize * 1.2, coreSize * 1.2);

        // Event Horizon (Deep black hole)
        p.fill(6, 6, 8, 255);
        p.ellipse(0, 0, coreSize, coreSize);
        p.stroke(255, 255, 255, 80);
        p.strokeWeight(1);
        p.noFill();
        p.ellipse(0, 0, coreSize, coreSize);
      };

      // Crystallized structure (Constellation lines connect closest stars)
      const drawCrystallizedNetwork = () => {
        p.strokeWeight(0.5);
        // We only connect a subset of particles to maintain readable visual beauty
        const maxConnections = 120;
        let connectionsMade = 0;

        for (let i = 0; i < particles.length; i += 3) {
          if (connectionsMade >= maxConnections) break;
          const p1 = particles[i];
          if (p1.team === 'neutral') continue;

          // Find closest neighbor
          let minDist = 45;
          let neighbor: Particle | null = null;

          for (let j = i + 1; j < particles.length; j += 4) {
            const p2 = particles[j];
            if (p1.team !== p2.team) continue; // Only connect same-team stars to show structure
            
            const d = p.dist(p1.x, p1.y, p2.x, p2.y);
            if (d < minDist) {
              minDist = d;
              neighbor = p2;
            }
          }

          if (neighbor) {
            const alpha = p.map(minDist, 0, 45, 150, 0);
            p.stroke(p.red(p1.color), p.green(p1.color), p.blue(p1.color), alpha);
            p.line(p1.x, p1.y, neighbor.x, neighbor.y);
            connectionsMade++;
          }
        }
      };

      const checkMouseHover = () => {
        let foundHover = false;
        const mx = p.mouseX;
        const my = p.mouseY;

        for (let star of legacyStars) {
          if (star.checkHover(mx, my)) {
            setHoveredStar({
              player: star.player,
              minute: star.minute,
              teamName: star.teamName,
              type: star.type,
              x: star.x + p.width / 2,
              y: star.y + p.height / 2,
            });
            foundHover = true;
            break;
          }
        }

        if (!foundHover) {
          setHoveredStar(null);
        }
      };
    };

    // Instantiate p5
    p5InstanceRef.current = new p5(sketch);

    // Clean up
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [matchData]); // Rebuild canvas structure only when match changes

  return (
    <div className="relative w-full h-full bg-[#08080C] overflow-hidden rounded-2xl border border-white/5 shadow-2xl shadow-black/95">
      {/* Target element for p5 */}
      <div ref={containerRef} className="w-full h-full" id="p5-container" />

      {/* Floating Canvas UI Overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span>The 90-Minute Universe Engine</span>
        </div>
        
        {crystallized && (
          <div className="flex items-center gap-1.5 bg-cyan-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Galaxy Crystallized: State Frozen</span>
          </div>
        )}
      </div>

      {/* Hover tooltip for goals or cards */}
      {hoveredStar && (
        <div 
          className="absolute z-30 pointer-events-none bg-black/90 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-xl text-xs flex flex-col gap-1 text-zinc-100 min-w-[160px] animate-fade-in transition-all duration-150"
          style={{
            left: `${hoveredStar.x + 15}px`,
            top: `${hoveredStar.y - 45}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
            <span className="font-bold text-zinc-300 uppercase tracking-widest text-[9px]">
              {hoveredStar.type === 'GOAL' ? '✨ Supernova Core' : '🛑 Void Graviton'}
            </span>
            <span className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-white text-[10px]">
              {hoveredStar.minute}'
            </span>
          </div>
          <p className="font-semibold text-sm leading-tight text-white">{hoveredStar.player}</p>
          <p className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span 
              className="w-2 h-2 rounded-full inline-block" 
              style={{
                backgroundColor: hoveredStar.type === 'GOAL' 
                  ? (hoveredStar.teamName === matchData?.homeTeam.name ? matchData?.homeTeam.color : matchData?.awayTeam.color)
                  : '#EF4444'
              }}
            />
            {hoveredStar.teamName}
          </p>
        </div>
      )}

      {/* Legend Map */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-xs flex flex-col gap-2 max-w-[240px] pointer-events-auto">
        <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase font-bold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-500" /> Key Mapping Schema
        </h4>
        <div className="flex flex-col gap-1.5 text-zinc-300 font-mono text-[10.5px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </span>
            <span>Goals → Supernova Explosion</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full border border-amber-500 bg-amber-500/10" />
            </span>
            <span>Yellow Card → Amber Ripple</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full border border-red-600 bg-black" />
            </span>
            <span>Red Card → Void Collapse</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            <span>Substitution → Transmutation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
