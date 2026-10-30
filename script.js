/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
//Right hand
const melody = [
  "F#4",
  "B4",
  "C#5",
  "D5",
  "E5",
  "D5",
  "C#5",
  "B4",
  "F#4",
  "B4",
  "C#5",
  "D5",
  "E5",
  "D5",
  "C#5",
  "D5",
  "B4",
  "G4",
  "A4",
  "B4",
  "C#5",
  "B4",
  "A4",
  "G4",
  "F#4",
  "E4",
  "D4",
  "C#4",
  "B3",
  "C#4",
  "D4",
  "E4",
  "F#4",
  "G4",
  "A4",
  "B4",
  "C#5",
  "D5",
  "E5",
  "F#5",
  "E5",
  "D5",
  "C#5",
  "B4",
  "A4",
  "G4",
]; // the note played when the pointer goes down
//left hand
const bassMelody = [
  "E3",
  "B3",
  "G3",
  "B3",
  "E3",
  "B3",
  "G3",
  "B3",
  "A2",
  "E3",
  "C#3",
  "E3",
  "A2",
  "E3",
  "C#3",
  "E3",
  "B2",
  "F#3",
  "D3",
  "F#3",
  "B2",
  "F#3",
  "D3",
  "F#3",
  "E3",
  "B3",
  "G3",
  "B3",
];
// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

const spinningshape = createShape();
const circleOctaves = createShape();
const circle = createShape();
const squareOctaves = createShape();

let inside = false;
let lastX = null;
let lastY = null;
let lastTime = null;
let angle = 0;
let speed = 0.02; // Base rotation speed
let targetSpeed = 0.02;
let speeds = [];

let currentOctave = 4;
const baseFrequency = 440;
let previousOctave = -1;

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const pitchShift = new Tone.PitchShift(0).toDestination();
const synth = new Tone.AMSynth().connect(pitchShift); // can play several notes at once

// Add subtle chorus for piano string width

function updateSound() {
  pitchShift.pitch = (currentOctave - 4) * 12;
}

function raiseFrequency() {
  currentOctave = Math.min(6, currentOctave + 1);
  updateSound();
}

function lowerFrequency() {
  currentOctave = Math.max(2, currentOctave - 1);
  updateSound();
}

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 millisecond
}

// Start the circle animation
// ---------- Circle Animation ----------
function animateShape() {
  speed += (targetSpeed - speed) * 0.3; // Smoothly adjust rotation speed
  angle += speed; // Move a little farther around the circle

  // Move our existing shape
  if (spinningshape) {
    spinningshape.element.style.rotate = `${angle}rad`;
  }
  requestAnimationFrame(animateShape); // Keep the animation going in a loop
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  const start = Tone.now() + 0.1; // adds a slight buffer when a keynote is pressed

  //Melody starts playing
  for (let i = 1; i < melody.length; i++) {
    let melodytime = start + i * 0.35; // creates a rhytm so there 0.35 seconds between every note
    console.log("Pointer down at", event.clientX, event.clientY);
    if (melody[i] !== null) {
      synth.triggerAttackRelease(melody[i], "4n", melodytime); // play the melody for
    }
  }
  //bassMelody starts playing
  for (let i = 1; i < bassMelody.length; i++) {
    // goes through the notes in the melody
    let bassMelodytime = start + i * 0.55; // creates a rhytm so there 0.55 seconds between every note
    console.log("Pointer down at", event.clientX, event.clientY);
    if (bassMelody[i] !== null) {
      synth.triggerAttackRelease(bassMelody[i], "2n", bassMelodytime);
    }
  }
}

function pointerEnter(event) {
  Tone.start();
  inside = true;
  synth.volume.value = -20; // start quiet: we haven't moved yet

  lastX = event.clientX;
  lastY = event.clientY;
  lastTime = performance.now();
}

function pointerLeave(event) {
  inside = false;
  lastX = null;
  lastY = null;
  lastTime = null;
  targetSpeed = 0.035; // Return to base speed
  synth.volume.value = -20; // start quiet: we haven't moved yet
}

function pointerMove(event) {
  if (!inside) {
    return; //  only while on the shape
  }
  const now = performance.now();
  const x = event.clientX;
  const y = event.clientY;

  if (lastX !== null && lastY !== null && lastTime !== null) {
    const dx = x - lastX;
    const dy = y - lastY;
    const seconds = (now - lastTime) / 1000;

    if (seconds > 0) {
      const distance = Math.hypot(dx, dy);
      const velocity = distance / seconds;

      //Adjust rotation speed based on pointer movement
      targetSpeed = Math.min(0.035 + velocity * 0.00007, 0.35);

      //Adjust volume based on pointer movement
      let volume = -20 + velocity * 0.01;
      volume = Math.max(-20, Math.min(0, volume));
      synth.volume.rampTo(volume, 0.1);
    }
  }
  lastX = x;
  lastY = y;
  lastTime = now;
}

function pointerMoveOctaves(event) {
  const rect = squareOctaves.element.getBoundingClientRect();

  // Ignore pointer positions outside the octave control
  const position = Math.max(
    0,
    Math.min(1, 1 - (event.clientY - rect.top) / rect.height),
  );

  // Map pointer position to octave levels 2–6
  const octave = 2 + Math.floor(position * 5);

  if (previousOctave === -1) {
    // Initialise the control the first time
    currentOctave = octave;
    previousOctave = octave;
    updateSound();
    return;
  }

  if (octave > previousOctave) {
    // Pointer moved to a higher octave
    while (currentOctave < octave) {
      raiseFrequency();
    }
  } else if (octave < previousOctave) {
    // Pointer moved to a lower octave
    while (currentOctave > octave) {
      lowerFrequency();
    }
  }

  previousOctave = octave;

  console.log("Octave:", currentOctave);
}

function pointerMoveShowingWhereInOctave(event) {
  const rect = squareOctaves.element.getBoundingClientRect();

  let circleY = (event.clientY - rect.top) / rect.height;

  circleY = Math.max(0.15, Math.min(0.89, circleY));

  circleOctaves.setPosition(0.185, circleY);
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.

  circleOctaves.setColour(0, 0, 83);
  circleOctaves.setPosition(0.185, 0.5);
  circleOctaves.setRoundedness(1);
  circleOctaves.setSize(30, 10);
  circleOctaves.element.style.zIndex = "4";

  circle.setColour(0, 0, 8);
  circle.setPosition(0.5, 0.05);
  circle.setRoundedness(0.5);
  circle.setSize(500);
  circle.element.style.zIndex = "1";

  squareOctaves.setColour(0, 0, 8);
  squareOctaves.setPosition(0.15, 0.15);
  squareOctaves.setRoundedness(0.2);
  squareOctaves.setSize(100, 400);
  squareOctaves.element.style.zIndex = "3";

  spinningshape.setColour(0, 0, 83);
  spinningshape.setPosition(0.64, 0.33);
  spinningshape.setSize(210);
  spinningshape.setRoundedness(0.41);
  spinningshape.element.style.zIndex = "2";

  // Put your event listener code here
  spinningshape.element.addEventListener("pointerdown", pointerDown);
  circle.element.addEventListener("pointerenter", pointerEnter);
  circle.element.addEventListener("pointerleave", pointerLeave);
  circle.element.addEventListener("pointermove", pointerMove);
  squareOctaves.element.addEventListener("pointermove", pointerMoveOctaves);
  squareOctaves.element.addEventListener(
    "pointermove",
    pointerMoveShowingWhereInOctave,
  );

  animateShape();
}

setup(); // Always remember to call setup()!
