

export function parseCubeFile(cubeText) 
{
  const lines = cubeText.split('\n');
  let size = 0;
  const data = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue;

    // grab the LUT size from the header
    if (trimmed.startsWith('LUT_3D_SIZE')) 
    {
      size = parseInt(trimmed.split(/\s+/)[1]);
      continue;
    }

    // skip other header lines like TITLE, DOMAIN_MIN, DOMAIN_MAX
    if (isNaN(parseFloat(trimmed[0]))) continue;

    // parse RGB triplet
    const [r, g, b] = trimmed.split(/\s+/).map(parseFloat);
    data.push(r, g, b);
    }

    return { size, data: new Float32Array(data) };
}

function toByte(value) {
  const clamped = Math.min(1, Math.max(0, value));
  return Math.round(clamped * 255);
}

function convertRgbFloatToRgba8(data) {
  const voxelCount = data.length / 3;
  const rgba = new Uint8Array(voxelCount * 4);

  for (let i = 0; i < voxelCount; i += 1) {
    const src = i * 3;
    const dst = i * 4;
    rgba[dst] = toByte(data[src]);
    rgba[dst + 1] = toByte(data[src + 1]);
    rgba[dst + 2] = toByte(data[src + 2]);
    rgba[dst + 3] = 255;
  }

  return rgba;
}

export function createLutTexture(gl, { size, data }) {
  if (!size || data.length !== size * size * size * 3) {
    throw new Error(`Invalid LUT payload (size: ${size}, values: ${data.length})`);
  }

  const texture = gl.createTexture();
  const rgbaData = convertRgbFloatToRgba8(data);

  // use texture slot 1, slot 0 is reserved for the image
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_3D, texture);

  // linear filtering gives smooth interpolation between LUT points
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

  // RGBA8 is reliably sampleable with LINEAR filtering on mobile WebGL2 browsers.
  gl.texImage3D(
    gl.TEXTURE_3D,
    0,            // mip level
    gl.RGBA8,     // internal format
    size,         // width
    size,         // height
    size,         // depth
    0,            // border (always 0)
    gl.RGBA,      // format
    gl.UNSIGNED_BYTE,
    rgbaData
  );

  return texture;
}
