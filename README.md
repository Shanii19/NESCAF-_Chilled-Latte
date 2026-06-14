# NESCAFÉ Chilled Latte - Interactive Scroll Experience

A highly interactive and immersive promotional landing page for NESCAFÉ Chilled Latte, demonstrating advanced creative web development techniques.

## Features

- **Butter-Smooth Scrolling:** Powered by [Lenis](https://lenis.studiofreight.com/) to provide a seamless, premium scrolling experience matching the standard of high-end Awwwards-winning websites.
- **Scroll-Hijacked Coffee Animation:** An optimized, 240-frame 3D coffee cup and splash animation rendered on an HTML `<canvas>`, strictly tied to the user's scroll position for a highly tactile experience.
- **3D Tilt Elements:** Interactive product cards utilizing `vanilla-tilt.js` for glassmorphism and 3D parallax effects on hover.
- **Performance Optimized:** Includes a custom preloader that fully buffers all 240 high-resolution frames into memory before dismissing the loading screen, guaranteeing zero stutter during the scroll animation.
- **Dynamic Mobile Menu:** A responsive, fullscreen mobile menu featuring an intelligent hamburger icon that dynamically adapts its color based on the scroll position and the background color of the hero section.

## Tech Stack

- **HTML5 / Canvas** for core structure and 60fps frame rendering.
- **Tailwind CSS** via CDN for rapid, responsive styling and typography.
- **Lenis** for momentum scrolling.
- **Vanilla-tilt.js** for 3D interactions.
- **AOS (Animate on Scroll)** for entrance animations.

## Setup

1. Clone the repository.
2. Serve the directory using any static file server (e.g., Python's `http.server`, Live Server for VS Code).
   ```bash
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` in your web browser. Note: Do not open `index.html` via the `file://` protocol, as cross-origin request restrictions might block the JavaScript and preloader from loading properly.
