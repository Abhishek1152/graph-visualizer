var visited = [];
var predecessor = [];

function isValidCell(row, col)
{
	return (row >= 0 && row < gridRows && col >= 0 && col < gridCols);
}

async function BestFirstSearch()
{
	var priorityQueue = new PriorityQueue();
	priorityQueue.enqueue([startRow, startCol], 1);
	visited[startRow][startCol] = true;

	while(!priorityQueue.isEmpty())
	{
		var temp = priorityQueue.dequeue();
		var row = temp.element[0], col = temp.element[1];
		if(showAnimations)
		{
			var timeStamp = performance.now();
			Matrix[row][col].classList.add("animateVisited");
			await sleep(ms);
			totalTimeSlept += (performance.now() - timeStamp);
		}

		if(Matrix[row][col].classList.contains("stop"))
		{
			found = true;
			if(showAnimations)
				drawShortestPath(predecessor);
			break;
		}
		
		for(var i in neighbours)
		{
			if(isValidCell(row+neighbours[i].R, col+neighbours[i].C) 
				&& isPath(row+neighbours[i].R, col+neighbours[i].C))
			{
				visited[row+neighbours[i].R][col+neighbours[i].C] = true;
				var priority = Math.abs(stopRow-(row+neighbours[i].R)) + Math.abs(stopCol - (col+neighbours[i].C));
				var weight = (Matrix[row+neighbours[i].R][col+neighbours[i].C].classList.contains("weight")? 5 : 1);
				predecessor[row+neighbours[i].R][col+neighbours[i].C].r = row;
				predecessor[row+neighbours[i].R][col+neighbours[i].C].c = col;
				priorityQueue.enqueue([row+neighbours[i].R, col+neighbours[i].C], weight+priority);
			}
		}
	}
}



async function BestFirstSearchUtil()
{
	isRunning = true;
	clearAnimatedCells();

	var timeStamp0 = performance.now();
	totalTimeSlept = 0;

	found = false;
	for(var i=0; i<gridRows; i++) 
	{
	    visited[i] = [];
	    predecessor[i] = [];
	    for(var j=0; j<gridCols; j++) 
	    {
	    	predecessor[i][j] = {r: -1, c: -1};
	        visited[i][j] = false;
	    }
	}
	 
	await BestFirstSearch();
	var timeStamp1 = performance.now();
	executionTime = (timeStamp1-timeStamp0) - totalTimeSlept;
	if(!showAnimations && found)
		drawShortestPath(predecessor);

    if(!found)
    	isRunning = false;
}