var found;
var visited = [];

async function DepthFirstSearch(row, col)
{
	if(found || row >= gridRows || col >= gridCols || row < 0 || col < 0 || visited[row][col])
		return;
	if(row == stopRow && col == stopCol)
	{
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
	await DepthFirstSearch(row+1, col);
	await DepthFirstSearch(row, col+1);
	await DepthFirstSearch(row-1, col);
	await DepthFirstSearch(row, col-1);
}

async function DFSUtil()
{
	isRunning = true;
	clearGrid();
	found = false;
	for(var i=0; i<gridRows; i++) 
	{
	    visited[i] = [];
	    for(var j=0; j<gridCols; j++) 
	        visited[i][j] = false;
	}
	await DepthFirstSearch(startRow, startCol);
	// drawPath();
	isRunning = false;
}