

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

export function createLutTexture(gl, { size, data }) 
{
  const texture = gl.createTexture();

  // use texture slot 1, slot 0 is reserved for the image
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_3D, texture);

  // linear filtering gives smooth interpolation between LUT points
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

  // upload the LUT data as a 3D texture
  gl.texImage3D(
    gl.TEXTURE_3D,
    0,              // mip level
    gl.RGB32F,      // internal format — 32 bit float per channel
    size,           // width
    size,           // height
    size,           // depth
    0,              // border (always 0)
    gl.RGB,         // format
    gl.FLOAT,       // type
    data            // the Float32Array from parseCubeFile
  );

  return texture;
}