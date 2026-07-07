
import { createProgram } from "./helper.js";
import { createQuad } from "./helper.js";
import { createImageTexture } from "./helper.js";

import vertSrc from './vertex.glsl';
import fragSrc from './fragment.glsl';

import { parseCubeFile, createLutTexture } from './lutLoader.js';


/**
 * Converts a File object into an HTMLImageElement.
 * Uses createObjectURL to create a local url to load image quick
 * it is wrapped in a promise as img are event based, a promise makes it awaitable
 * then onload runs once image is processed and the url is revoked to free up memory 
 */
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img);
      URL.revokeObjectURL(url); // free memory once the image is loaded
    };
    img.onerror = reject;
    img.src = url;
  });
}


// returns image parameters from our program 
function getUniformLocations(gl, program) {
  return {
    u_image:      gl.getUniformLocation(program, 'u_image'),
    u_lut:        gl.getUniformLocation(program, 'u_lut'),
    u_lutSize:    gl.getUniformLocation(program, 'u_lutSize'),
    u_exposure:   gl.getUniformLocation(program, 'u_exposure'),
    u_contrast:   gl.getUniformLocation(program, 'u_contrast'),
    u_saturation: gl.getUniformLocation(program, 'u_saturation'),
    u_lutStrength:gl.getUniformLocation(program, 'u_lutStrength'),
  };
}


export class Renderer {


    //the web gl gpu stuff is expensive so it is only run once in the constructor

    constructor(canvas){

        //create canvas and gl context then throw an error if the browser doesnt support it 
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2');
        if (!this.gl){
            throw new Error('webGl2 not supported by your browser');   
        }

        //32 bit floating point is most likely what is used by a lut so it enables it as it isnt default 
        this.gl.getExtension('EXT_color_buffer_float');

        //vertex shader = "where do things go," fragment shader = "what color are they" — together, the "program" is the whole recipe for turning your data into pixels on screen.
        this.program = createProgram(this.gl, vertSrc, fragSrc);
        this.vao = createQuad(this.gl, this.program);

        this.uniformLocations = getUniformLocations(this.gl, this.program);


        this.imageTexture = null;
        this.lutTextture = null;
        this.lutSize = 0;

        this.adjustments = {
            exposure: 0,
            contrast: 0,
            saturation: 0,
            lutStrength: 1,
        };
    }


    async loadImage(file)
    {
      const img = await loadImageFromFile(file);
      this.imageTexture = createImageTexture(this.gl, img);
      this.render();

      return { width: img.naturalWidth, height: img.naturalHeight};
    }

    loadLut(cubeText) 
    {
        const lutData = parseCubeFile(cubeText);
        this.lutTexture = createLutTexture(this.gl, lutData);
        this.render();
    }

/**
   * Called by Controls.jsx whenever a slider changes.
   * Accepts a partial object — only pass the values that changed.
   * e.g. renderer.setAdjustments({ exposure: 0.5 })
   */
  setAdjustments(partial) {
    Object.assign(this.adjustments, partial);
    this.render();
  }
 
  /**
   * Returns the current canvas content as a PNG data URL.
   * Called by ExportButton to trigger a download.
   */
  exportImage() {
    return this.canvas.toDataURL('image/png');
  }
 
  /**
   * Exposes the canvas element so the pixel bridge can read
   * pixel data out of it for p5 overlays.
   */
  getCanvas() {
    return this.canvas;
  }
 
  /**
   * Clean up GPU resources when the component unmounts.
   * Called in App.jsx's useEffect cleanup.
   */
  destroy() {
    const { gl } = this;
    if (this.imageTexture) gl.deleteTexture(this.imageTexture);
    if (this.lutTexture)   gl.deleteTexture(this.lutTexture);
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
  }
 
 
  // ─── PRIVATE RENDER METHOD ─────────────────────────────────────────────────
 
  /**
   * Core render loop — called internally after any state change.
   * Not called from outside the class.
   *
   * Render order:
   *   1. Clear canvas
   *   2. Bind image texture → TEXTURE0
   *   3. Bind LUT texture  → TEXTURE1
   *   4. Upload all uniforms (LUT size + adjustment values)
   *   5. Draw the fullscreen quad (TRIANGLE_STRIP, 4 vertices)
   */
  render() {
    // don't render if we don't have both textures yet
    if (!this.imageTexture || !this.lutTexture) return;
 
    const { gl, program, uniformLocations: u } = this;
 
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
 
    // bind image to texture slot 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.uniform1i(u.u_image, 0);
 
    // bind LUT to texture slot 1
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_3D, this.lutTexture);
    gl.uniform1i(u.u_lut, 1);
 
    // LUT size — needed in the shader for the half-texel offset calculation
    gl.uniform1f(u.u_lutSize, this.lutSize);
 
    // user adjustment uniforms
    gl.uniform1f(u.u_exposure,    this.adjustments.exposure);
    gl.uniform1f(u.u_contrast,    this.adjustments.contrast);
    gl.uniform1f(u.u_saturation,  this.adjustments.saturation);
    gl.uniform1f(u.u_lutStrength, this.adjustments.lutStrength);
 
    // draw
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindVertexArray(null);
  }
}







