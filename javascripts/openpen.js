var addColumn, addLine, compareMatrix, createMatrix, createVector, expandMatrix, expandMatrixRGB, loopSmooth, mergeColumns, mergeLines, smoothMatrix, mergeColumnsFixed, mergeLinesFixed;

expandMatrixRGB = function(objMatrixRGB, intNewWidth, intNewHeight) {
  var arrNewMatrixBlue, arrNewMatrixGreen, arrNewMatrixRed;
  arrNewMatrixRed = expandMatrix(objMatrixRGB.red, intNewWidth, intNewHeight, "red");
  arrNewMatrixGreen = expandMatrix(objMatrixRGB.green, intNewWidth, intNewHeight, "green");
  arrNewMatrixBlue = expandMatrix(objMatrixRGB.blue, intNewWidth, intNewHeight, "blue");
  return {
    red: arrNewMatrixRed,
    green: arrNewMatrixGreen,
    blue: arrNewMatrixBlue
  };
};

expandMatrix = function(arrMatrix, intNewWidth, intNewHeight, strColor) {
  var arrFixedMatrix, arrMerge, arrNewMatrix, intMatrixHeight, intMatrixWidth, intNewColumn, intNewLine, intProportionX, intProportionY, intXCounter, intYCounter, resultMatrix, x, xGain, xLoop, xWeight, y, yGain, yLoop, yWeight;
  intMatrixWidth = arrMatrix.length;
  intMatrixHeight = arrMatrix[0].length;
  intProportionX = intNewWidth / intMatrixWidth;
  intProportionY = intNewHeight / intMatrixHeight;
  arrNewMatrix = arrMatrix;
  arrFixedMatrix = createMatrix(intMatrixWidth, intMatrixHeight, 1);
  intXCounter = void 0;
  x = void 0;
  if (intNewWidth > intMatrixWidth) {
    intXCounter = -1 * intProportionX / 2;
    x = 0;
    while (x < intNewWidth) {
      intXCounter += intProportionX;
      while (intXCounter > 1 && x < intNewWidth) {
        arrNewMatrix = addColumn(arrNewMatrix, x, 0);
        arrFixedMatrix = addColumn(arrFixedMatrix, x, 0);
        intXCounter--;
        x++;
      }
      x++;
      intXCounter--;
    }
    while (arrNewMatrix.length < intNewWidth) {
      intNewColumn = arrNewMatrix.length - 1;
      arrNewMatrix = addColumn(arrNewMatrix, intNewColumn, 0);
      arrFixedMatrix = addColumn(arrFixedMatrix, intNewColumn, 0);
    }
  } else {
    intXCounter = 0;
    arrMerge = [];
    x = 0;
    xLoop = 0;
    xGain = 0;
    xWeight = 1;
    intProportionX = intMatrixWidth / intNewWidth;
    while (x < intNewWidth) {
      intXCounter += intProportionX;
      while (intXCounter > 0) {
        arrMerge.push({
          xBefore: xLoop,
          xAfter: x,
          weight: xWeight
        });
        intXCounter -= xWeight;
        xGain += xWeight;
        xWeight = 1 - xWeight;
        if (xWeight === 0) {
          xWeight = Math.min(1, intXCounter);
        }
        if (xGain === 1) {
          xLoop++;
          xWeight = Math.min(1, intXCounter);
          xGain = 0;
        }
      }
      x++;
    }
    arrNewMatrix = mergeColumns(arrNewMatrix, arrMerge);
    arrFixedMatrix = mergeColumnsFixed(arrFixedMatrix, arrMerge);
  }
  intYCounter = -1 * intProportionY / 2;
  if (intNewHeight > intHeight) {
    y = 0;
    while (y < intNewHeight) {
      intYCounter += intProportionY;
      while (intYCounter > 1 && y < intNewHeight) {
        arrNewMatrix = addLine(arrNewMatrix, y, 0);
        arrFixedMatrix = addLine(arrFixedMatrix, y, 0);
        intYCounter--;
        y++;
      }
      y++;
      intYCounter--;
    }
    while (arrNewMatrix[0].length < intNewHeight) {
      intNewLine = arrNewMatrix[0].length - 1;
      arrNewMatrix = addLine(arrNewMatrix, intNewLine, 0);
      arrFixedMatrix = addLine(arrFixedMatrix, intNewLine, 100);
      y++;
    }
  } else {
    intYCounter = 0;
    arrMerge = [];
    y = 0;
    yLoop = 0;
    yGain = 0;
    yWeight = 1;
    intProportionY = intMatrixHeight / intNewHeight;
    while (y < intNewHeight) {
      intYCounter += intProportionY;
      while (intYCounter > 0) {
        arrMerge.push({
          yBefore: yLoop,
          yAfter: y,
          weight: yWeight
        });
        intYCounter -= yWeight;
        yGain += yWeight;
        yWeight = 1 - yWeight;
        if (yWeight === 0) {
          yWeight = Math.min(1, intYCounter);
        }
        if (yGain === 1) {
          yLoop++;
          yWeight = Math.min(1, intYCounter);
          yGain = 0;
        }
      }
      y++;
    }
    arrNewMatrix = mergeLines(arrNewMatrix, arrMerge);
    arrFixedMatrix = mergeLinesFixed(arrFixedMatrix, arrMerge);
  }
  resultMatrix = loopSmooth(arrNewMatrix, arrFixedMatrix);
  debugMatrix(resultMatrix, arrFixedMatrix, strColor);
  return resultMatrix;
};

