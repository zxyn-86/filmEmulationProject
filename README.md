
Photo Editor

A browser-based photo editing app that lets you apply cinematic color grades (LUTs) to your images in real time, powered by WebGL 2 for fast, GPU-accelerated rendering.

How It Works

1. Upload an image — the photo is loaded into the browser and drawn onto a canvas.
   
2. Choose a LUT — a Look-Up Table (a 3D color mapping, typically stored as a .cube file or baked into a texture) defines how each pixel's color should be transformed to achieve a specific       style or mood (e.g. cinematic, vintage, black & white).
3. GPU rendering with WebGL 2 — the image and the LUT are uploaded to the GPU as textures. A custom fragment shader samples the LUT texture for each pixel of the source image and remaps its     RGB values accordingly, rendering the graded result directly to a <canvas> element.
4. Real-time preview — because the color transformation happens on the GPU, adjustments and LUT swaps render instantly without blocking the UI, even on higher-resolution images.
5. Export — the final graded image can be read back from the canvas and downloaded/exported.

   
Tech Stack

React — UI components, state management, and app structure
Vite — dev server and build tooling for fast HMR and optimized production builds
JavaScript — core application logic
WebGL 2 — GPU-accelerated image rendering and LUT-based color grading via custom shaders

Key Concepts
LUT (Look-Up Table): A precomputed 3D color mapping used to transform an image's colors to match a specific style, without needing per-pixel manual adjustments.
Shader-based grading: Color transformations are implemented in GLSL fragment shaders, allowing complex color math to run in parallel on the GPU rather than the CPU.
Canvas rendering pipeline: Source image → texture upload → shader pass (with LUT sampling) → render to canvas → optional export.
