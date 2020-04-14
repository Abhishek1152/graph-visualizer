var visited = []

function isValidCell(row, col)
{
	return (row >= 0 && row < gridRows && col >= 0 && col < gridCols);
}

function isPath(row, col)
{
	return (!visited[row][col] && !getCell(row, col).classList.contains("wall") 
		|| getCell(row, col).classList.contains("stop"));
}

async function BestFirstSearch()
{
	var priorityQueue = new PriorityQueue();
	priorityQueue.enqueue([startRow, startCol], 1);
	visited[startRow][startCol] = true;

	while(!priorityQueue.isEmpty())
	{
		var temp = priorityQueue.dequeue();
		console.log(temp.priority+"\n");
		var row = temp.element[0], col = temp.element[1];
		if(getCell(row, col).classList.contains("stop"))
			break;
		currentCell = getCell(row, col);
		await sleep(ms);
		currentCell.classList.add("animateCell");
		await sleep(ms);
		if(isValidCell(row+1, col) && isPath(row+1, col))
		{
			visited[row+1][col] = true;
			var priority = Math.abs(stopRow-(row+1)) + Math.abs(stopCol - col);
			var weight = getCell(row+1, col).classList.contains("weight")? 5 : 1;
			priorityQueue.enqueue([row+1, col], weight+priority);
		}
		if(isValidCell(row-1, col) && isPath(row-1, col))
		{
			visited[row-1][col] = true;
			var priority = Math.abs(stopRow-(row-1)) + Math.abs(stopCol - col);
			var weight = getCell(row-1, col).classList.contains("weight")? 5 : 1;
			priorityQueue.enqueue([row-1, col], weight+priority);
		}
		if(isValidCell(row, col+1) && isPath(row, col+1))
		{
			visited[row][col+1] = true;
			var priority = Math.abs(stopRow-row) + Math.abs(stopCol - (col+1));
			var weight = getCell(row, col+1).classList.contains("weight")? 5 : 1;
			priorityQueue.enqueue([row, col+1], weight+priority);
		}
		if(isValidCell(row, col-1) && isPath(row, col-1))
		{
			visited[row][col-1] = true;
			var priority = Math.abs(stopRow-row) + Math.abs(stopCol - (col-1));
			var weight = getCell(row, col-1).classList.contains("weight")? 5 : 1;
			priorityQueue.enqueue([row, col-1], weight+priority);
		}
		console.log(priorityQueue.printPQueue()+"\n\n\n");
	}
}



async function BestFirstSearchUtil()
{
	isRunning = true;
	clearGrid();
	for(var i=0; i<gridRows; i++) 
	{
	    visited[i] = [];
	    for(var j=0; j<gridCols; j++) 
	        visited[i][j] = false;
	}
	 
	await BestFirstSearch();
	// drawPath();
	isRunning = false;
}