createMatrix = function(intWidth, intHeight, dblValue) {
  var arrNewMatrix, x, y;
  arrNewMatrix = Array();
  x = 0;
  while (x < intWidth) {
    arrNewMatrix[x] = Array();
    y = 0;
    while (y < intHeight) {
      arrNewMatrix[x][y] = dblValue;
      y++;
    }
    x++;
  }
  return arrNewMatrix;
};

createVector = function(intSize, dblValue) {
  var arrVector, i;
  arrVector = Array();
  i = 0;
  while (i < intSize) {
    arrVector[i] = dblValue;
    i++;
  }
  return arrVector;
};

addColumn = function(arrMatrix, intColumnPosition, dblValue) {
  var arrNewMatrix, intLoopCount, x, xMatrix, y, yMatrix;
  if (isNaN(dblValue)) {
    throw new Error("invalid value");
  }
  arrNewMatrix = Array();
  xMatrix = 0;
  intLoopCount = 0;
  x = 0;
  while (x <= arrMatrix.length) {
    intLoopCount++;
    if (intLoopCount > 100) {
      throw new Error("something bad happened");
    }
    if (x === intColumnPosition) {
      arrNewMatrix[x] = createVector(arrMatrix[0].length, dblValue);
      x++;
    }
    if (xMatrix < arrMatrix.length) {
      arrNewMatrix[x] = Array();
      yMatrix = 0;
      y = 0;
      while (y < arrMatrix[0].length) {
        arrNewMatrix[x][y] = arrMatrix[xMatrix][yMatrix];
        y++;
        yMatrix++;
      }
    }
    if (xMatrix > arrMatrix.length) {
      throw new Error("to distance to create column. Length:" + arrMatrix.length + ", column:" + intColumnPosition);
    }
    x++;
    xMatrix++;
  }
  return arrNewMatrix;
};

