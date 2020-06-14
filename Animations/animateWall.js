var grid = document.querySelector("#gridContainer"), isDragging = false, draggingStartCell = false, draggingStopCell = false;
var prevMS;


function getRowandCol(e)
{
	for(var i=0; i<gridRows; i++) 
	{
	    for(var j=0; j<gridCols; j++) 
	        if(e == getCell(i, j))
	        	return [i, j];
	}
}

grid.onmousedown = function(e) 
{
	if(e.target.nodeName === "DIV" && !e.target.id && !e.target.classList.contains("row") && !isRunning) 
	{
		if(e.target == getCell(startRow, startCol))
			draggingStartCell = true;
		
		else if(e.target == getCell(stopRow, stopCol))
			draggingStopCell = true;
		
		else
		{
			e.target.classList.remove("animateVisited");
			e.target.classList.remove("animatePath");
			if(isWall)
			{
				if(e.target.classList.contains("wall"))
					e.target.classList.remove("wall");
				else
				{
					e.target.classList.remove("weight");
					e.target.classList.add("wall");
				}
			}
			else
			{
				if(e.target.classList.contains("weight"))
					e.target.classList.remove("weight");
				else
				{
					e.target.classList.remove("wall");
					e.target.classList.add("weight");
				}
			}
		}

		isDragging = true;
		prevMS = ms;
		ms = 0;
		
	}
}

grid.onmouseup = grid.onmouseleave = function() 
{
	isDragging = false;
	draggingStartCell = false;
	draggingStopCell = false;
	ms = prevMS;
}

document.body.ondragstart = function(e) 
{
	e.preventDefault();
}

grid.onmouseover = function(e) 
{
	if (isDragging && e.target.nodeName === "DIV" && !e.target.classList.contains("row") && !e.target.id && !isRunning) 
	{
		if(draggingStartCell)
		{
			prevStart = document.getElementsByClassName("start");
			prevStart[0].classList.remove("start");
			e.target.classList.add("start");
			var temp = getRowandCol(e.target);
			startRow = temp[0], startCol = temp[1];
		
			// TODO : Work on instant shortest path
			return;
		}
		if(draggingStopCell)
		{
			prevStart = document.getElementsByClassName("stop");
			prevStart[0].classList.remove("stop");
			e.target.classList.add("stop");
			// Try scaling the below two lines
			var temp = getRowandCol(e.target);
			stopRow = temp[0], stopCol = temp[1];
			// TODO : Work on instant shortest path
			return;
		}

		if(e.target == getCell(startRow, startCol) || e.target == getCell(stopRow, stopCol))
			return;
		e.target.classList.remove("animateVisited");
		e.target.classList.remove("animatePath");
		if(isWall)
		{
			if(e.target.classList.contains("wall"))
				e.target.classList.remove("wall");
			else
			{
				e.target.classList.remove("weight");
				e.target.classList.add("wall");
			}
		}
		else
		{
			if(e.target.classList.contains("weight"))
				e.target.classList.remove("weight");
			else
			{
				e.target.classList.remove("wall");
				e.target.classList.add("weight");
			}
		}

	}
}
