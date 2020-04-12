var found;
var visited = [];

async function DepthFirstSearch(row, col)
{
	if(found || row >= gridRows || col >= gridCols || row < 0 || col < 0 || visited[row][col])
		return;
	if(getCell(row, col).classList.contains("wall"))
		return;
	if(row == stopRow && col == stopCol)
	{
		found = true;
		return;
	}
	visited[row][col] = true;
	var currentCell = getCell(row, col);
	await sleep(10);
	currentCell.classList.add("animateCell");
	await sleep(10);
	await DepthFirstSearch(row+1, col);
	await DepthFirstSearch(row, col+1);
	await DepthFirstSearch(row-1, col);
	await DepthFirstSearch(row, col-1);
}

async function DFSUtil(row, col)
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
	await DepthFirstSearch(row, col);
	// drawPath();
	isRunning = false;
}