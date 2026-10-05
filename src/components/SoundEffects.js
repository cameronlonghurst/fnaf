// Sound manager with Web Audio API fallbacks and authentic sound effects
import AmbienceSound from "../media/Sounds/Ambience.mp3";
import MainAmbienceSound from "../media/Sounds/MainAmbience.mp3";
import CameraIdleSound from "../media/Sounds/CameraIdle 2.mp3";
import ClockSound from "../media/Sounds/Clock.mp3";
import DeadSound from "../media/Sounds/Dead.mp3";
import DoorSound from "../media/Sounds/Door.mp3";
import FreddyLaugh1Sound from "../media/Sounds/FreddyLaugh1.mp3";
import FreddyLaugh2Sound from "../media/Sounds/FreddyLaugh2.mp3";
import FreddyLaugh3Sound from "../media/Sounds/FreddyLaugh3.mp3";
import Blip3Sound from "../media/Sounds/blip3.mp3";
import Garble1Sound from "../media/Sounds/garble1.mp3";
import Garble2Sound from "../media/Sounds/garble2.mp3";
import GoldenFreddySound from "../media/Sounds/golden_freddy.ogg";
import JumpscareSound from "../media/Sounds/jumpscare.mp3";
import Knock2Sound from "../media/Sounds/knock2.mp3";
import MusicBoxSound from "../media/Sounds/music box.mp3";
import PowerdownSound from "../media/Sounds/powerdown.mp3";
import Powerdown2Sound from "../media/Sounds/powerdown2.mp3";
import PutDownSound from "../media/Sounds/put down.mp3";
import WindowscareSound from "../media/Sounds/windowscare.mp3";

class SoundManager {
  constructor() {
    this.mainAmbience = new Audio(MainAmbienceSound);
    this.mainAmbience.loop = true;
    this.mainAmbience.volume = 0.55;

    this.musicBox = new Audio(MusicBoxSound);
    this.musicBox.loop = true;
    this.musicBox.volume = 0.65;

    this.titleAmbience = new Audio(AmbienceSound);
    this.titleAmbience.loop = true;
    this.titleAmbience.volume = 0.5;

    this.kitchenAudio = null;
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  playSafe(audio, volume = 1.0) {
    try {
      audio.currentTime = 0;
      audio.volume = volume;
      const promise = audio.play();
      if (promise && promise.catch) {
        promise.catch(() => {});
      }
    } catch (e) {}
  }

  playTitleAmbience() {
    this.playSafe(this.titleAmbience, 0.45);
  }

  stopTitleAmbience() {
    try {
      this.titleAmbience.pause();
    } catch (e) {}
  }

  playOfficeAmbience() {
    this.playSafe(this.mainAmbience, 0.55);
  }

  stopOfficeAmbience() {
    try {
      this.mainAmbience.pause();
    } catch (e) {}
  }

  playDoor() {
    const snd = new Audio(DoorSound);
    this.playSafe(snd, 0.7);
  }

  playLight() {
    const snd = new Audio(WindowscareSound);
    this.playSafe(snd, 0.65);
  }

  playWindowScare() {
    const snd = new Audio(WindowscareSound);
    this.playSafe(snd, 0.9);
  }

  playCameraToggle() {
    const snd = new Audio(PutDownSound);
    this.playSafe(snd, 0.6);
  }

  playCameraSwitch() {
    const snd = new Audio(Blip3Sound);
    this.playSafe(snd, 0.5);
  }

  playCameraGarble() {
    const isFirst = Math.random() < 0.5;
    const snd = new Audio(isFirst ? Garble1Sound : Garble2Sound);
    this.playSafe(snd, 0.6);
  }

  playFreddyLaugh(num = null) {
    const laughs = [FreddyLaugh1Sound, FreddyLaugh2Sound, FreddyLaugh3Sound];
    const chosen = num !== null ? laughs[num % 3] : laughs[Math.floor(Math.random() * laughs.length)];
    const snd = new Audio(chosen);
    this.playSafe(snd, 0.8);
  }

  playFoxyBang() {
    const snd = new Audio(Knock2Sound);
    this.playSafe(snd, 0.95);
  }

  playJumpscare() {
    const snd = new Audio(JumpscareSound);
    this.playSafe(snd, 1.0);
  }

  playPowerdown() {
    this.stopOfficeAmbience();
    const snd = new Audio(PowerdownSound);
    this.playSafe(snd, 0.85);
  }

  playMusicBox() {
    this.playSafe(this.musicBox, 0.7);
  }

  stopMusicBox() {
    try {
      this.musicBox.pause();
    } catch (e) {}
  }

  playClock() {
    const snd = new Audio(ClockSound);
    this.playSafe(snd, 0.8);
    // Also synthesize cheering children
    this.playCheer();
  }

  playDead() {
    const snd = new Audio(DeadSound);
    this.playSafe(snd, 0.8);
  }

  playGoldenFreddy() {
    const snd = new Audio(GoldenFreddySound);
    this.playSafe(snd, 1.0);
  }

  playButtonError() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {}
  }

  playHonk() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(530, t);
      osc2.frequency.setValueAtTime(700, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.16);
      osc2.stop(t + 0.16);
    } catch (e) {}
  }

  playKitchenClatter() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      // Metallic clang simulation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320 + Math.random() * 400, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    } catch (e) {}
  }

  playCheer() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // Noise buffer for cheering applause
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 1.5));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      filter.Q.value = 1.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  stopAll() {
    this.stopTitleAmbience();
    this.stopOfficeAmbience();
    this.stopMusicBox();
  }
}

const sounds = new SoundManager();
export default sounds;
