Array.prototype.sum = function() {
	for (var i = 0, L = this.length, sum = 0; i < L; sum += this[i++]);
	return sum;
}

function expandMatrixRGB( objMatrixRGB, intNewWidth, intNewHeight ) 
{
	var arrNewMatrixRed   = expandMatrix( objMatrixRGB.red,   intNewWidth, intNewHeight, 'red' );
	var arrNewMatrixGreen = expandMatrix( objMatrixRGB.green, intNewWidth, intNewHeight, 'green' );
	var arrNewMatrixBlue  = expandMatrix( objMatrixRGB.blue,  intNewWidth, intNewHeight, 'blue' );
	return {
		red:   arrNewMatrixRed, 
		green: arrNewMatrixGreen, 
		blue:  arrNewMatrixBlue 
	};
}

Array.prototype.sum = function() {
	for (var i = 0, L = this.length, sum = 0; i < L; sum += this[i++]);
	return sum;
}

function expandMatrix( arrMatrix, intNewWidth, intNewHeight, strColor )
{
	var intMatrixWidth = arrMatrix.length;
	var intMatrixHeight = arrMatrix[0].length;
	var intProportionX =   intNewWidth / intMatrixWidth;
	var intProportionY =  intNewHeight / intMatrixHeight;

	arrNewMatrix = arrMatrix;
	arrFixedMatrix = createMatrix( intMatrixWidth, intMatrixHeight , 1 );

	var intXCounter;
	var x;
	if( intNewWidth > intMatrixWidth ) {
		intXCounter = -1 * intProportionX / 2;
		x = 0;
		while( x < ( intNewWidth ) )
		{
			intXCounter += intProportionX;

			while( intXCounter > 1 && ( x ) < ( intNewWidth ) )
			{
				console.log("loop column 1");
				arrNewMatrix = addColumn( arrNewMatrix, x, 0 );
				arrFixedMatrix = addColumn( arrFixedMatrix, x, 0 );
				intXCounter--;
				x++;
			}

			x++;
			intXCounter--;
		}
		while( arrNewMatrix.length < ( intNewWidth ) )
		{
			console.log("loop column 3");
			var intNewColumn = arrNewMatrix.length - 1;
			arrNewMatrix = addColumn( arrNewMatrix, intNewColumn, 0 );
			arrFixedMatrix = addColumn( arrFixedMatrix, intNewColumn, 0 );
		}
	} else {
		intXCounter = 0;
		var arrMerge = [];
		x = 0;
		var xLoop = 0;
		var xGain = 0;
		var xWeight = 1;
		var intProportionX =    intMatrixWidth / intNewWidth;

		while( x < ( intNewWidth ) ) 
		{
			intXCounter += intProportionX;

			while( intXCounter > 0 )
			{
				arrMerge.push( { xBefore: xLoop, xAfter: x, weight: xWeight } );
				intXCounter -= xWeight;
				xGain += xWeight;
				xWeight = 1 - xWeight;

				if( xWeight === 0 ) {
					xWeight = Math.min(1, intXCounter);
				}

				if( xGain === 1 ) {
					xLoop++;
					xWeight = Math.min(1, intXCounter);
					xGain = 0;
				}

			}
			x++;
		}
		arrNewMatrix = mergeColumns( arrNewMatrix, arrMerge );
		arrFixedMatrix = mergeColumns( arrFixedMatrix, arrMerge );
	}

	var intYCounter = -1 * intProportionY / 2;
	if( intNewHeight > intHeight )
	{
		for( var y = 0 ; y < (intNewHeight ); )
		{
			intYCounter += intProportionY;

			while( intYCounter > 1 && ( y ) < ( intNewHeight ) )
			{
				console.log("loop line 1");
				arrNewMatrix = addLine( arrNewMatrix , y , 0 );
				arrFixedMatrix = addLine( arrFixedMatrix , y , 0 );
				intYCounter--;
				y++;
			}

			y++;
			intYCounter--;
		}  
		while( arrNewMatrix[0].length < (intNewHeight ) )
		{
			console.log("loop line 3");
			var intNewLine = arrNewMatrix[0].length - 1;
			arrNewMatrix = addLine( arrNewMatrix , intNewLine , 0 );
			arrFixedMatrix = addLine( arrFixedMatrix , intNewLine, 100 );
			y++;
		}
	} else {
		intYCounter = 0;
		var arrMerge = [];
		y = 0;
		var yLoop = 0;
		var yGain = 0;
		var yWeight = 1;
		var intProportionY =    intMatrixHeight / intNewHeight;

		while( y < ( intNewHeight ) ) 
		{
			intYCounter += intProportionY;

			while( intYCounter > 0 )
			{
				arrMerge.push( { yBefore: yLoop, yAfter: y, weight: yWeight } );
				intYCounter -= yWeight;
				yGain += yWeight;
				yWeight = 1 - yWeight;

				if( yWeight === 0 ) {
					yWeight = Math.min(1, intYCounter);
				}

				if( yGain === 1 ) {
					yLoop++;
					yWeight = Math.min(1, intYCounter);
					yGain = 0;
				}

			}
			y++;
		}
		arrNewMatrix = mergeLines( arrNewMatrix, arrMerge );
		arrFixedMatrix = mergeLines( arrFixedMatrix, arrMerge );
	}

//  return arrNewMatrix;
	var resultMatrix = loopSmooth(arrNewMatrix,arrFixedMatrix);
	debugMatrix( resultMatrix,arrFixedMatrix,strColor  );
	return resultMatrix;
}

