<?php
/** 
 * @author Thiago Mata <thiago.henrique.mata@gmail.com>
 * @date 2012-10-15
 *
 * This file generate the javascrit files with the 
 * function to calculate the heavy of some image.
 * This will be used to make the image detector be
 * able to deal with rotated images.
 *
 * Ps - This file is a temporay version, in test and stuff..
 *      Maybe it will be forget after generate the js files.
 *      So, this code is not really that pretty.
 */


/**
 * Create the Matrix (probaly there is 
 * some way too more smart to do so)
 * @param integer width 
 * @param integer height
 * @return integer[][]
 */
function createMatrix( $intWidth, $intHeight )
{
	$arrMatrix = array();
	for( $intX = 0; $intX < $intWidth; $intX++ ) {
		if( !array_key_exists( $intX , $arrMatrix ) ) $arrMatrix[ $intX ] = array();
		for( $intY = 0; $intY < $intHeight; $intY++ ) {
			$arrMatrix[ $intX ][ $intY ] = 0;
		}
	}
	return $arrMatrix;
}


/**
 * Draw on html version of the matrix.
 * Good to debug
 * @param integer[][]
 * @return string
 */
function drawMatrix( $arrMatrix )
{
$strHtml = '
<html><head>
<style>
	* {
		padding: 0px;
		margin: 0px;
		border: 0px;
	}
	div {
		clear: both;
	}
	span {
		width: 4px;
		height: 4px;
		float: left;
	}
	.element , .element0 {
		background-color: red;
	}
	.element1 {
		background-color: yellow;
	}
	.element2 {
		background-color: green;
	}
	.element2 {
		background-color: blue;
	}
</style></head><body>';

	foreach( $arrMatrix as $intX => $arrLine ) {
		$strHtml .= "<div>";
		foreach( $arrLine as $intNum ) {
			if( $intNum == 0 )
				$strHtml .= "<span style='background-color:rgb(0,0,0)'></span>";
			else
				$strHtml .= "<span style='background-color:rgb(0,0," . (255 - 3*$intNum) . ")'></span>";
		} 
		$strHtml .= "</div>";
	}
	$strHtml .= "</body></html>";
	return $strHtml;
}

/**
 * Create the javascript definition of some matrix
 *
 * @param integer[][]
 * @return string
 */
function codeMatrix( $arrMatrix )
{
	$arrCodeLine = array();
	foreach( $arrMatrix as $intX => $arrLine ) {
		$arrCodeLine[] = "[" . implode( "," , $arrLine ) . "]";
	}
	return "[" . implode( "],\n[" , $arrCodeLine ) . "]";
}


/**
 * Change all the elements into the circle to the new value
 *
 * @param integer center x
 * @param integer center y
 * @param integer radius
 * @param integer[][] matrix inout
 * @param [integer new value]
 *
 */
function makeCircle( $intCenterX , $intCenterY , $intRadius , &$arrMatrix , $func = null  ) 
{
	foreach( $arrMatrix as $intX => $arrLine ) {
		foreach( $arrLine as $intY => $intElement ) {
			$intDistX = pow( $intX - $intCenterX , 2 );
			$intDistY = pow( $intY - $intCenterY , 2 );
			$intDistance = round( sqrt( $intDistX + $intDistY ) );
			if ( $intDistance <= $intRadius  ) {
				if( $func == null ) {
					$arrMatrix[ $intX ][ $intY ] = $intDistance;
				} else {
					$arrMatrix[ $intX ][ $intY ] = $func( $arrMatrix[ $intX ][ $intY ] );
				}
			}
		}
	}
}

/**
 * Get a list of pointers of the external circle based on x,y and radius
 *
 * @param integer center x
 * @param integer center y
 * @param integer radius
 * @param integer[][] matrix inout
 * @param integer pen
 * @return Pointers[]
 * 
 */
function getCircleLine( $intCenterX , $intCenterY , $intRadius , &$arrMatrix , $intPen = 2 ) 
{
	$arrPointers = array();
	foreach( $arrMatrix as $intX => $arrLine ) {
		foreach( $arrLine as $intY => $intElement ) {
			$intDistX = pow( $intX - $intCenterX , 2 );
			$intDistY = pow( $intY - $intCenterY , 2 );
			$intDistance = round( sqrt( $intDistX + $intDistY ) );
			if ( ( abs ( $intDistance - $intRadius  ) ) <= $intPen ) {
				$arrPoint = array();
				$arrPoint["x"] = $intX;
				$arrPoint["y"] = $intY;
				$arrPointers[] = $arrPoint;
			}
		}
	}
	return $arrPointers;
} 