addLine = function(arrMatrix, intLinePosition, dblValue) {
  var arrNewMatrix, intLoopCount, x, xMatrix, y, yMatrix;
  arrNewMatrix = Array();
  xMatrix = 0;
  intLoopCount = 0;
  x = 0;
  while (x < arrMatrix.length) {
    arrNewMatrix[x] = Array();
    yMatrix = 0;
    y = 0;
    while (y <= arrMatrix[0].length) {
      if (intLoopCount > 100) {
        throw new Error("something bad happened");
      }
      if (y === intLinePosition) {
        arrNewMatrix[x][y] = dblValue;
        y++;
      }
      if (typeof arrMatrix[xMatrix][yMatrix] === "undefined" || arrMatrix[xMatrix][yMatrix] === null) {
        if (yMatrix === arrMatrix[xMatrix].length) {
          arrNewMatrix[x][y] = dblValue;
        } else {
          throw new Error("Unable to find the original value in the matrix");
        }
      } else {
        arrNewMatrix[x][y] = arrMatrix[xMatrix][yMatrix];
      }
      y++;
      yMatrix++;
    }
    x++;
    xMatrix++;
  }
  return arrNewMatrix;
};

compareMatrix = function(arrMatrixA, arrMatrixB) {
  var x, y;
  if (arrMatrixA.length !== arrMatrixB.length) {
    return false;
  }
  if (arrMatrixA[0].length !== arrMatrixB[0].length) {
    return false;
  }
  x = 0;
  while (x < arrMatrixA.length) {
    y = 0;
    while (y < arrMatrixA[0].length) {
      if (arrMatrixA[x][y] !== arrMatrixB[x][y]) {
        return false;
      }
      y++;
    }
    x++;
  }
  return true;
};

loopSmooth = function(arrMatrix, arrFixedMatrix) {
  var arrNewMatrix, intCount;
  arrNewMatrix = smoothMatrix(arrMatrix, arrFixedMatrix);
  intCount = 0;
  while (compareMatrix(arrNewMatrix, arrMatrix) === false) {
    intCount++;
    arrMatrix = arrNewMatrix;
    arrNewMatrix = smoothMatrix(arrMatrix, arrFixedMatrix);
    if (intCount > 500) {
      return arrNewMatrix;
    }
  }
  return arrNewMatrix;
};

smoothMatrix = function(arrMatrix, arrFixedMatrix) {
  var arrElements, arrNewMatrix, arrVerticalElements, intHeight, intMaxX, intMaxY, intWidth, x, y;
  arrNewMatrix = Array();
  intWidth = arrMatrix.length;
  intHeight = arrMatrix[0].length;
  intMaxX = intWidth - 1;
  intMaxY = intHeight - 1;
  x = 0;
  while (x < arrMatrix.length) {
    arrNewMatrix[x] = Array();
    y = 0;
    while (y < arrMatrix[0].length) {
      if (arrFixedMatrix[x][y] !== 1) {

        /**
        -+ A    0+ B    ++ C
        -0 D    00 E    +0 F
        -- G    0- H    +- I
         */
        arrElements = Array();
        arrVerticalElements = Array();
        if (x > 0 && y < intMaxY) {
          arrVerticalElements.push(arrMatrix[x - 1][y + 1]);
        }
        if (y < intMaxY) {
          arrElements.push(arrMatrix[x][y + 1]);
        }
        if (x < intMaxX && y < intMaxY) {
          arrVerticalElements.push(arrMatrix[x + 1][y + 1]);
        }
        if (x > 0) {
          arrElements.push(arrMatrix[x - 1][y]);
        }
        arrElements.push(arrMatrix[x][y]);
        if (x < intMaxX) {
          arrElements.push(arrMatrix[x + 1][y]);
        }
        if (x > 0 && y > 0) {
          arrVerticalElements.push(arrMatrix[x - 1][y - 1]);
        }
        if (y > 0) {
          arrElements.push(arrMatrix[x][y - 1]);
        }
        if (x < intMaxX && y > 0) {
          arrVerticalElements.push(arrMatrix[x + 1][y - 1]);
        }
        arrNewMatrix[x][y] = Math.round(((1000 * arrElements.sum()) + (1000 * arrVerticalElements.sum() / 1.4142)) / (arrElements.length + (arrVerticalElements.length / 1.4142))) / 1000;
        if (isNaN(arrNewMatrix[x][y])) {
          throw new Error("That's why i hate javascript");
        }
      } else {
        arrNewMatrix[x][y] = arrMatrix[x][y];
      }
      y++;
    }
    x++;
  }
  return arrNewMatrix;
};

