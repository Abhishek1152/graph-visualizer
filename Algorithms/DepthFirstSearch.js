var found;
var visited = [];
var pathDistance = [];
var predecessor = [];

async function DepthFirstSearch(row, col)
{
	if(found || row >= gridRows || col >= gridCols || row < 0 || col < 0 || visited[row][col])
		return;

	if(getCell(row, col).classList.contains("stop"))
	{
		await drawPath(predecessor);
		found = true;
		return;
	}
	if(getCell(row, col).classList.contains("wall"))
		return;
	visited[row][col] = true;
	var currentCell = getCell(row, col);
	await sleep(ms);
	currentCell.classList.add("animateCell");
	await sleep(ms);
	if(!found && row+1 < gridRows && col < gridCols && row+1 >= 0 && col >= 0 && !visited[row+1][col])
	{
		pathDistance[row+1][col] = pathDistance[row][col]+1;
		predecessor[row+1][col].r = row;
		predecessor[row+1][col].c = col;
		await DepthFirstSearch(row+1, col);
	}

	if(!found && row < gridRows && col+1 < gridCols && row >= 0 && col+1 >= 0 && !visited[row][col+1])
	{
		pathDistance[row][col+1] = pathDistance[row][col]+1;
		predecessor[row][col+1].r = row;
		predecessor[row][col+1].c = col;
		await DepthFirstSearch(row, col+1);
	}

	if(!found && row-1 < gridRows && col < gridCols && row-1 >= 0 && col >= 0 && !visited[row-1][col])
	{
		pathDistance[row-1][col] = pathDistance[row][col]+1;
		predecessor[row-1][col].r = row;
		predecessor[row-1][col].c = col;
		await DepthFirstSearch(row-1, col);
	}

	if(!found && row < gridRows && col-1 < gridCols && row >= 0 && col-1 >= 0 && !visited[row][col-1])
	{
		pathDistance[row][col-1] = pathDistance[row][col]+1;
		predecessor[row][col-1].r = row;
		predecessor[row][col-1].c = col;
		await DepthFirstSearch(row, col-1);
	}
}

async function DFSUtil()
{
	isRunning = true;
	clearAnimatedCells();
	found = false;
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
	await DepthFirstSearch(startRow, startCol);
	isRunning = false;
}