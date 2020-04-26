/*
** visited - Boolean matrix to keep track of visited or unvisited cell
** pathDistance - To construct path from source to destination
** predecessor - Stores predecessor for every cell
*/
var visited = []; 
var pathDistance = [];
var predecessor = [];

function isValidCell(row, col)
{
	return (row >= 0 && row < gridRows && col >= 0 && col < gridCols);
}

function isPath(row, col)
{
	return (!visited[row][col] && !getCell(row, col).classList.contains("wall") 
		|| getCell(row, col).classList.contains("stop"));
}

/*
** @param pred - Takes predecessor matrix which has predecessor for every grid cells
** Draws the path from source to destination
*/
async function drawPath(pred)
{
	var path = [];
	var crawl = {row: stopRow, col: stopCol};
	while(pred[crawl.row][crawl.col].r != -1 && 
			pred[crawl.row][crawl.col].c != -1)
	{
		path.push(pred[crawl.row][crawl.col]);
		var tempRow = pred[crawl.row][crawl.col].r, tempCol = pred[crawl.row][crawl.col].c;	
		crawl.row = tempRow;
		crawl.col = tempCol;
	}

	for(var i = path.length - 1; i >= 0; i--)
	{
		getCell(path[i].r, path[i].c).classList.remove("animateCell");
		getCell(path[i].r, path[i].c).classList.add("animatePath");
		await sleep(50);
	}
}

async function BreadthFirstSearch()
{
	var Queue = [];
	
	visited[startRow][startCol] = true;
	pathDistance[startRow][startCol] = 0;
	Queue.push([startRow, startCol]);

	while(Queue.length != 0)
	{
		var row = Queue[0][0], col = Queue[0][1];
		if(getCell(row, col).classList.contains("stop"))
		{
			await drawPath(predecessor);
			break;
		}
		currentCell = getCell(row, col);
		await sleep(ms);
		currentCell.classList.add("animateCell");
		await sleep(ms);
		Queue.splice(0, 1);
		if(isValidCell(row+1, col) && isPath(row+1, col))
		{
			visited[row+1][col] = true;
			//pathDistance[row+1][col] = pathDistance[row][col]+1;
			predecessor[row+1][col].r = row;
			predecessor[row+1][col].c = col;
			Queue.push([row+1, col]);
		}
		if(isValidCell(row-1, col) && isPath(row-1, col))
		{
			visited[row-1][col] = true;
			//pathDistance[row-1][col] = pathDistance[row][col]+1;
			predecessor[row-1][col].r = row;
			predecessor[row-1][col].c = col;
			Queue.push([row-1, col]);
		}
		if(isValidCell(row, col+1) && isPath(row, col+1))
		{
			visited[row][col+1] = true;
			//pathDistance[row][col+1] = pathDistance[row][col]+1;
			predecessor[row][col+1].r = row;
			predecessor[row][col+1].c = col;
			Queue.push([row, col+1]);
		}
		if(isValidCell(row, col-1) && isPath(row, col-1))
		{
			visited[row][col-1] = true;
			//pathDistance[row][col-1] = pathDistance[row][col]+1;
			predecessor[row][col-1].r = row;
			predecessor[row][col-1].c = col;
			Queue.push([row, col-1]);
		}
	}
}

async function BFSUtil()
{
	isRunning = true;
	clearAnimatedCells();
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
	isRunning = false;
}

//async function drawPathBFS()