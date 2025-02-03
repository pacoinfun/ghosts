I want to create a mini-game for Telegram using Cursor AI. The game concept is inspired by a classic vertical scrolling game where the player collects or avoids various items. Please provide step-by-step guidance for creating this game, including the following features and mechanics:

Gameplay Details
The player controls a cursor or object at the bottom of the screen.
Game items continuously fall from the top to the bottom of the screen.
The player needs to collect ghost PNGs (green elements in the reference image) to earn points.
Additional game elements:
Ghost Catcher Net: When the player collects this, the screen freezes for 5 seconds, making it easier to collect points.
Bombs: When the player clicks or hits a bomb PNG, they lose 10 points.
The game lasts for 30 seconds, during which the player should earn as many points as possible.
Game UI
Include a scoreboard in the top right corner.
Show a visible countdown timer in the top left corner.
Smooth animations for falling items and freeze effects.
Technical Features
Use Cursor AI and the Telegram Mini App framework for development.
Create separate classes for:
Item spawning logic
Collision detection (player vs falling items)
Scoring system
Implement responsive design for both desktop and mobile views.
Use Canvas API or any suitable 2D graphics library to render game elements efficiently.
Instructions for Graphics Integration
Ghost PNGs: Replace green elements with custom PNGs.
Bomb PNGs: Replace the bomb graphic in the reference image with a new bomb PNG.
Ghost Catcher Net PNG: Substitute for the blue ice element in the reference image.
Advanced Features
Implement smooth animations for ghost catcher nets when freezing the screen.
Add sound effects for collecting ghosts, bombs, and freezing events.
Include particle effects when the player earns points or hits a bomb.
Development Steps
Set up the project structure and initialize the game engine.
Define item spawn logic and timing intervals.
Develop the collision detection and scoring system.
Implement UI for the scoreboard and timer.
Integrate custom PNG assets for the game elements.
Add final polish with animations, transitions, and sound effects.
Please provide detailed code templates for these features using modern best practices. Include comments and suggestions for optimization where appropriate.