function createMatrix( intWidth, intHeight , dblValue )
{
	var arrNewMatrix = Array();
	for( var x = 0; x < intWidth; x++ )
	{
		arrNewMatrix[x] = Array();
		for( var y = 0; y < intHeight; y++ )
		{
			arrNewMatrix[x][y] = dblValue;
		}
	}
	return arrNewMatrix;
}

function createVector( intSize , dblValue )
{
	arrVector = Array();
	for(var i = 0;i < intSize; i++ )
	{
		arrVector[i] = dblValue;
	}   
	return arrVector;
}

function addColumn( arrMatrix, intColumnPosition, dblValue )
{
	if( isNaN(dblValue ) )
	{
		throw new Error( "invalid value" );
	}

	window.bug = arrMatrix;
	var arrNewMatrix = Array();

	var xMatrix = 0;

	var intLoopCount = 0;

	for( var x = 0; x <= arrMatrix.length; x++ , xMatrix++ )
	{
		intLoopCount++;

		if( intLoopCount > 100 )
		{
			throw new Error( "something bad happened" );
		}

		if( x === intColumnPosition )
		{
			arrNewMatrix[x] = createVector( arrMatrix[0].length , dblValue );
			x++;
		}

		if( xMatrix < arrMatrix.length )
		{
			arrNewMatrix[x] = Array();
			var yMatrix = 0;
			for( var y = 0; y < arrMatrix[0].length; y++, yMatrix++ )
			{
				arrNewMatrix[x][y] = arrMatrix[xMatrix][yMatrix];
			}
		}
		
		if( xMatrix > arrMatrix.length )
		{
			throw new Error( "to distance to create column. Length:" +  arrMatrix.length + ", column:" + intColumnPosition );
		}
	}
	//console.log(drawMatrix(arrNewMatrix));
	return arrNewMatrix;    
}

function addLine( arrMatrix, intLinePosition, dblValue )
{
	var arrNewMatrix = Array();

	var xMatrix = 0;
	var intLoopCount = 0;

	for( var x = 0; x < arrMatrix.length; x++ , xMatrix++ )
	{
		arrNewMatrix[x] = Array();
		var yMatrix = 0;
		for( var y = 0; y <= arrMatrix[0].length; y++, yMatrix++ )
		{
			if( intLoopCount > 100 )
			{
				throw new Error( "something bad happened" );
			}

			if( y === intLinePosition )
			{
				arrNewMatrix[x][y] = dblValue;
				y++;
			}

			if( typeof arrMatrix[xMatrix][yMatrix] === "undefined" || arrMatrix[xMatrix][yMatrix] === null )
			{
				if( yMatrix === arrMatrix[xMatrix].length )
				{
					arrNewMatrix[x][y] = dblValue;
				}
				else
				{
					throw new Error( "Unable to find the original value in the matrix" );
				}
			}
			else
			{
				arrNewMatrix[x][y] = arrMatrix[xMatrix][yMatrix];
			}
		}
	}
	return arrNewMatrix;    
}

