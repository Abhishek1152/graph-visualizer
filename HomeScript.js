const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var gridCols = Math.ceil(vw/26), gridRows = Math.floor(vh-140)/26;
var found = false;
const WALLCOLOR = "black", STARTCOLOR = "red", STOPCOLOR="green", VISITEDCOLOR="magenta", CURRENTCOLOR="yellow"; 
// Try to implement arrow direction
var isRunning = false, ms = 10;
var startRow = Math.floor(gridRows/2), startCol = Math.floor(1/5*gridCols), 
stopRow = Math.floor(gridRows/2), stopCol = Math.ceil(4/5*gridCols);

function sleep(ms) 
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getCell(row, col)
{
	return document.querySelector(".row:nth-child("+(row+1)+") .gridsquare:nth-child("+(col+1)+")");
}

function genDivs(rows, cols)
{ 
	var e = document.getElementById("gridContainer");
	for(var r = 0; r < rows; r++)
	{ 
		var row = document.createElement("div"); 
		row.className = "row";
		for(var c = 0; c < cols; c++)
		{ 
			var cell = document.createElement("div"); 
			cell.className = "gridsquare"; 

			if(r == startRow && c == startCol)
				cell.classList.add("start");
			
			else if(r == stopRow && c == stopCol)
				cell.classList.add("stop");
		    
		    row.appendChild(cell); 
		} 
		e.appendChild(row); 
	}
}


function clearGrid()
{
	for(var i=0; i<gridRows; i++) 
	{
	    for(var j=0; j<gridCols; j++) 
	        getCell(i, j).classList.remove("animateCell");
	}
}

genDivs(gridRows, gridCols);
document.getElementById("gridContainer").style.left = (vw-document.getElementById("gridContainer").offsetWidth)/2+"px";