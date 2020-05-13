var closedList = [];
var cellDetails = [];
var predecessor = [];

/*
** @param - row: 0 base row index of a cell
** @param - col: 0 base column index of a cell
** @return: A boolean value true signifying the cell is walkable, false otherwise
*/
function isPathforAStar(row, col)
{
	return (!closedList[row][col] && !getCell(row, col).classList.contains("wall") 
		|| getCell(row, col).classList.contains("stop"));
}


async function AStar()
{
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
		
		// If showAnimations is false (when we are comparing algo), there is no need to animate cells
		if(showAnimations)
		{
			var timeStamp = performance.now();
			getCell(i, j).classList.add("animateVisited");
			await sleep(ms);
			totalTimeSlept += (performance.now() - timeStamp);
		}

		closedList[i][j] = true;

		// Path found
		if(getCell(i, j).classList.contains("stop"))
		{	
			found = true;
			if(showAnimations)
				drawShortestPath(predecessor);
			
			break;
		}

		// New g, h, f value to be calculated
		var gNew, hNew, fNew;
		for(var k in neighbours)
		{
			if(isValidCell(i+neighbours[k].R, j+neighbours[k].C) 
				&& isPathforAStar(i+neighbours[k].R, j+neighbours[k].C))
			{
				if(!closedList[i+neighbours[k].R][j+neighbours[k].C])
				{
					// If current cell contains weight add 5 else it is empty unvisited cell so add 1
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

/*
** Utlity function of A* to initialize values and grid
*/
async function AStarUtil() 
{
	isRunning = true;
	clearAnimatedCells();

	var timeStamp0 = performance.now();
	totalTimeSlept = 0;
	found = false;

	for(var i=0; i<gridRows; i++) 
	{
	    dist[i] = [];
	    closedList[i] = [];
	    cellDetails[i] = [];
	    predecessor[i] = [];

	    for(var j=0; j<gridCols; j++) 
	    {
	        dist[i][j] = INT_MAX;
	        closedList[i][j] = false;
	        cellDetails[i][j] = {"f":INT_MAX,
	        					 "g":INT_MAX,
	        					 "h":INT_MAX,
	        					 "parent_i": -1, 
	        					 "parent_j": -1};
	        predecessor[i][j] = {r: -1, c: -1};
	    }
	}

	await AStar();

	var timeStamp1 = performance.now();
	executionTime = (timeStamp1-timeStamp0) - totalTimeSlept;
	if(!showAnimations && found)
		drawShortestPath(predecessor);
	if(!found)
    	isRunning = false;
}