function compareMatrix( arrMatrixA , arrMatrixB )
{
	if( arrMatrixA.length !== arrMatrixB.length ) return false;
	if( arrMatrixA[0].length !== arrMatrixB[0].length ) return false;    
	for( var x = 0; x < arrMatrixA.length; x++ )
	{
		for( var y = 0; y < arrMatrixA[0].length; y++ )
		{
			if( arrMatrixA[x][y] !== arrMatrixB[x][y] ) return false;
		}
	}
	return true;
}

function loopSmooth( arrMatrix , arrFixedMatrix )
{
	arrNewMatrix = smoothMatrix( arrMatrix, arrFixedMatrix );
	var intCount = 0;
	while( compareMatrix( arrNewMatrix , arrMatrix ) === false )
	{
		intCount++;
		arrMatrix = arrNewMatrix;
		arrNewMatrix = smoothMatrix( arrMatrix, arrFixedMatrix );
		if( intCount > 500 )
		{
			//console.log( drawMatrix( arrNewMatrix ) );
			return arrNewMatrix;
			//throw new Error( "too complex" );
		}
	}
	return arrNewMatrix;
}

function smoothMatrix( arrMatrix , arrFixedMatrix )
{
	var arrNewMatrix = Array();
	var intWidth = arrMatrix.length;
	var intHeight = arrMatrix[0].length;
	var intMaxX = intWidth - 1;
	var intMaxY = intHeight - 1;
	for( var x = 0; x < arrMatrix.length; x++ )
	{
		arrNewMatrix[x] = Array();
		for( var y = 0; y < arrMatrix[0].length; y++ )
		{
			if( arrFixedMatrix[x][y] !== 1 )
			{
				/** -+ A    0+ B    ++ C
				 *  -0 D    00 E    +0 F
				 *  -- G    0- H    +- I
				 */
				var arrElements = Array();
				var arrVerticalElements = Array();

				// A -+
				if( x > 0 && y < intMaxY ) 
				{
					//console.log( "-+ " + "[" + (x-1) + "],[" + (y+1) + "]" + arrMatrix[x - 1 ][y + 1] );
					arrVerticalElements.push( arrMatrix[x - 1 ][y + 1] );
				}
				// B 0+
				if( y < intMaxY ) 
				{
					//console.log( "0+ " + "[" + (x) + "],[" + (y+1) + "]" + arrMatrix[x][y + 1] );
					arrElements.push( arrMatrix[x][y + 1] );
				}
				// C ++
				if( x < intMaxX && y < intMaxY ) 
				{
					//console.log( "++ " + "[" + (x+1) + "],[" + (y+1) + "]" + arrMatrix[x + 1 ][y + 1] );
					arrVerticalElements.push( arrMatrix[x + 1 ][y + 1] );
				}
				// D -0
				if( x > 0 ) 
				{
					//console.log( "-0" + "[" + (x-1) + "],[" + (y) + "]" + arrMatrix[x-1][y] );
					arrElements.push( arrMatrix[x-1][y] );
				}
				// E 00
				//console.log( "00" + arrMatrix[x][y] );
				arrElements.push( arrMatrix[x][y] );

				// F +0
				if( x < intMaxX ) 
				{
					//console.log( "+0" + "[" + (x+1) + "],[" + (y) + "]" + arrMatrix[x + 1][y] );
					arrElements.push( arrMatrix[x + 1][y] );
				}
				// G --
				if( x > 0 && y > 0 ) 
				{
					//console.log( "--" + "[" + (x-1) + "],[" + (y-1) + "]" + arrMatrix[x - 1 ][y - 1] );
					arrVerticalElements.push( arrMatrix[x - 1 ][y - 1] );
				}
				// H 0-
				if( y > 0 ) 
				{
					//console.log( "0-" + "[" + (x) + "],[" + (y-1) + "]" + arrMatrix[x][y - 1] );
					arrElements.push( arrMatrix[x][y - 1] );
				}
				// I +-             
				if( x < intMaxX && y > 0 ) 
				{
					//console.log( "+-" + "[" + (x+1) + "],[" + (y-1) + "]" + arrMatrix[x + 1 ][y - 1] );
					arrVerticalElements.push( arrMatrix[x + 1 ][y - 1] );
				}
				
				arrNewMatrix[x][y] = Math.round(
					(  ( 1000 * arrElements.sum() ) + ( 1000 * arrVerticalElements.sum() / 1.4142 ) )
					/
					(  ( arrElements.length ) + ( arrVerticalElements.length / 1.4142 ) )
				) / 1000;
				if( isNaN( arrNewMatrix[x][y] ) )
				{
					//console.log( "x:"+x+",y:"+y);
					//console.log( arrElements );
					//console.log( drawMatrix( arrMatrix ) );
					//console.log( arrMatrix );
					window.bug = arrMatrix;
					throw new Error( "That's why i hate javascript" );
				}
			}
			else
			{
				arrNewMatrix[x][y] = arrMatrix[x][y];
			}
		}
	}
	return arrNewMatrix;
}

