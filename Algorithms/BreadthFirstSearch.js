/*
** Standard iterative Breadth First Search algorithm
*/
async function BreadthFirstSearch()
{
	var Queue = [];
	
	visited[startRow][startCol] = true;
	pathDistance[startRow][startCol] = 0;
	Queue.push([startRow, startCol]);

	while(Queue.length != 0)
	{
		var row = Queue[0][0], col = Queue[0][1];

		getCell(row, col).classList.add("animateVisited");
		// Reached goal
		if(getCell(row, col).classList.contains("stop"))
		{
			drawShortestPath(predecessor);
			break;
		}

		

		var timeStamp = performance.now();
		await sleep(ms);
		totalTimeSlept += (performance.now() - timeStamp);
		
		Queue.splice(0, 1);

		// Checking for all valid neighbours
		for(var i in neighbours)
		{
			if(isValidCell(row+neighbours[i].R, col+neighbours[i].C) && isPath(row+neighbours[i].R, col+neighbours[i].C))
			{
				visited[row+neighbours[i].R][col+neighbours[i].C] = true;
				predecessor[row+neighbours[i].R][col+neighbours[i].C].r = row;
				predecessor[row+neighbours[i].R][col+neighbours[i].C].c = col;
				Queue.push([row+neighbours[i].R, col+neighbours[i].C]);
			}
		}
	}
}


/*
** Utlity function of BFS to initialize values and grid
*/
async function BFSUtil()
{
	isRunning = true;
	clearAnimatedCells();

	var timeStamp0 = performance.now();
	totalTimeSlept = 0;

	visited.length = 0;
	pathDistance.length = 0;
	predecessor.length = 0;
	found = false;

	for(var i=0; i<gridRows; i++) 
	{
	    visited[i] = [];
	    pathDistance[i] = [];
	    predecessor[i] = [];
	    for(var j=0; j<gridCols; j++) 
	    {
	        visited[i][j] = false;
	        pathDistance[i][j] = INT_MAX;
	        predecessor[i][j] = {r: -1, c: -1};
	    }
	}
	
	await BreadthFirstSearch();
	var timeStamp1 = performance.now();
	executionTime = (timeStamp1-timeStamp0) - totalTimeSlept;
}