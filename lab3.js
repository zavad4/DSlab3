'use strict';
const grafinfo = {};
const loops = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

 ctx.font = '24px Times new Roman';
 ctx.textBaseline = 'middle';
 ctx.textAlign = 'center';

 const A = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]
];
ctx.fillText('Adjacency matrix', 750, 600);
for (let i = 0; i < A.length; i++) {
  ctx.font = '22px Times new Roman';
  ctx.fillText(`${A[i]}`, 750, 600 + (i + 1) * 25);
}
ctx.font = '17px Times new Roman';

const C = JSON.parse(JSON.stringify(A));

const r = 15;
const rloops = 3 * r / 4;
const arrr = 5;

const buildVertex = (n, P, x0, y0, obj) => {
  let step = P / n;
  const side = P / 4;
  let vert = 1;
  let newX = x0;
  let newY = y0;

  for (vert; vert <=  Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY += step;
  }

  for (vert; vert <=  2 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX += step;
  }

  for (vert; vert <=  3 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY -= step;
  }
  for (vert; vert <=  n; vert++) {
    step = side / (n - 3 * Math.ceil(n / 4));
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX -= step;
  }
};
buildVertex(11, 1600, 75, 100, grafinfo);

const makeCons = (matrix, obj) => {
  for (const key in obj) {
    obj[key].simplecon = [];
    obj[key].doublecon = [];
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) { 
        const names = [`vert${i+1}`, `vert${j + 1}`];
        if (i === j) loops.push(`vert${i + 1}`);
        else if (!matrix[j][i]) {
          obj[names[0]].simplecon.push(`vert${j + 1}`);
        }
        else {
          obj[names[0]].doublecon.push(`vert${j + 1}`);
        }
      }
    }
  }
}
const center = (x0, y0, p) =>{ 
  let x = x0 + p/8;
  let y = y0 + p/8;
  return {
    x : x,
    y : y
  }
}

const drawLoops = (arr, obj, x0, y0) => {
  let alpha;
  const xc = center(x0, y0, 1600).x;
  const yc = center(x0, y0, 1600).y;
  for (let i in arr) {
    alpha = Math.atan2(obj[arr[i]].coords[1] - yc, obj[[arr[i]]].coords[0] - xc);
    const R = Math.sqrt((obj[arr[i]].coords[0] - xc)**2 + (obj[arr[i]].coords[1] - yc)**2) + r;
    const xloops = xc + R * Math.cos(alpha);
    const yloops = yc + R * Math.sin(alpha);
    ctx.beginPath();
    ctx.arc(xloops, yloops, rloops, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
}

function drawArrowhead(x0, y0, x1,y1, radius, fillStyle = 'black', strokestyle = 'black') {
  const xcenter = x1;
  const ycenter = y1;
  let angle;
  let x;
  let y;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  angle = Math.atan2(y1 - y0, x1 - x0);
  x = radius * Math.cos(angle) + xcenter;
  y = radius * Math.sin(angle) + ycenter;

  ctx.moveTo(x, y);
  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xcenter;
  y = radius * Math.sin(angle) + ycenter;
  ctx.lineTo(x, y);

  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xcenter;
  y = radius * Math.sin(angle) + ycenter;
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

const readyCons = (x0, y0, x1, y1, r) => {
  const step = 1;
  const alpha = Math.atan2(y1 - y0, x1 - x0);
    const dx = step * Math.cos(alpha);
    const dy = step * Math.sin(alpha);
    let x = x0;
    let y = y0;
    while(true) {
      x += dx;
      y += dy;
      if(Math.sqrt((x1 - x)**2 + (y1 - y)**2) < r + arrr) break;
    }
    const res = {
      x : x,
      y : y
    };
    return res;
  }

  function simpleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : (r * 3.5) * Math.cos(Math.PI / 2 - alpha),
      dy : (r * 3.2) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  function doubleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : (r * 1.15) * Math.cos(Math.PI / 2 - alpha),
      dy : (r * 0.65) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  const drawOrSimpleCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].simplecon.length; i++) {
        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].simplecon[i]}`].coords[0];
        const toY = obj[`${obj[key].simplecon[i]}`].coords[1];
  
        
        if (Math.abs(obj[key].num - obj[`${obj[key].simplecon[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].simplecon[i]}`].num) === (Object.keys(obj).length - 1)) {
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
          const coordinates = readyCons(fromX, fromY, toX, toY, r);
          drawArrowhead(fromX, fromY, coordinates.x, coordinates.y, arrr);
        } 
        else {
        const { dx, dy } = simpleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY, r);
        drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);  
        }
      }
    }
  }

  const drawOrDoubleCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].doublecon.length; i++) {

        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].doublecon[i]}`].coords[0];
        const toY = obj[`${obj[key].doublecon[i]}`].coords[1];
  
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
  
        const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY, r);
        drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);
        } 
      }
    }