function mergeColumns( arrMatrix, arrMerge ) 
{
	var arrNewMatrix = [];
	var totalWeight = 0;
	for( var i = 0; i < arrMerge.length; i++ )
	{
		var objMerge = arrMerge[ i ];
		for( var y = 0; y < arrMatrix[0].length; y++ )
		{
			if( arrNewMatrix[objMerge.xAfter] === undefined ) 
			{
				arrNewMatrix[objMerge.xAfter] = []
			}
			if( arrNewMatrix[objMerge.xAfter][y] === undefined )
			{
				arrNewMatrix[objMerge.xAfter][y] = []
			}

			if( y == 0 && objMerge.xAfter == 0 )
			{
				totalWeight += objMerge.weight;
			}
			if( arrMatrix[objMerge.xBefore] !== undefined )
			{
				var newValue = arrMatrix[objMerge.xBefore][y] * objMerge.weight;
				arrNewMatrix[objMerge.xAfter][y].push( newValue );
			}
		}
	}

	for( var x = 0; x < arrNewMatrix.length; x++ )
	{
		for( var y = 0; y < arrNewMatrix[0].length; y++ )
		{
			arrNewMatrix[x][y] = arrNewMatrix[x][y].sum() / totalWeight;
		}
	}
	return arrNewMatrix;
}

function mergeLines( arrMatrix, arrMerge ) 
{
	var arrNewMatrix = [];
	var totalWeight = 0;
	for( var i = 0; i < arrMerge.length; i++ )
	{
		var objMerge = arrMerge[ i ];
		for( var x = 0; x < arrMatrix.length; x++ )
		{
			if( arrNewMatrix[x] === undefined ) 
			{
				arrNewMatrix[x] = []
			}
			if( arrNewMatrix[x][objMerge.yAfter] === undefined )
			{
				arrNewMatrix[x][objMerge.yAfter] = []
			}

			if( x == 0 && objMerge.yAfter == 0 )
			{
				totalWeight += objMerge.weight;
			}
			if( arrMatrix[x][objMerge.yBefore] !== undefined )
			{
				var newValue = arrMatrix[x][objMerge.yBefore] * objMerge.weight;
				arrNewMatrix[x][objMerge.yAfter].push( newValue );
			}
		}
	}

	for( var x = 0; x < arrNewMatrix.length; x++ )
	{
		for( var y = 0; y < arrNewMatrix[0].length; y++ )
		{
			arrNewMatrix[x][y] = arrNewMatrix[x][y].sum() / totalWeight;
		}
	}
	return arrNewMatrix;
}