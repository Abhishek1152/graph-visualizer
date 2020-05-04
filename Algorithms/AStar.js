var closedList = [];
var cellDetails = [];
var predecessor = [];

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
	while(!openList.isEmpty())
	{
		var p = openList.dequeue();

		i = p.element[0];
		j = p.element[1];
		
		
		getCell(i, j).classList.add("animateVisited");

		var timeStamp = performance.now();
		await sleep(ms);
		totalTimeSlept += (performance.now() - timeStamp);

		closedList[i][j] = true;
		if(getCell(i, j).classList.contains("stop"))
		{
			drawShortestPath(predecessor);
			break;
		}

		var gNew, hNew, fNew;
		for(var k in neighbours)
		{
			if(isValidCell(i+neighbours[k].R, j+neighbours[k].C) 
				&& isPathforAStar(i+neighbours[k].R, j+neighbours[k].C))
			{
				if(!closedList[i+neighbours[k].R][j+neighbours[k].C])
				{
					gNew = parseInt(cellDetails[i][j].g) + (getCell(i, j).classList.contains("weight")? 5 : 1);
					hNew = Math.abs(stopRow-(i+neighbours[k].R)) + Math.abs(stopCol - (j+neighbours[k].C));
					fNew = gNew + hNew;

					if(cellDetails[i+neighbours[k].R][j+neighbours[k].C].f == INT_MAX
						|| cellDetails[i+neighbours[k].R][j+neighbours[k].C].f > fNew)
					{
						openList.enqueue([i+neighbours[k].R, j+neighbours[k].C], fNew);
						cellDetails[i+neighbours[k].R][j+neighbours[k].C].f = fNew;
						cellDetails[i+neighbours[k].R][j+neighbours[k].C].g = gNew;
						cellDetails[i+neighbours[k].R][j+neighbours[k].C].h = hNew;
						predecessor[i+neighbours[k].R][j+neighbours[k].C].r = i;
						predecessor[i+neighbours[k].R][j+neighbours[k].C].c = j;
					}
				}
			}
		}
	}
}


async function AStarUtil() 
{
	isRunning = true;
	clearAnimatedCells();

	var timeStamp0 = performance.now();
	totalTimeSlept = 0;

	for(var i=0; i<gridRows; i++) 
	{
	    dist[i] = [];
	    closedList[i] = [];
	    cellDetails[i] = [];
	    predecessor[i] = [];
	    found = true;

	    for(var j=0; j<gridCols; j++) 
	    {
	        dist[i][j] = Number.MAX_SAFE_INTEGER;
	        closedList[i][j] = false;
	        cellDetails[i][j] = {"f":Number.MAX_SAFE_INTEGER,
	        					 "g":Number.MAX_SAFE_INTEGER,
	        					 "h":Number.MAX_SAFE_INTEGER,
	        					 "parent_i": -1, "parent_j": -1};
	        predecessor[i][j] = {r: -1, c: -1};
	    }
	}

	await AStar();
	var timeStamp1 = performance.now();
	executionTime = (timeStamp1-timeStamp0) - totalTimeSlept;
}