const drawVertex = obj => {
  for (let key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
    ctx.fillStyle = "grey";
    ctx.fill();
    ctx.strokeStyle = "yellow";
    ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
    ctx.stroke();
  }
}

const pdeg = (obj, loops) => {
  ctx.font = '24px Times new Roman';
  ctx.fillStyle = "black";
  ctx.fillText('Deg+ (outside)', 150, 600);
  for (const key in obj) {
    const name = `vert${obj[key].num}`;
    obj[key].pdeg = 0;
    if (loops.includes(`vert${obj[key].num}`)) obj[key].pdeg++;
    const cons = obj[key].simplecon.length + obj[key].doublecon.length;
    obj[key].pdeg += cons;
    ctx.fillText(`${name} : ${obj[key].pdeg}`, 150, 600 + obj[key].num * 25);
    ctx.stroke();
  }
};

const mdeg = (obj, loops) =>{
  ctx.font = '24px Times new Roman';
  ctx.fillStyle = "black";
  ctx.fillText('Deg- (inside)', 450, 600);
  for (const i in obj) {
    const name = `vert${obj[i].num}`;
    obj[i].mdeg = 0;
    if (loops.includes(`vert${obj[i].num}`)) obj[i].mdeg++;
    for (const j in obj) {
    if (obj[j].simplecon.includes(`vert${obj[i].num}`)) obj[i].mdeg++;
    if (obj[j].doublecon.includes(`vert${obj[i].num}`)) obj[i].mdeg++;
    }
    ctx.fillText(`${name} : ${obj[i].mdeg}`, 450, 600 + obj[i].num * 25);
    ctx.stroke();
  }  
}

const withoutloops = matrix => {
  const res = JSON.parse(JSON.stringify(matrix));
  for (let i = 0; i < res.length; i++) {
    res[i][i] = 0; 
}
return res;
};

const B = withoutloops(A);

let ways2 = [];
let ways3 = [];

const findlen2 = matrix => {
  ctx.fillText('Paths two in length', 150, 950);
  let counter = 1;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 1) {
        for (let k = 0; k < matrix.length; k++) {
          if (matrix[j][k] === 1) {
            ways2.push(`${i + 1}-${j + 1}-${k + 1}`);
            ctx.fillText(`${i + 1}-${j + 1}-${k + 1}`, 150, 950 + counter * 25);
            console.log(`${i + 1}-${j + 1}-${k + 1}`);
            counter++;
          }
        }
      }
    }
  }
};

const findlen3 = matrix => {
  ctx.fillText('Paths three in length', 450, 950);
  let counter = 1;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 1) {
        for (let k = 0; k < matrix.length; k++) {
          if (matrix[j][k] === 1) {
            for (let w = 0; w < matrix.length; w++) {
              if (matrix[k][w] === 1) {
                ways3.push(`${i + 1}-${j + 1}-${k + 1}-${w + 1}`);
                ctx.fillText(`${i + 1}-${j + 1}-${k + 1}-${w + 1}`, 450, 950 + counter * 25);
                console.log(`${i + 1}-${j + 1}-${k + 1}-${w + 1}`);
                counter++;
              }
            }
          }
        }
      }
    }
  }
};

const MultMatrix = (A,B) => {
  let rowsA = A.length, colsA = A[0].length,
      rowsB = B.length, colsB = B[0].length,
      C = [];
      if (colsA != rowsB) return false;
      for (let i = 0; i < rowsA; i++) C[i] = [];
        for (let k = 0; k < colsB; k++) { 
            for (let i = 0; i < rowsA; i++) { 
            let t = 0;
              for (let j = 0; j < rowsB; j++) t += A[ i ][j]*B[j][k];
              C[i][k] = t;
      }
   }
  return C;
};

function MultElemets(m1,m2) {
  let C = Array.from(m2);
  for (let i = 0; i < m1.length; i++) {
   for (let j =0 ; j < m2.length; j++) {
    C[i][j] = m1[i][j] * m2[j][i];
     }
   }
   return C;
};

const MatrixPow = (n,A) => { 
  if (n == 1) return A; 
  else return MultMatrix( A, MatrixPow(n-1,A) );
};
const A2 = MatrixPow(2, A);
const A3 = MatrixPow(3, A);

const TransMatrix = A => {
  let m = A.length, n = A[0].length, AT = [];
    for (let i = 0; i < n; i++) {
     AT[i] = [];
       for (let j = 0; j < m; j++) AT[i][j] = A[j][ i ];
     }
  return AT;
};

