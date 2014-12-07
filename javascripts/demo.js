var debugMatrix, drawFixed, drawMatrix, intHeight, intThumbHeight, intThumbWidth, intWidth, makePallete, makeThumbnail, pickColor;

intWidth = 16;

intHeight = 16;

intThumbWidth = 11;

intThumbHeight = 11;

debugMatrix = function(arrMatrix, arrFixedMatrix, strColor) {
  if( strColor === undefined ) {
    strColor = "red";
  }
  drawMatrix({
    red: (strColor === "red" ? arrMatrix : createMatrix(arrMatrix.length, arrMatrix[0].length, 0)),
    green: (strColor === "green" ? arrMatrix : createMatrix(arrMatrix.length, arrMatrix[0].length, 0)),
    blue: (strColor === "blue" ? arrMatrix : createMatrix(arrMatrix.length, arrMatrix[0].length, 0))
  }, document.getElementById("debug-" + strColor));
  if( arrFixedMatrix !== undefined ) {
    drawFixed(document.getElementById("debug-" + strColor), arrFixedMatrix);
  }
};

drawFixed = function(objDivMatrix, arrFixedMatrix) {
  var arrLines, arrPixels, objLine, objPixel, x, y;
  arrLines = objDivMatrix.childNodes;
  y = 0;
  while (y < arrLines.length) {
    objLine = arrLines[y];
    arrPixels = objLine.getElementsByTagName("span");
    x = 0;
    while (x < arrPixels.length) {
      objPixel = arrPixels[x];
      if (arrFixedMatrix[x][y] === 1) {
        objPixel.style.borderWidth = "1px";
        objPixel.style.borderColor = "white";
        objPixel.style.borderStyle = "solid";
        objPixel.title += " fixed";
      } else {
        objPixel.title += " estimated";
      }
      x++;
    }
    y++;
  }
};

pickColor = function(arrMatrix, x, y, notFound) {
  if (arrMatrix[x] == null) {
    return notFound;
  }
  if (arrMatrix[x][y] == null) {
    return notFound;
  }
  return arrMatrix[x][y];
};

drawMatrix = function(objMatrixRGB, objDiv) {
  var arrMatrixBlue, arrMatrixGreen, arrMatrixRed, intBlue, intGreen, intRed, objLine, objPixel, x, y;
  objDiv.innerHTML = "";
  arrMatrixRed = objMatrixRGB.red;
  arrMatrixGreen = objMatrixRGB.green;
  arrMatrixBlue = objMatrixRGB.blue;
  y = 0;
  while (y < arrMatrixRed[0].length) {
    objLine = document.createElement("div");
    objLine.className = "line";
    x = 0;
    while (x < arrMatrixRed.length) {
      intRed = Math.round(pickColor(arrMatrixRed, x, y, 255));
      intGreen = Math.round(pickColor(arrMatrixGreen, x, y, 0));
      intBlue = Math.round(pickColor(arrMatrixBlue, x, y, 0));
      objPixel = document.createElement("span");
      objPixel.className = "pixel";
      objLine.appendChild(objPixel);
      objPixel.style.backgroundColor = "rgb(" + intRed + "," + intGreen + "," + intBlue + ")";
      objPixel.title = "[" + x + "," + y + "] rgb(" + intRed + "," + intGreen + "," + intBlue + ")";
      objLine.appendChild(objPixel);
      x++;
    }
    objDiv.appendChild(objLine);
    y++;
  }
};

makePallete = function() {
  var arrColors, intColor, intColors, intElement, objPencil;
  intColors = 10;
  arrColors = Array();
  intColor = 0;
  while (intColor < 255) {
    arrColors.push(Array(intColor, intColor, intColor));
    intColor += intColors;
  }
  intColor = 0;
  while (intColor < 255) {
    arrColors.push(Array(255 - intColor, 255 - intColor, intColor));
    intColor += intColors;
  }
  intColor = 0;
  while (intColor < 255) {
    arrColors.push(Array(intColor, 255 - intColor, 255 - intColor));
    intColor += intColors;
  }
  intColor = 0;
  while (intColor < 255) {
    arrColors.push(Array(255 - intColor, intColor, 255 - intColor));
    intColor += intColors;
  }
  intElement = 0;
  while (intElement < arrColors.length) {
    objPencil = document.createElement("span");
    objPencil.className = "pixel";
    objPencil.style.backgroundColor = "rgb(" + arrColors[intElement].join() + ")";
    objPencil.onclick = function() {
      window.pencilColor = this.style.backgroundColor;
    };
    document.getElementById("paleta").appendChild(objPencil);
    intElement++;
  }
  window.pencilColor = "rgb(255,0,0)";
};

