var found;
var visited = [];

function isValidCell(row, col)
{
	return (row >= 0 && row < gridRows && col >= 0 && col < gridCols);
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
		await sleep(10);
		currentCell.classList.add("animateCell");
		await sleep(10);
		Queue.splice(0, 1);
		if(isValidCell(row+1, col) && !visited[row+1][col] && !getCell(row+1, col).classList.contains("wall"))
		{
			visited[row+1][col] = true;
			Queue.push([row+1, col]);
		}
		if(isValidCell(row-1, col)  && !visited[row-1][col] && !getCell(row-1, col).classList.contains("wall"))
		{
			visited[row-1][col] = true;
			Queue.push([row-1, col]);
		}
		if(isValidCell(row, col+1)  && !visited[row][col+1] && !getCell(row, col+1).classList.contains("wall"))
		{
			visited[row][col+1] = true;
			Queue.push([row, col+1]);
		}
		if(isValidCell(row, col-1)  && !visited[row][col-1] && !getCell(row, col-1).classList.contains("wall"))
		{
			visited[row][col-1] = true;
			Queue.push([row, col-1]);
		}
	}
}

async function BFSUtil(row, col)
{
	isRunning = true;
	clearGrid();
	found = false;
	for(var i=0; i<20; i++) 
	{
	    visited[i] = [];
	    for(var j=0; j<60; j++) 
	        visited[i][j] = false;
	}
	await BreadthFirstSearch(row, col);
	// drawPath();
	isRunning = false;
}