let D = [];
for(let i = 0; i < A.length; i++) {
  D[i] = [];
  for(let j = 0; j < A.length; j++) {
    D[i][j] = (i===j) ? 1 : 0;
  }
}

const arrForD = [];
for(let i = 1; i < A.length; i++) {
  arrForD.push(MatrixPow(i, C))
}

for(let i = 0; i < arrForD.length; i++) {
 for(let j = 0; j < D.length; j++) {
  for(let k = 0; k < D.length; k++) {
   if(arrForD[i][j][k]) {
    D[j][k] = 1;
   }
  }
 }
};

ctx.font = '24px Times new Roman';
ctx.fillText('Reachability matrix', 1000, 600);
for (let i = 0; i < D.length; i++) {
  ctx.font = '22px Times new Roman';
  ctx.fillText(`${D[i]}`, 1000, 600 + (i + 1) * 25);
}

console.log(D);

const S = MultElemets(D, TransMatrix(D));
ctx.fillText('Matrix of strong connectivity', 750, 950);
for (let i = 0; i < S.length; i++) {
  ctx.font = '22px Times new Roman';
  ctx.fillText(`${S[i]}`, 750, 950 + (i + 1) * 25);
}

const K = [];
const used = new Set();

for(let i = 0; i < S.length; i++) {
  let temp = [];
  if(used.has(i + 1)) continue;
  for(let j = i; j < S.length; j++) {
    if(S[j][i]) {
      used.add(j + 1);
      temp.push(j + 1)
    }
  }
  if(temp.length) K.push(Array.from(temp));
  temp = [];
}

let conRegen = {};

K.forEach((val, ind) => {
  val.forEach((inVal, inInd) => {
    conRegen[inVal] = ind + 1; 
  })
})
ctx.fillText('Components', 1000, 950);
for (let i = 0; i < K.length; i++) {
  ctx.font = '22px Times new Roman';
  ctx.fillText(`${K[i]}`, 1000, 950 + (i + 1) * 25);
}

const newLength = K.length;
let newM = [];
for(let i = 0; i < newLength; i++) {
  newM[i] = [];
  for(var j = 0; j < newLength; j++) {
    newM[i][j] = 0;
  }
}

let newVerts = {};
for(let i = 0; i < C.length; i++) {
  for(let j = 0; j < C.length; j++) {
    if(C[i][j] === 1) {
      const a = conRegen[i + 1];
      const b = conRegen[j + 1];
      newM[a - 1][b - 1] = 1;
    } 
  }
}

{
  const n = K.length;
  const x = 900;
  const y = 325;
  const r = 200;
  
  const alpha = 2 * Math.PI / n;

  const vertics = {};
  let i = 1;

  for (let angle = 0; i <= n; angle += alpha) {
    const newX = x + r * Math.cos(angle);
    const newY = y + r * Math.sin(angle);
    vertics[`vert${i}`] = {};
    vertics[`vert${i}`].coords = [];
    vertics[`vert${i}`].coords.push(newX);
    vertics[`vert${i}`].coords.push(newY);
    vertics[`vert${i}`].num = `${K[i - 1]}`;
    vertics[`vert${i}`].radius = r * K[i - 1].length * 0.08;
    i++;
  }
  newVerts = vertics;
}


const drawNewVertex = obj => {
  for (let key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], obj[key].radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "grey";
    ctx.fill();
    ctx.strokeStyle = "yellow";
    ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
    ctx.stroke();
  }
}

const drawNewOrSimpleCons = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].simplecon.length; i++) {
      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].simplecon[i]}`].coords[0];
      const toY = obj[`${obj[key].simplecon[i]}`].coords[1];
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.strokeStyle = "black";
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(fromX, fromY, toX, toY, obj[`${obj[key].simplecon[i]}`].radius);
        drawArrowhead(fromX, fromY, coordinates.x, coordinates.y, arrr);  
      }
    }
  }

ctx.fillText('Adjacency matrix', 750, 1275);
ctx.fillText('of condensation graph', 750, 1300);
for (let i = 0; i < newM.length; i++) {
  ctx.font = '22px Times new Roman';
  ctx.fillText(`${newM[i]}`, 750, 1300 + (i + 1) * 25);
  }

makeCons(A, grafinfo);
drawLoops(loops, grafinfo,75, 100);
drawOrSimpleCons(grafinfo);
drawOrDoubleCons(grafinfo);
drawVertex(grafinfo);
pdeg(grafinfo, loops);
mdeg(grafinfo, loops);
findlen2(A);
findlen3(A);
makeCons(newM, newVerts);
drawNewOrSimpleCons(newVerts);
drawNewVertex(newVerts);
console.log(newVerts);
