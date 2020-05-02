const neigh = [{R: 1, C: 0}, {R: 0, C: 1}, {R: -1, C: 0}, {R: 0, C: -1}];

/*
** Standard recursive Depth First Search algorithm
*/
function DepthFirstSearch(row, col)
{
	// Reached goal
	if(getCell(row, col).classList.contains("stop"))
	{
		found = true;
		return;
	}

	visited[row][col] = true;

	pathToAnimate.push({r: row, c: col});
	
	// Recursively checking all the neighbours
	for(var i in neigh)
	{
		if(!found && isValidCell(row+neigh[i].R, col+neigh[i].C) && isPath(row+neigh[i].R, col+neigh[i].C))
		{
			pathDistance[row+neigh[i].R][col+neigh[i].C] = pathDistance[row][col]+1;
			predecessor[row+neigh[i].R][col+neigh[i].C].r = row;
			predecessor[row+neigh[i].R][col+neigh[i].C].c = col;
			DepthFirstSearch(row+neigh[i].R, col+neigh[i].C);
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
	isRunning = false;
}