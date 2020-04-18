var closedList = [];
var cellDetails = [];

function isPathforAStar(row, col)
{
	return (!closedList[row][col] && !getCell(row, col).classList.contains("wall") 
		|| getCell(row, col).classList.contains("stop"));
}

async function AStar()
{
	// Check if source is same as destination
	var i = startRow, j = startCol;
	cellDetails[i][j].f = 0;
	cellDetails[i][j].g = 0;
	cellDetails[i][j].h = 0;
	cellDetails[i][j].parent_i = i;
	cellDetails[i][j].parent_j = j;

	var openList = new PriorityQueue();
	openList.enqueue([i, j], 1);
	var foundDest = false;
	while(!openList.isEmpty())
	{
		var p = openList.dequeue();

		i = p.element[0];
		j = p.element[1];
		console.log(i+" "+j);
		console.log(openList.printPQueue());
		console.log("\n");
		currentCell = getCell(i, j);
		await sleep(ms);
		currentCell.classList.add("animateCell");
		await sleep(ms);
		closedList[i][j] = true;

		var gNew, hNew, fNew;
		if(isValidCell(i+1, j) && isPathforAStar(i+1, j))
		{
			if(getCell(i+1, j).classList.contains("stop"))
				break; // Trace path not enqueueed
			else if(!closedList[i+1][j])
			{
				gNew = cellDetails[i][j].g + 1;//getCell(i+1, j).classList.contains("weight")? 5 : 1;
				hNew = Math.abs(stopRow-(i+1)) + Math.abs(stopCol - j);
				fNew = gNew + hNew;

				if(cellDetails[i+1][j].f == Number.MAX_SAFE_INTEGER
					|| cellDetails[i+1][j].f > fNew)
				{
					openList.enqueue([i+1, j], fNew);
					cellDetails[i+1][j].f = fNew;
					cellDetails[i+1][j].g = gNew;
					cellDetails[i+1][j].h = hNew;
					cellDetails[i+1][j].parent_i = i;
					cellDetails[i+1][j].parent_j = j;
				}
			}
		}
		if(isValidCell(i-1, j) && isPathforAStar(i-1, j))
		{
			if(getCell(i-1, j).classList.contains("stop"))
				break; // Trace path not enqueueed
			else if(!closedList[i-1][j])
			{
				gNew = cellDetails[i][j].g + 1;//getCell(i-1, j).classList.contains("weight")? 5 : 1;
				hNew = Math.abs(stopRow-(i-1)) + Math.abs(stopCol - j);
				fNew = gNew + hNew;

				if(cellDetails[i-1][j].f == Number.MAX_SAFE_INTEGER
					|| cellDetails[i-1][j].f > fNew)
				{
					openList.enqueue([i-1, j], fNew);
					cellDetails[i-1][j].f = fNew;
					cellDetails[i-1][j].g = gNew;
					cellDetails[i-1][j].h = hNew;
					cellDetails[i-1][j].parent_i = i;
					cellDetails[i-1][j].parent_j = j;
				}
			}
		}
		if(isValidCell(i, j+1) && isPathforAStar(i, j+1))
		{
			if(getCell(i, j+1).classList.contains("stop"))
				break; // Trace path not enqueued
			else if(!closedList[i][j+1])
			{
				gNew = cellDetails[i][j].g + 1;//getCell(i, j+1).classList.contains("weight")? 5 : 1;
				hNew = Math.abs(stopRow-i) + Math.abs(stopCol - (j+1));
				fNew = gNew + hNew;

				if(cellDetails[i][j+1].f == Number.MAX_SAFE_INTEGER
					|| cellDetails[i][j+1].f > fNew)
				{
					openList.enqueue([i, j+1], fNew);
					cellDetails[i][j+1].f = fNew;
					cellDetails[i][j+1].g = gNew;
					cellDetails[i][j+1].h = hNew;
					cellDetails[i][j+1].parent_i = i;
					cellDetails[i][j+1].parent_j = j;
				}
			}
		}
		if(isValidCell(i, j-1) && isPathforAStar(i, j-1))
		{
			if(getCell(i, j-1).classList.contains("stop"))
				break; // Trace path not enqueueed
			else if(!closedList[i][j-1])
			{
				gNew = cellDetails[i][j].g + 1;//getCell(i, j-1).classList.contains("weight")? 5 : 1;
				hNew = Math.abs(stopRow-i) + Math.abs(stopCol - (j-1));
				fNew = gNew + hNew;

				if(cellDetails[i][j-1].f == Number.MAX_SAFE_INTEGER
					|| cellDetails[i][j-1].f > fNew)
				{
					openList.enqueue([i, j-1], fNew);
					cellDetails[i][j-1].f = fNew;
					cellDetails[i][j-1].g = gNew;
					cellDetails[i][j-1].h = hNew;
					cellDetails[i][j-1].parent_i = i;
					cellDetails[i][j-1].parent_j = j;
				}
			}
		}
	}
}


async function AStarUtil() 
{
	isRunning = true;
	clearAnimatedCells();
	for(var i=0; i<gridRows; i++) 
	{
	    dist[i] = [];
	    closedList[i] = [];
	    cellDetails[i] = [];
	    for(var j=0; j<gridCols; j++) 
	    {
	        dist[i][j] = Number.MAX_SAFE_INTEGER;
	        closedList[i][j] = false;
	        cellDetails[i][j] = {"f":Number.MAX_SAFE_INTEGER,
	        					 "g":Number.MAX_SAFE_INTEGER,
	        					 "h":Number.MAX_SAFE_INTEGER,
	        					 "parent_i": -1, "parent_j": -1};
	    }
	}

	await AStar();
	isRunning = false;

}