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

let shape; //melody
const circle = createShape();
const square = createShape();

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
let inside = false;
let lastX = null;
let lastY = null;
let lastTime = null;

let speed = 0.02; // Base rotation speed
let targetSpeed = 0.02;
// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.AMSynth(Tone.Synth).toDestination(); // can play several notes at once
// Add subtle chorus for piano string width

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  const start = Tone.now() + 0.1; // adds a slight buffer when a keynote is pressed
  //Right hand
  for (let i = 0; i < melody.length; i++) {
    let melodytime = start + i * 0.35; // creates a rhytm so there 0.4 seconds between every note
    console.log("Pointer down at", event.clientX, event.clientY);
    if (melody[i] !== null) {
      synth.triggerAttackRelease(melody[i], "4n", melodytime); // play the note for an eighth note
    }
  }
  //left hand
  for (let i = 0; i < bassMelody.length; i++) {
    // goes through the notes in the melody
    let bassMelodytime = start + i * 0.55; // creates a rhytm so there 0.8 seconds between every note
    console.log("Pointer down at", event.clientX, event.clientY);
    if (bassMelody[i] !== null) {
      synth.triggerAttackRelease(bassMelody[i], "2n", bassMelodytime);
    }
  }
}
function pointerEnter(event) {
  Tone.start();
  synth.triggerAttack("E5", "8n");
}

function pointerLeave(event) {
  synth.triggerRelease("E5");
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.

  circle.setColour(416, 100, 86);
  circle.setPosition(0.4, 0.5);
  circle.setRoundedness(1);
  circle.setSize(50);

  square.setColour((416, 100, 50));
  square.setPosition(0.5, 0.05);
  square.setRoundedness(1);
  square.setSize(500);

  shape = createShape("melody");
  shape.setColour(241, 100, 50);
  shape.setPosition(0.605, 0.31);
  shape.setSize(230);
  shape.setRoundedness(0.41);

  // Start the circle animation
  animateShape();

  // Put your event listener code here
  shape.element.addEventListener("pointerdown", pointerDown);
  if (typeof pointerUp === "function") {
    shape.element.addEventListener("pointerup", pointerUp);
  }
  //shape.element.addEventListener("pointerenter", pointerEnter);
  //shape.element.addEventListener("pointerleave", pointerLeave);
  square.element.addEventListener("pointerenter", () => {
    inside = true;
    lastX = null;
    lastY = null;
    lastTime = null;
  });

  square.element.addEventListener("pointerleave", () => {
    inside = false;
    lastX = null;
    lastY = null;
    lastTime = null;

    targetSpeed = 0.035; // Return to base speed
  });

  square.element.addEventListener("pointermove", (event) => {
    if (!inside) return;

    const now = performance.now();
    if (lastTime !== null) {
      const x = event.clientX - lastX;
      const y = event.clientY - lastY;
      const seconds = (now - lastTime) / 1000;

      if (seconds > 0) {
        const distance = Math.hypot(x, y);
        const velocity = distance / seconds;

        targetSpeed = Math.min(
          // Faster pointer movement = faster circle
          0.035 + velocity * 0.00007,
          0.35,
        );
          //if (targetSpeed* < 0.3){

         // }
      }
    }
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;
  });
}
// ---------- Circle Animation ----------

// Th)e center of the circle (relative screen position)
//const centerX = 0.6;
//const centerY = 0.35;

// Circle settings
//const radius = 100; // pixels

let angle = 0;

function animateShape() {
  speed += (targetSpeed - speed) * 0.3; // Smoothly adjust rotation speed
  // Move a little farther around the circle
  angle += speed;

  // Calculate the new position
  //const x1 = centerX + (radius * Math.cos(angle)) / window.innerWidth; //körpályán mozgás
  //const y1 = centerY + (radius * Math.sin(angle)) / window.innerHeight;

  // Move our existing shape
  if (shape) {
    //shape.setPosition(x1, y1);
    shape.element.style.rotate = `${angle}rad`;
  }

  // Keep the animation going
  requestAnimationFrame(animateShape);
}

setup(); // Always remember to call setup()!
