const neigh = [{R: 1, C: 0}, {R: 0, C: 1}, {R: -1, C: 0}, {R: 0, C: -1}];

/*
** Standard recursive Depth First Search algorithm
*/
async function DepthFirstSearch(row, col)
{
	// Reached goal
	if(getCell(row, col).classList.contains("stop"))
	{
		drawShortestPath(predecessor);
		found = true;
		return;
	}

	visited[row][col] = true;

	getCell(row, col).classList.add("animateCell");
	await sleep(ms);
	
	// Recursively checking all the neighbours
	for(var i in neigh)
	{
		if(!found && isValidCell(row+neigh[i].R, col+neigh[i].C) && isPath(row+neigh[i].R, col+neigh[i].C))
		{
			pathDistance[row+neigh[i].R][col+neigh[i].C] = pathDistance[row][col]+1;
			predecessor[row+neigh[i].R][col+neigh[i].C].r = row;
			predecessor[row+neigh[i].R][col+neigh[i].C].c = col;
			await DepthFirstSearch(row+neigh[i].R, col+neigh[i].C);
		}
	}
}


/*
** Utlity function of DFS to initialize values and grid
*/
function DFSUtil()
{
	isRunning = true;
	clearAnimatedCells();

	var timeStamp0 = performance.now();

	found = false;
	visited.length = 0;
	pathDistance.length = 0;
	predecessor.length = 0;

	for(var i=0; i<gridRows; i++) 
	{
	    visited[i] = [];
	    pathDistance[i] = [];
	    predecessor[i] = [];
	    for(var j=0; j<gridCols; j++) 
	    {
	    	pathDistance[i][j] = INT_MAX;
	        predecessor[i][j] = {r: -1, c: -1};
	        visited[i][j] = false;
	    }
	}

	DepthFirstSearch(startRow, startCol);
	var timeStamp1 = performance.now();
	executionTime = (timeStamp1-timeStamp0);
}