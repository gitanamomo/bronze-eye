'use strict';
// A local companion actor. Position uses paw coordinates in the game's 1600×900 world.
// Following samples the player's route rather than chasing the player's current centre.
(() => {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const damp = (v, to, rate, dt) => v + (to - v) * (1 - Math.exp(-rate * dt));
  const sheets = { idle: 'assets/companion/idle.webp', walk: 'assets/companion/walk.webp' };
  const ready = Object.values(sheets).map(src => { const image = new Image(); image.src = src; return image; });
  const standDown = [0, 1, 2, 3];
  const lieDown = [4, 5, 6, 7, 8, 9, 10, 11];

  class BronzeCompanion {
    constructor({ world, player, onPat, onRequestPat, onGuardChange, onScentReached }) {
      this.player = player;
      this.onPat = onPat;
      this.onRequestPat = onRequestPat;
      this.onGuardChange = onGuardChange;
      this.onScentReached = onScentReached;
      this.el = document.createElement('button');
      this.el.type = 'button';
      this.el.id = 'companion';
      this.el.setAttribute('aria-label', '摸摸穿粉色胸背的法斗伙伴');
      this.el.title = '点击走近摸摸 · P 轻声呼唤';
      this.el.innerHTML = '<span class="pet-shadow"></span><span class="pet-motion"><span class="pet-sprite"></span><span class="pet-ghost"></span></span><span class="pet-reaction" aria-hidden="true">♡</span>';
      world.insertBefore(this.el, world.querySelector('.foreground'));
      this.sprite = this.el.querySelector('.pet-sprite');
      this.ghost = this.el.querySelector('.pet-ghost');
      this.motion = this.el.querySelector('.pet-motion');
      this.shadow = this.el.querySelector('.pet-shadow');
      this.reaction = this.el.querySelector('.pet-reaction');
      this.el.onclick = e => {
        e.stopPropagation();
        if (this.onRequestPat) this.onRequestPat();
        else this.pat();
      };
      this.scene = -1;
      this.sheet = '';
      this.frame = -1;
      this.facing = 1;
      this.lastPlayer = null;
      this.reset(0, { x: 675, y: 755, facing: 1 });
    }

    reset(scene, leader) {
      this.scene = scene;
      this.x = clamp(leader.x - 145 * leader.facing, 250, 1350);
      this.y = clamp(leader.y + 23, 705, 814);
      this.vx = this.vy = 0;
      this.facing = leader.facing || 1;
      this.trail = [{ x: this.x, y: this.y - 23 }, { x: leader.x, y: leader.y }];
      this.lastPlayer = { x: leader.x, y: leader.y };
      this.idleFor = 0;
      this.playerStill = 0;
      this.walkPhase = 0;
      this.age = 0;
      this.reactionFor = 0;
      this.attentionFor = 0;
      this.recallFor = 0;
      this.sniffFor = 0;
      this.sniffCooldown = 5;
      this.greetCooldown = 0;
      this.nuzzleFor = 0;
      this.ghostFor = 0;
      this.wakeFor = 0;
      this.guardTarget = null;
      this.guardSettled = false;
      this.scentTarget = null;
      this.scentReached = false;
      this.vignette = null;
      this.trailGoal = { x: this.x, y: this.y };
      this.drawFrame('idle', 0, 1, true);
      this.paint(0, 'look');
      if (this.onGuardChange) this.onGuardChange(false);
    }

    syncScene(scene, leader) {
      if (scene !== this.scene) this.reset(scene, leader);
    }

    guardPad(pad) {
      if (!pad) return;
      if (this.idleFor > 7) this.wakeFor = .56;
      this.guardTarget = { x: clamp(pad.x, 250, 1350), y: clamp(pad.y, 705, 814) };
      this.guardSettled = false;
      this.scentTarget = null;
      this.scentReached = false;
      this.recallFor = 0;
      this.sniffFor = 0;
      this.idleFor = 0;
      this.attentionFor = 2.4;
      this.reactionFor = 2.0;
      this.reaction.textContent = '🐾';
    }

    releaseGuard(quiet = false) {
      const wasGuarding = Boolean(this.guardTarget || this.guardSettled);
      this.guardTarget = null;
      this.guardSettled = false;
      if (wasGuarding && this.onGuardChange) this.onGuardChange(false);
      if (wasGuarding && !quiet) {
        this.recallFor = 3.5;
        this.attentionFor = 1.8;
        this.reactionFor = 1.6;
        this.reaction.textContent = '♪';
      }
    }

    isGuarding() {
      return Boolean(this.guardTarget && this.guardSettled);
    }

    trackScent(spot) {
      if (!spot) return;
      this.releaseGuard(true);
      const tx = clamp(spot.x - 42, 250, 1350), ty = clamp(spot.y + 8, 705, 814);
      if (this.scentTarget && Math.hypot(this.scentTarget.x - tx, this.scentTarget.y - ty) < 8) return;
      if (this.idleFor > 7) this.wakeFor = .56;
      this.scentTarget = { x: tx, y: ty };
      this.scentReached = false;
      this.sniffFor = 0;
      this.idleFor = 0;
      this.attentionFor = 2.2;
      this.reactionFor = 2.2;
      this.reaction.textContent = '✦';
    }

    clearScent() {
      this.scentTarget = null;
      this.scentReached = false;
    }

    call(hintX = null) {
      this.releaseGuard(true);
      this.clearScent();
      if (this.idleFor > 7) this.wakeFor = .56;
      this.recallFor = 5;
      this.attentionFor = 1.8;
      this.reactionFor = 1.6;
      this.reaction.textContent = '♪';
      if (Number.isFinite(hintX) && Math.abs(hintX - this.x) > 12) this.facing = hintX < this.x ? -1 : 1;
      else if (this.lastPlayer && Math.abs(this.lastPlayer.x - this.x) > 6) this.facing = this.lastPlayer.x < this.x ? -1 : 1;
      this.idleFor = 0;
      this.sniffFor = 0;
    }

    prepareGreet(leader) {
      if (this.hidden) return;
      this.releaseGuard(true);
      if (this.idleFor > 7) this.wakeFor = .56;
      this.recallFor = 3.2;
      this.attentionFor = 2.6;
      this.reactionFor = 1.4;
      this.reaction.textContent = '♪';
      const px = leader?.x ?? this.lastPlayer?.x ?? this.x;
      if (Math.abs(px - this.x) > 6) this.facing = px < this.x ? -1 : 1;
      this.idleFor = 0;
      this.sniffFor = 0;
    }

    pat(leader) {
      if (this.hidden || this.greetCooldown > 0) return false;
      this.releaseGuard(true);
      if (this.idleFor > 7) this.wakeFor = .56;
      this.greetCooldown = 1.2;
      this.attentionFor = 3.2;
      this.reactionFor = 2.1;
      this.nuzzleFor = .85;
      this.reaction.textContent = '♡';
      const px = leader?.x ?? this.lastPlayer?.x ?? this.x;
      if (Math.abs(px - this.x) > 6) this.facing = px < this.x ? -1 : 1;
      this.idleFor = 0;
      this.sniffFor = 0;
      if (this.onPat) this.onPat();
      return true;
    }

    react(kind = 'curious') {
      if (this.idleFor > 7) this.wakeFor = .56;
      this.attentionFor = kind === 'wonder' ? 4 : 2;
      this.reactionFor = kind === 'happy' ? 2 : 1.7;
      this.reaction.textContent = kind === 'happy' ? '♡' : '✦';
      if (this.lastPlayer && Math.abs(this.lastPlayer.x - this.x) > 6) this.facing = this.lastPlayer.x < this.x ? -1 : 1;
      this.idleFor = Math.min(this.idleFor, 1);
      this.sniffFor = 0;
    }

    playVignette(kind, spot) {
      if (!spot || this.guardTarget) return;
      if (this.idleFor > 7) this.wakeFor = .56;
      const total = kind === 'water-mirror' ? 3.2 : kind === 'brave-guard' ? 3.0 : 2.6;
      this.vignette = {
        kind,
        x: clamp(spot.x, 250, 1350),
        y: clamp(spot.y, 705, 814),
        timer: total,
        total,
        startled: false
      };
      this.idleFor = 0;
      this.sniffFor = 0;
      this.attentionFor = total;
      this.reactionFor = total * .85;
      this.reaction.textContent = kind === 'brave-guard' ? '🐾' : kind === 'water-mirror' ? '✦' : '♪';
    }

    routeGoal() {
      let remaining = this.recallFor > 0 ? 63 : 95;
      for (let i = this.trail.length - 1; i > 0; i--) {
        const a = this.trail[i], b = this.trail[i - 1];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance >= remaining && distance > .01) {
          const t = remaining / distance;
          return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t + 23 };
        }
        remaining -= distance;
      }
      return { x: this.trail[0].x, y: this.trail[0].y + 23 };
    }

    drawFrame(sheet, frame, facing, snap = false) {
      frame = clamp(Math.floor(frame), 0, 11);
      if (this.sheet === sheet && this.frame === frame && this.artFacing === facing) return;
      if (!snap && this.sheet && (this.sheet !== sheet || this.artFacing !== facing)) {
        this.ghost.style.backgroundImage = this.sprite.style.backgroundImage;
        this.ghost.style.backgroundPosition = this.sprite.style.backgroundPosition;
        this.ghost.style.transform = this.sprite.style.transform;
        this.ghostFor = .13;
      }
      this.sheet = sheet;
      this.frame = frame;
      this.artFacing = facing;
      this.sprite.style.backgroundImage = `url("${sheets[sheet]}")`;
      this.sprite.style.backgroundPosition = `${(frame % 4) * 100 / 3}% ${Math.floor(frame / 4) * 50}%`;
      this.sprite.style.transform = `scaleX(${facing})`;
      this.el.dataset.frame = String(frame);
      this.el.dataset.sheet = sheet;
    }

    idleFrame() {
      const t = this.idleFor;
      if (this.attentionFor > 0) return t < .2 ? 1 : 2;
      if (t < 1.25) return standDown[Math.min(3, Math.floor(t / .32))];
      if (t < 7) return 3;
      if (t < 9) return lieDown[Math.min(7, Math.floor((t - 7) / .25))];
      // Sleeping has actual closed-eye frames; a brief half-wake at long intervals.
      return t % 13 > 12.4 ? 9 : Math.sin(t * .7) > 0 ? 10 : 11;
    }

    update(dt, time, leader) {
      dt = Math.min(dt, .05);
      this.hidden = leader.mode === 'menu' || leader.mode === 'transition';
      this.el.hidden = this.hidden;
      if (this.hidden || leader.mode === 'pause' || document.hidden || dt <= 0) return;
      this.age += dt;
      for (const key of ['reactionFor', 'attentionFor', 'recallFor', 'greetCooldown', 'sniffCooldown', 'nuzzleFor', 'ghostFor', 'wakeFor']) this[key] = Math.max(0, this[key] - dt);
      const playerTravel = Math.hypot(leader.x - this.lastPlayer.x, leader.y - this.lastPlayer.y);
      const leaderMoving = playerTravel > .1;
      if ((leaderMoving || this.recallFor > 0 || this.attentionFor > 0) && this.idleFor > 7 && this.wakeFor <= 0) { this.wakeFor = .56; this.idleFor = 0; }
      this.playerStill = leaderMoving ? 0 : this.playerStill + dt;
      if (leaderMoving) {
        const end = this.trail[this.trail.length - 1];
        if (Math.hypot(leader.x - end.x, leader.y - end.y) >= 5) {
          this.trail.push({ x: leader.x, y: leader.y });
          if (this.trail.length > 240) this.trail.shift();
        }
      }
      this.lastPlayer = { x: leader.x, y: leader.y };
      this.trailGoal = this.routeGoal();
      if (this.vignette) {
        this.vignette.timer -= dt;
        if (this.vignette.timer <= 0 || leader.mode !== 'play' || (leaderMoving && this.vignette.timer < this.vignette.total - .45)) {
          this.vignette = null;
        }
      }
      let goal = { ...this.trailGoal };
      if (this.guardTarget) {
        goal = { ...this.guardTarget };
        this.sniffFor = 0;
      } else if (this.scentTarget) {
        goal = { ...this.scentTarget };
        this.sniffFor = 0;
      } else if (this.vignette) {
        goal = { x: this.vignette.x, y: this.vignette.y };
        if (this.vignette.kind === 'water-mirror' && this.vignette.timer < 1.35) {
          goal.x += (this.x < leader.x ? 26 : -26);
        }
        this.sniffFor = 0;
      } else {
        // Sniffing is a short independent excursion, cancelled as soon as the player moves or opens a modal.
        if (leaderMoving || leader.mode !== 'play' || this.recallFor > 0 || this.attentionFor > 0) this.sniffFor = 0;
        if (!leaderMoving && leader.mode === 'play' && this.playerStill > 2.1 && this.playerStill < 6 && this.sniffCooldown <= 0 && this.idleFor > 1.3 && this.attentionFor <= 0) {
          this.sniffFor = 2.2;
          this.sniffCooldown = 16;
          this.sniffDirection = this.x < leader.x ? -1 : 1;
        }
        if (this.sniffFor > 0) {
          this.sniffFor = Math.max(0, this.sniffFor - dt);
          goal.x += this.sniffDirection * 24;
          goal.y += 4;
        }
      }
      goal.x = clamp(goal.x, 250, 1350);
      goal.y = clamp(goal.y, 705, 814);
      const gx = goal.x - this.x, gy = goal.y - this.y;
      const distance = Math.hypot(gx, gy);
      const leaderDistance = Math.hypot(leader.x - this.x, leader.y - this.y);
      const run = leaderDistance > 245 || this.recallFor > 0 || Boolean(this.guardTarget || this.scentTarget || this.vignette);
      let maxSpeed = this.sniffFor > 0 ? 32 : run ? 330 : 235;
      // Eased acceleration and braking; stand still in a small dead zone instead of jittering.
      let wanted = distance > 7 ? Math.min(maxSpeed, Math.sqrt(2 * 470 * (distance - 7))) : 0;
      if (leader.mode === 'ending' || this.wakeFor > 0) wanted = 0;
      const tx = distance > .01 ? gx / distance * wanted : 0;
      const ty = distance > .01 ? gy / distance * wanted : 0;
      this.vx = damp(this.vx, tx, 7, dt);
      this.vy = damp(this.vy, ty, 7, dt);
      if (distance < 8 && Math.hypot(this.vx, this.vy) < 12) this.vx = this.vy = 0;
      const oldX = this.x, oldY = this.y;
      this.x = clamp(this.x + this.vx * dt, 250, 1350);
      this.y = clamp(this.y + this.vy * dt, 705, 814);
      const actualTravel = Math.hypot(this.x - oldX, this.y - oldY);
      const speed = actualTravel / Math.max(dt, .001);
      const moving = speed > 8;
      if (this.guardTarget) {
        const nowSettled = !moving && distance < 12;
        if (nowSettled !== this.guardSettled) {
          this.guardSettled = nowSettled;
          if (this.onGuardChange) this.onGuardChange(nowSettled);
        }
      }
      if (this.scentTarget && !moving && distance < 14 && !this.scentReached) {
        this.scentReached = true;
        this.reactionFor = 2.6;
        this.reaction.textContent = '✦';
        if (this.onScentReached) this.onScentReached();
      }
      let behavior;
      if (this.wakeFor > 0) {
        const wakeFrames = [11, 9, 7, 5, 3, 1, 0];
        this.drawFrame('idle', wakeFrames[Math.min(6, Math.floor((.56 - this.wakeFor) / .08))], 1);
        behavior = 'wake';
      } else if (moving) {
        this.idleFor = 0;
        // Foot cycle progresses with distance travelled, not a fixed animation speed.
        this.walkPhase += actualTravel / (run ? 115 : 92) * 12;
        if (Math.abs(this.vx) > 13) this.facing = this.vx < 0 ? -1 : 1;
        this.drawFrame('walk', Math.floor(this.walkPhase) % 12, this.facing);
        behavior = this.guardTarget ? 'guard-move' : this.scentTarget ? 'scent-track' : this.vignette ? `vignette-${this.vignette.kind}` : this.sniffFor > 0 ? 'sniff' : run ? 'catch-up' : 'follow';
      } else if (this.guardSettled) {
        this.idleFor += dt;
        if (Math.abs(leader.x - this.x) > 8) this.facing = leader.x < this.x ? -1 : 1;
        this.drawFrame('idle', this.idleFor < .4 ? 2 : 3, this.facing);
        behavior = 'guard';
      } else if (this.scentTarget && this.scentReached) {
        this.idleFor += dt;
        if (Math.abs(leader.x - this.x) > 8) this.facing = leader.x < this.x ? -1 : 1;
        this.drawFrame('idle', Math.sin(this.age * 4.2) > 0 ? 5 : 6, this.facing);
        behavior = 'scent';
      } else if (this.vignette) {
        this.idleFor += dt;
        const vKind = this.vignette.kind;
        const vFrame = vKind === 'water-mirror' ? (this.vignette.timer > 1.35 ? 5 : 1) : vKind === 'brave-guard' ? 1 : 2;
        this.drawFrame('idle', vFrame, this.facing);
        behavior = `vignette-${vKind}`;
      } else if (this.sniffFor > .2) {
        this.drawFrame('idle', Math.sin(this.age * 4) > 0 ? 5 : 6, 1);
        behavior = 'sniff';
      } else {
        this.idleFor += dt;
        const idleArtFacing = this.attentionFor > 0 ? this.facing : 1;
        this.drawFrame('idle', this.idleFrame(), idleArtFacing);
        behavior = this.attentionFor > 0 ? 'look' : this.idleFor > 9 ? 'sleep' : this.idleFor > 7 ? 'lie-down' : this.idleFor > 1.25 ? 'sit' : 'settle';
      }
      this.paint(time, behavior, speed);
    }

    paint(time, behavior, speed = 0) {
      const depth = .81 + (this.y - 690) / 700;
      this.el.style.left = `${this.x - 84}px`;
      this.el.style.top = `${this.y - 132.125}px`;
      this.el.style.transform = `scale(${depth})`;
      const isFront = this.y >= parseFloat(this.player.style.top || 0) + 305;
      this.el.style.zIndex = isFront ? 7 : 5;
      this.player.style.zIndex = isFront ? 5 : 7;
      const vignetteHop = this.vignette && ((this.vignette.kind === 'water-mirror' && this.vignette.timer < 1.35 && this.vignette.timer > .95) || (this.vignette.kind === 'brave-guard' && Math.sin(time * .018) > .4)) ? -3.8 : 0;
      const nuzzleLift = (this.nuzzleFor > 0 ? Math.sin(time * .014) * -1.4 : 0) + vignetteHop;
      const breath = (this.sheet === 'idle' ? Math.sin(time * (behavior === 'sleep' ? .0014 : .0024)) * .5 : Math.sin(this.walkPhase * Math.PI / 3) * .45) + nuzzleLift;
      const tilt = this.nuzzleFor > 0 ? Math.sin(time * .015) * 2.4 : this.attentionFor > 0 ? Math.sin(time * .003) * 1.2 : 0;
      // Very small secondary motion; the supplied limb frames carry the actual walking.
      this.motion.style.transform = `translateY(${breath}px) rotate(${tilt}deg)`;
      this.shadow.style.width = `${this.sheet === 'walk' ? 103 : behavior === 'sleep' ? 96 : 64}px`;
      this.shadow.style.opacity = behavior === 'sleep' ? '.30' : '.37';
      this.reaction.style.opacity = this.reactionFor > 0 ? String(Math.min(1, this.reactionFor * 2)) : '0';
      this.reaction.style.transform = `translateY(${-8 - (2 - Math.min(2, this.reactionFor)) * 9}px)`;
      this.ghost.style.opacity = String(clamp(this.ghostFor / .13, 0, 1));
      this.el.dataset.behavior = behavior;
      this.el.dataset.speed = speed.toFixed(1);
      this.el.dataset.facing = String(this.facing);
      this.el.dataset.x = this.x.toFixed(1);
      this.el.dataset.y = this.y.toFixed(1);
    }

    snapshot() {
      return { x: this.x, y: this.y, vx: this.vx, vy: this.vy, behavior: this.el.dataset.behavior, sheet: this.sheet, frame: this.frame, scene: this.scene, trailLength: this.trail.length, guarding: Boolean(this.guardSettled), scentTracking: Boolean(this.scentTarget), scentReached: Boolean(this.scentReached), vignette: this.vignette ? this.vignette.kind : null };
    }
  }
  window.BronzeCompanion = BronzeCompanion;
})();
