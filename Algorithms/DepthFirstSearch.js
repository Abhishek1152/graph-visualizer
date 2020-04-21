var found;
var visited = [];
var path = [];

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
	path.push({r: row, c: col});
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
	clearAnimatedCells();
	found = false;
	path.length = 0;
	for(var i=0; i<gridRows; i++) 
	{
	    visited[i] = [];
	    for(var j=0; j<gridCols; j++) 
	        visited[i][j] = false;
	}
	await DepthFirstSearch(startRow, startCol);
	await drawPathDFS();
	isRunning = false;
}

async function drawPathDFS()
{
	for(var i=0; i<path.length; i++)
	{
		var current = path[i];
		getCell(current.r, current.c).classList.remove("animateCell");
		getCell(current.r, current.c).classList.add("animatePath");
		await sleep(2);
	}
}