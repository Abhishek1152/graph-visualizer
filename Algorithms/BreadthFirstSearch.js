var visited = [];

function isValidCell(row, col)
{
	return (row >= 0 && row < gridRows && col >= 0 && col < gridCols);
}

function isPath(row, col)
{
	return (!visited[row][col] && !getCell(row, col).classList.contains("wall") 
		|| getCell(row, col).classList.contains("stop"));
}

async function BreadthFirstSearch(startRow, startCol)
{
	var Queue = [];
	Queue.push([startRow, startCol]);
	visited[startRow][startCol] = true;

	while(Queue.length != 0)
	{
		var row = Queue[0][0], col = Queue[0][1];
		if(row == stopRow && col == stopCol)
			break;
		currentCell = getCell(row, col);
		await sleep(ms);
		currentCell.classList.add("animateCell");
		await sleep(ms);
		Queue.splice(0, 1);
		if(isValidCell(row+1, col) && isPath(row+1, col))
		{
			visited[row+1][col] = true;
			Queue.push([row+1, col]);
		}
		if(isValidCell(row-1, col) && isPath(row-1, col))
		{
			visited[row-1][col] = true;
			Queue.push([row-1, col]);
		}
		if(isValidCell(row, col+1) && isPath(row, col+1))
		{
			visited[row][col+1] = true;
			Queue.push([row, col+1]);
		}
		if(isValidCell(row, col-1) && isPath(row, col-1))
		{
			visited[row][col-1] = true;
			Queue.push([row, col-1]);
		}
	}
}

async function BFSUtil()
{
	isRunning = true;
	clearGrid();
	for(var i=0; i<20; i++) 
	{
	    visited[i] = [];
	    for(var j=0; j<60; j++) 
	        visited[i][j] = false;
	}
	 
	await BreadthFirstSearch(startRow, startCol);
	// drawPath();
	isRunning = false;
}