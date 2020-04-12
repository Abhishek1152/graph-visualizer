let grid = document.querySelector("#gridContainer"), isDragging = false, draggingStartCell = false, draggingStopCell = false;
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
			e.target.classList.remove("animateCell");
			if(e.target.classList.contains("wall"))
				e.target.classList.remove("wall");
			else
				e.target.classList.add("wall");
		}

		isDragging = true;
		
	}
}

grid.onmouseup = grid.onmouseleave = function() 
{
	isDragging = false;
	draggingStartCell = false;
	draggingStopCell = false;
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
			e.target.classList.remove("animateCell");
			e.target.classList.remove("wall");
			e.target.classList.add("start");
			// Change start row and col
			return;
		}
		if(draggingStopCell)
		{
			prevStart = document.getElementsByClassName("stop");
			prevStart[0].classList.remove("stop");
			e.target.classList.remove("animateCell");
			e.target.classList.remove("wall");
			e.target.classList.add("stop");
			// change stop row and col
			return;
		}

		if(e.target == getCell(startRow, startCol) || e.target == getCell(stopRow, stopCol))
			return;
		e.target.classList.remove("animateCell");
		if(e.target.classList.contains("wall"))
			e.target.classList.remove("wall");
		else
			e.target.classList.add("wall");

	}
}
