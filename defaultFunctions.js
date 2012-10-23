Array.prototype.sum = function() {
	for (var i = 0, L = this.length, sum = 0; i < L; sum += this[i++]);
	return sum;
}

function expandMatrix( arrMatrix, intNewWidth, intNewHeight )
{
	var intMatrixWidth = arrMatrix.length;
	var intMatrixHeight = arrMatrix[0].length;
	var intProportionX =   intNewWidth / intMatrixWidth;
	var intProportionY =  intNewHeight / intMatrixHeight;

	arrNewMatrix = arrMatrix;
	arrFixedMatrix = createMatrix( intMatrixWidth, intMatrixHeight , 1 );
	var intXCounter = 0;
	intNewWidth--;
	for( var x = 0 ; x < intNewWidth; x++ )
	{
		//console.log("lidando com a coluna " + x );
		if( intXCounter > 1 )
		{
			arrNewMatrix = addColumn( arrNewMatrix , x  , 0 );
			if( isNaN( arrNewMatrix.length ) )
			{
				throw new Error( "add column crashed" );
			}
			arrFixedMatrix = addColumn( arrFixedMatrix , x , 0 );
			intXCounter--;
		}
		else
		{
			intXCounter += intProportionX;
		}
		/*
		while( intXCounter >= 1 && x < intNewWidth )
		{
			intXCounter--;
			//console.log("lidando com a coluna " + x );
			arrNewMatrix = addColumn( arrNewMatrix , x  , 0 );
			arrFixedMatrix = addColumn( arrFixedMatrix , x , 0 );
			x++;
		}
		intXCounter += intProportionX;
		*/
	}
	if( isNaN( arrNewMatrix.length ) )
	{
		throw new Error( "add column crashed" );
	}
	while( arrNewMatrix.length < ( intNewWidth + 1 ) )
	{
		var intNewColumn = arrNewMatrix.length;
		//console.log("lidando com a coluna " + intNewColumn ) ;
		arrNewMatrix = addColumn( arrNewMatrix , intNewColumn , 0 );
		arrFixedMatrix = addColumn( arrFixedMatrix , intNewColumn , 0 );
		if( isNaN( arrNewMatrix.length ) )
		{
			throw new Error( "add column crashed" );
		}
	}
	//console.log( "length of new matrix is " + arrNewMatrix.length );
	//console.log( "target is " + intNewWidth );

	var intYCounter = 0;
	intNewHeight--;
	for( var y = 0 ; y < intNewHeight; y++ )
	{
		console.log( "lidando com a linha " + y );
		while( intYCounter >= 1 && y < intNewHeight )
		{

			intYCounter--;
			arrNewMatrix = addLine( arrNewMatrix , y , 0 );
			arrFixedMatrix = addLine( arrFixedMatrix , y , 0 );
			y++;
		}
		intYCounter += intProportionY;
	}	
	while( arrNewMatrix[0].length < (intNewHeight + 1 ) )
	{
		var intNewLine = arrNewMatrix[0].length;
		console.log( "lidando com a linha " + intNewLine );
		arrNewMatrix = addLine( arrNewMatrix , intNewLine , 0 );
		arrFixedMatrix = addLine( arrFixedMatrix , intNewLine, 100 );
	}

	console.log( drawMatrix( arrNewMatrix ) );
//	return arrNewMatrix;
	return loopSmooth(arrNewMatrix,arrFixedMatrix);
}

function drawMatrix( arrMatrix )
{
	var strReturn = "";
	for( var x = 0; x < arrMatrix.length; x++ )
	{
		var arrColumn = arrMatrix[x];
		strReturn += "[";
		for( var y = 0; y < arrColumn.length; y++ )
		{
			strReturn += "\t("+x+","+y+")"+arrColumn[y] + ",";
		}
		strReturn += "]\n";
	}

	return strReturn;
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

		//console.log( "x = " + x + " posicao = " + intColumnPosition + " length = " + arrMatrix.length );
		if( x == intColumnPosition )
		{
			//console.log( "add new column" );
			arrNewMatrix[x] = createVector( arrMatrix[0].length , dblValue );
			x++;
		}

		if( xMatrix < arrMatrix.length )
		{
			//console.log("copy old column");
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

			if( y == intLinePosition )
			{
				arrNewMatrix[x][y] = dblValue;
				y++;
			}

			if( typeof arrMatrix[xMatrix][yMatrix] == "undefined" || arrMatrix[xMatrix][yMatrix] == null )
			{
				if( yMatrix == arrMatrix[xMatrix].length )
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
	if( arrMatrixA.length != arrMatrixB.length ) return false;
	if( arrMatrixA[0].length != arrMatrixB[0].length ) return false;	
	for( var x = 0; x < arrMatrixA.length; x++ )
	{
		for( var y = 0; y < arrMatrixA[0].length; y++ )
		{
			if( arrMatrixA[x][y] != arrMatrixB[x][y] ) return false;
		}
	}
	return true;
}

function loopSmooth( arrMatrix , arrFixedMatrix )
{
	arrNewMatrix = smoothMatrix( arrMatrix, arrFixedMatrix );
	var intCount = 0;
	while( compareMatrix( arrNewMatrix , arrMatrix ) == false )
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
			if( arrFixedMatrix[x][y] == 0 )
			{
				/**	-+ A	0+ B	++ C
				 *	-0 D	00 E	+0 F
				 * 	-- G	0- H	+- I
				 */
				var arrElements = Array();

				// A -+
				if( x > 0 && y < intMaxY ) 
				{
					//console.log( "-+ " + "[" + (x-1) + "],[" + (y+1) + "]" + arrMatrix[x - 1 ][y + 1] );
					arrElements.push( arrMatrix[x - 1 ][y + 1] );
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
					arrElements.push( arrMatrix[x + 1 ][y + 1] );
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
					arrElements.push( arrMatrix[x - 1 ][y - 1] );
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
					arrElements.push( arrMatrix[x + 1 ][y - 1] );
				}
				
				arrNewMatrix[x][y] = Math.round( 1000 * arrElements.sum() / arrElements.length ) / 1000;
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