mergeColumns = function(arrMatrix, arrMerge) {
  var arrNewMatrix, i, newValue, objMerge, totalWeight, x, y;
  arrNewMatrix = [];
  totalWeight = 0;
  i = 0;
  while (i < arrMerge.length) {
    objMerge = arrMerge[i];
    y = 0;
    while (y < arrMatrix[0].length) {
      if (arrNewMatrix[objMerge.xAfter] === undefined) {
        arrNewMatrix[objMerge.xAfter] = [];
      }
      if (arrNewMatrix[objMerge.xAfter][y] === undefined) {
        arrNewMatrix[objMerge.xAfter][y] = [];
      }
      if (y === 0 && objMerge.xAfter === 0) {
        totalWeight += objMerge.weight;
      }
      if (arrMatrix[objMerge.xBefore] !== undefined) {
        newValue = arrMatrix[objMerge.xBefore][y] * objMerge.weight;
        arrNewMatrix[objMerge.xAfter][y].push(newValue);
      }
      y++;
    }
    i++;
  }
  x = 0;
  while (x < arrNewMatrix.length) {
    y = 0;
    while (y < arrNewMatrix[0].length) {
      arrNewMatrix[x][y] = arrNewMatrix[x][y].sum() / totalWeight;
      y++;
    }
    x++;
  }
  return arrNewMatrix;
};

mergeColumnsFixed = function(arrMatrix, arrMerge) {
  var arrNewMatrix = mergeColumns( arrMatrix, arrMerge );
  for( var x = 0; x < arrNewMatrix.length; x++ ) {
    for( var y = 0; y < arrNewMatrix[0].length; y++ ) {
      arrNewMatrix[x][y] = Math.round( arrNewMatrix[x][y] ) == 1 ? 1 : 0
    }
  }
  return arrNewMatrix;
}

mergeLines = function(arrMatrix, arrMerge) {
  var arrNewMatrix, i, newValue, objMerge, totalWeight, x, y;
  arrNewMatrix = [];
  totalWeight = 0;
  i = 0;
  while (i < arrMerge.length) {
    objMerge = arrMerge[i];
    x = 0;
    while (x < arrMatrix.length) {
      if (arrNewMatrix[x] === undefined) {
        arrNewMatrix[x] = [];
      }
      if (arrNewMatrix[x][objMerge.yAfter] === undefined) {
        arrNewMatrix[x][objMerge.yAfter] = [];
      }
      if (x === 0 && objMerge.yAfter === 0) {
        totalWeight += objMerge.weight;
      }
      if (arrMatrix[x][objMerge.yBefore] !== undefined) {
        newValue = arrMatrix[x][objMerge.yBefore] * objMerge.weight;
        arrNewMatrix[x][objMerge.yAfter].push(newValue);
      }
      x++;
    }
    i++;
  }
  x = 0;
  while (x < arrNewMatrix.length) {
    y = 0;
    while (y < arrNewMatrix[0].length) {
      arrNewMatrix[x][y] = arrNewMatrix[x][y].sum() / totalWeight;
      y++;
    }
    x++;
  }
  return arrNewMatrix;
};

mergeLinesFixed = function(arrMatrix, arrMerge) {
  var arrNewMatrix = mergeLines( arrMatrix, arrMerge );
  for( var x = 0; x < arrNewMatrix.length; x++ ) {
    for( var y = 0; y < arrNewMatrix[0].length; y++ ) {
      arrNewMatrix[x][y] = Math.round( arrNewMatrix[x][y] ) == 1 ? 1 : 0
    }
  }
  return arrNewMatrix;
}


Array.prototype.sum = function() {
  var L, i, sum;
  i = 0;
  L = this.length;
  sum = 0;
  while (i < L) {
    sum += this[i++];
  }
  return sum;
};
