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
		if(getCell(row, col).classList.contains("stop"))
		{
			await drawPath(predecessor);
			break;
		}
		currentCell = getCell(row, col);
		await sleep(ms);
		currentCell.classList.add("animateCell");
		await sleep(ms);
		for(var i in neighbours)
		{
			if(isValidCell(row+neighbours[i].R, col+neighbours[i].C) 
				&& isPath(row+neighbours[i].R, col+neighbours[i].C))
			{
				visited[row+neighbours[i].R][col+neighbours[i].C] = true;
				var priority = Math.abs(stopRow-(row+neighbours[i].R)) + Math.abs(stopCol - (col+neighbours[i].C));
				var weight = (getCell(row+neighbours[i].R, col+neighbours[i].C).classList.contains("weight")? 5 : 1);
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
	// drawPath();
	isRunning = false;
}