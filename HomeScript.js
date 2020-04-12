var gridCols = 60, gridRows = 20;
gridContainer.style.left = (screen.width-25*gridCols)/screen.width * 50+"%";
var found = false;
const WALLCOLOR = "black", STARTCOLOR = "red", STOPCOLOR="green", VISITEDCOLOR="magenta", CURRENTCOLOR="yellow"; 
// Try to implement arrow direction
var isRunning = false, ms = 10;
var startRow = 10, startCol = 20, stopRow = 10, stopCol = 40;

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
	for(var i=0; i<20; i++) 
	{
	    for(var j=0; j<60; j++) 
	    {
	    	if(getCell(i, j).classList.contains("wall"))
	    		continue;
	    	if(i == startRow && j == startCol)
	        	getCell(i, j).classList.add("start");
	        else if(i == stopRow && j == stopCol)
	        	getCell(i, j).classList.add("stop");
	        else 
	        	getCell(i, j).classList.add("gridsquare");
	        getCell(i, j).classList.remove("animateCell");
	    }

	}
}

genDivs(gridRows, gridCols);