/**
 * Using sin and cos to generate the n equidistant points in circle border
 * @param integer center x
 * @param integer center y
 * @param integer radius
 * @param integer num pointer
 * return Pointer[]
 */
function getCirclePointers( $intCenterX , $intCenterY , $intRadius , $intNumPointer )
{
	$intStep = 2*pi()/$intNumPointer;
	$intCurrent = 0;
	$arrPointers = array();

	for( $intCount = 0; $intCount < $intNumPointer; $intCount++ )
	{
		$intXValue = round( cos( $intCurrent ) * $intRadius );
		$intYValue = round( sin( $intCurrent ) * $intRadius );
		$intX = $intCenterX + $intXValue;
		$intY = $intCenterY + $intYValue;
		$intCurrent += $intStep;
		$arrPoint = array();
		$arrPoint["x"] = $intX;
		$arrPoint["y"] = $intY;
		$arrPointers[] = $arrPoint;
	}
	return $arrPointers;
}

/**
 * Create the javascript function code to get the heavy of
 * the image in some angle
 *
 * @param integer[][] inout matrix
 * @param integer key
 * @return string
 */
function makeNumber( &$arrMatrix , $intKey )
{
	$arrCommand = array();
	$arrEnd = array();
	foreach( $arrMatrix as $intX => $arrLine ) {
		foreach( $arrLine as $intY => $intNum ) {
			if( $intNum != 0 ) {
				$arrCommand[] = sprintf("m[%3d][%3d]",$intX,$intY);
			}
			if( sizeof( $arrCommand ) > 6 ){
				$arrEnd[] =  implode( " + " , $arrCommand );
				$arrCommand = array();
			}
		} 
	}
	$strCommand = "
function getHeavyBasedOnAngle{$intKey}(m){
	return 0 + \n";
	$strCommand .= implode( " + \n" , $arrEnd );
	$strCommand .= "\n}";	
	return $strCommand;
}

/**
 * Create the javascript functions to calculate the heavy of each pointer
 * and the debug files
 *
 * @param integer old width
 * @param integer old heigth
 * @param integer num pointers
 * @return void
 */
function createJsHeavyFiles( $intOldWidth , $intOldHeight , $intNumPointer = 36)
{
	$intBigSize = max( $intOldWidth , $intOldHeight );

	/**
	 * Big rotated screen
	 */
	$intWidth  = ceil( $intBigSize * sqrt(2) );
	$intHeight = ceil( $intBigSize * sqrt(2) );

	/**
	 * Center of the big screen
	 */
	$intCenterX = ( $intWidth / 2 ) - 0.5;
	$intCenterY = ( $intWidth / 2 ) - 0.5;

	/**
	 * Create the matrix
	 */
	$arrMatrix = createMatrix( $intWidth, $intHeight );
	$intRadius = ceil( max( $intWidth, $intHeight ) / 2 ) - 10;

	/**
	 * Get the $intNumPointer equidistant pointers
	 */
	$arrPointers = getCirclePointers( $intCenterX , $intCenterY , $intRadius , $intNumPointer );

	/**
	 * Generate the javascript file with the function and the 
	 * debug file for each pointer
	 */
	file_put_contents( "getHeavyFuncions.js" , "" );
	foreach( $arrPointers as $intCounter => $arrPoint )
	{
		$arrCopy = $arrMatrix;
		++$arrCopy[ $arrPoint[ "x" ] ][ $arrPoint[ "y" ] ];
		makeCircle( $arrPoint[ "x" ] , $arrPoint[ "y" ] , $intRadius , $arrCopy );
		$strCommand = makeNumber( $arrCopy  , $intCounter );
		file_put_contents( "getHeavyFuncions.js" , $strCommand , FILE_APPEND );
		print $intCounter . " ok <br/>\n";
		$strOut = drawMatrix( $arrCopy );
		file_put_contents( "Angle$intCounter.html" , $strOut );
		flush();
	}
}

createJsHeavyFiles( 100, 100);