window.draw = function() {
  var color, distance, dx, dy, objLine, objPixel, radio, rgbColor, x, y;
  x = 0;
  while (x < intWidth) {
    objLine = document.createElement("div");
    objLine.className = "line";
    y = 0;
    while (y < intHeight) {
      objPixel = document.createElement("span");
      dy = y - intHeight / 2;
      dx = x - intWidth / 2;
      distance = Math.sqrt(dx * dx + dy * dy);
      radio = 7;
      if (distance < Math.round(radio)) {
        color = Math.round(255 * (1 - distance / (radio + 1)));
        rgbColor = "rgb(" + color + "," + color + "," + color + ")";
        console.log(rgbColor);
        objPixel.style.backgroundColor = rgbColor;
      } else {
        if (x > intWidth * 0.6) {
          objPixel.style.backgroundColor = "rgb(0,0," + Math.round(200 * x / intWidth) + ")";
        }
      }
      objPixel.className = "pixel";
      objLine.appendChild(objPixel);
      objPixel.onclick = function() {
        this.style.backgroundColor = window.pencilColor;
        window.makeThumbnail();
      };
      y++;
    }
    document.getElementById("origins").appendChild(objLine);
    x++;
  }
  window.makeThumbnail();
};

window.drawHeavy = function ( arrHeavy, objParentDiv, arrColors ) {
  if( arrColors === undefined ) {
    arrColors = [200,200,200];
  }
  objParentDiv.innerHTML = "";
  var maxValue = 0;
  for( var i = 0; i < arrHeavy.length; i++ ) {
    if( maxValue < arrHeavy[ i ] ) {
      maxValue = arrHeavy[ i ];
    }
  }
  for( var i = 0; i < arrHeavy.length; i++ ) {
    var dblProportional = arrHeavy[ i ] / maxValue;
    var objDiv = document.createElement("div");
    objDiv.style.backgroundColor = "rgb(" + Math.round( arrColors[0] * dblProportional ) 
                                    + "," + Math.round( arrColors[1] * dblProportional )
                                    + "," + Math.round( arrColors[2] * dblProportional ) + ")";
    objDiv.style.display = "inline-block";
    objDiv.style.width = "4px";
    objDiv.style.height = arrHeavy[ i ] / 40 + "px";
    objParentDiv.appendChild( objDiv );
  }
};

window.makeThumbnail = function() {
  var arrLines, arrMatrixBlue, arrMatrixGreen, arrMatrixRed, arrPixels, objColor, objLine, objPixel, objThumbMatrix, strColor, x, y;
  arrMatrixRed = createMatrix(intWidth, intHeight, 0);
  arrMatrixGreen = createMatrix(intWidth, intHeight, 0);
  arrMatrixBlue = createMatrix(intWidth, intHeight, 0);
  arrLines = document.getElementById("origins").childNodes;
  y = 0;
  while (y < arrLines.length) {
    objLine = arrLines[y];
    arrPixels = objLine.getElementsByTagName("span");
    x = 0;
    while (x < arrPixels.length) {
      objPixel = arrPixels[x];
      strColor = objPixel.style.backgroundColor;
      if (strColor === false || strColor === undefined || strColor == "" ) {
        strColor = "rgb(255,255,255)";
      }
      objColor = new RGBColor(strColor);
      arrMatrixRed[x][y] = objColor.r;
      arrMatrixGreen[x][y] = objColor.g;
      arrMatrixBlue[x][y] = objColor.b;
      x++;
    }
    y++;
  }
  objThumbMatrix = expandMatrixRGB({
    red: arrMatrixRed,
    green: arrMatrixGreen,
    blue: arrMatrixBlue
  }, intThumbWidth, intThumbHeight);
  window.thumbMatrix = objThumbMatrix;
  drawHeavy( getHeavy( window.thumbMatrix.red ), document.getElementById("heavyRed"), [255,200,200] );
  drawHeavy( getHeavy( window.thumbMatrix.green ), document.getElementById("heavyGreen"), [200,255,200] );
  drawHeavy( getHeavy( window.thumbMatrix.blue ), document.getElementById("heavyBlue"), [200,200,255] );
  drawMatrix( objThumbMatrix, document.getElementById("destiny") );
};

window.addEventListener( "load", function(){

	document.getElementById("thumbWidth").value = intThumbWidth;
	document.getElementById("showWidth").innerHTML = intThumbWidth;
	document.getElementById("thumbWidth").addEventListener("change", function() {
	  intThumbWidth = this.value;
	  document.getElementById("showWidth").innerHTML = intThumbWidth;
	  makeThumbnail();
	});

	document.getElementById("thumbHeight").value = intThumbHeight;
	document.getElementById("showHeight").innerHTML = intThumbHeight;
	document.getElementById("thumbHeight").addEventListener("change", function() {
	  intThumbHeight = this.value;
	  document.getElementById("showHeight").innerHTML = intThumbHeight;
	  makeThumbnail();
	});

	document.getElementById("clearOrigins").addEventListener("click", function() {
		var arrSpan = document.getElementById("origins").getElementsByTagName("span");
		for( var i = 0; i < arrSpan.length; i++ ) {
			arrSpan[i].style.backgroundColor = "rgb(0,0,0)";
		}
		makeThumbnail();
	});
	makePallete();
	window.draw();

});
