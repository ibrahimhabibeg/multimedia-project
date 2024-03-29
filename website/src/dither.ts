import PATTERNS from "./patterns.ts";

const naiveThresholdDithering = (matrix: number[][]) =>
  matrix.map(row => row.map((intensity) => intensity >= 128 ? 255 : 0));

const brightnessThresholdDithering = (matrix: number[][]) => {
  const sumBrightness = matrix.flat().reduce((sum, intensity)=>sum+intensity, 0);
  const avgBrightness = Math.round(sumBrightness/matrix.flat().length);
  return matrix.map(row => row.map((intensity) => intensity >= avgBrightness ? 255 : 0));
}

const errorDiffusionDithering = (matrix: number[][]) => {
  const m = matrix.length;
  const n = matrix[0].length;
  for (let row = 0; row < m; row++) for (let col = 0; col < n; col++) {
    const luminance = matrix[row][col];
    matrix[row][col] = luminance >=128? 255: 0;
    const error = luminance - matrix[row][col];
    if (col + 1 <n) matrix[row][col+1]+=(7/16)*error
    if (row + 1 < m && col - 1 >= 0) matrix[row+1][col-1]+=(3/16)*error
    if (row + 1 < m) matrix[row+1][col]+=(5/16)*error
    if (row + 1 < m && col + 1 < n) matrix[row+1][col+1]+=(1/16)*error
  }
  return matrix;
}

const orderedDithering = (matrix: number[][]) => {
  const m = matrix.length;
  const n = matrix[0].length;
  const D = [[0, 128, 32, 160], [192, 64, 224, 96], [48, 176, 16, 144], [240, 112, 208, 80]]
  for (let row = 0; row < m; row++) for (let col = 0; col < n; col++) {
    matrix[row][col] = matrix[row][col]< D[row%4][col%4]? 0 :255;
  }
  return matrix;
}

const patternDithering = (matrix: number[][]) => {
  const m = matrix.length;
  const n = matrix[0].length;
  for (let row = 0; row < m; row+=3) for (let col = 0; col < n; col+=3) {
    let sum = 0;
    let cnt = 0;
    for (let i = row; i < Math.min(m, row+3); i++) for (let j = col; j < Math.min(n, col+3); j++){
      sum += matrix[i][j];
      cnt++;
    }
    const D = PATTERNS[Math.min(9, Math.floor(((sum/cnt)/255)*10))];
    for (let i = row; i < Math.min(m, row+3); i++) for (let j = col; j < Math.min(n, col+3); j++)
      matrix[i][j] = D[i-row][j-col];
  }
  return matrix;
}

const toGrayscaleMatrix = (imageData: ImageData) => {
  const matrix: Array<Array<number>> = [];
  const {width, height} = imageData;
  for (let i = 0; i < height; i++) matrix.push([]);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const row = Math.floor(Math.floor(i / 4) / width);
    matrix[row].push(0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]);
  }
  return matrix;
}

const toImageData = (matrix: number[][]) => {
  const intArray = new Uint8ClampedArray(
    matrix.flat().flatMap((intensity) => intensity ? [255, 255, 255, 255] : [0, 0, 0, 255])
  );
  return new ImageData(intArray, matrix[0].length, matrix.length);
}

const usingMatrix = (func:(matrix:number[][])=>number[][]) => (imageData:ImageData) => toImageData(func(toGrayscaleMatrix(imageData)))

const algorithms = {
  naiveThresholdDithering: usingMatrix(naiveThresholdDithering),
  brightnessThresholdDithering: usingMatrix(brightnessThresholdDithering),
  errorDiffusionDithering: usingMatrix(errorDiffusionDithering),
  orderedDithering: usingMatrix(orderedDithering),
  patternDithering: usingMatrix(patternDithering)
}

export default algorithms;