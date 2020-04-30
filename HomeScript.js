// Viewport height and width for calculations
const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const WALLCOLOR = "black", STARTCOLOR = "red", STOPCOLOR="green", VISITEDCOLOR="magenta", CURRENTCOLOR="yellow";
const neighbours = [{R: 1, C: 0}, {R: -1, C: 0}, {R: 0, C: 1}, {R: 0, C: -1}]; // The neighbours down, up, right, left
const INT_MAX = Number.MAX_SAFE_INTEGER;


var gridCols = Math.floor(vw/26), gridRows = Math.floor((vh-120)/26);
var startRow = Math.floor(gridRows/2), startCol = Math.floor(1/5*gridCols);
var stopRow = Math.floor(gridRows/2), stopCol = Math.ceil(4/5*gridCols);
var isRunning = false, isWall = false;
var currentalgo, currentmazeAlgo;
var ms = 10;


/*
** visited - Boolean matrix to keep track of visited or unvisited cell
** pathDistance - To construct path from source to destination
** predecessor - Stores predecessor for every cell
*/
var visited = []; 
var pathDistance = [];
var predecessor = [];

/*
** Grid rows and cols has to be odd in order to avoid issues caused in displaying maze
*/
if(gridCols % 2 == 0)
	gridCols++;
if(gridRows % 2 == 0)
	gridRows++;

// TODO: Implement arrow directions


function currentAlgo(algo)
{
	currentalgo = algo;
	if(currentalgo == "astar")
		document.getElementById("visualizebtn").innerHTML = "Visualize A*";
	else if(currentalgo == "bidir-astar")
		document.getElementById("visualizebtn").innerHTML = "Visualize Bidirectional A*";
	else if(currentalgo == "dijkstras")
		document.getElementById("visualizebtn").innerHTML = "Visualize Dijkstra's";
	else if(currentalgo == "jps")
		document.getElementById("visualizebtn").innerHTML = "Visualize JPS";
	else if(currentalgo == "greedy-bfs")
		document.getElementById("visualizebtn").innerHTML = "Visualize Greedy BFS";
	else if(currentalgo == "bfs")
		document.getElementById("visualizebtn").innerHTML = "Visualize BFS";
	else if(currentalgo == "dfs")
		document.getElementById("visualizebtn").innerHTML = "Visualize DFS";
	else
		console.log("How did you even reach here?");

}

async function visualizeAlgo()
{
	if(currentalgo == "astar")
		await AStarUtil();
	else if(currentalgo == "bidir-astar")
		await bidirectionalAStarUtil();
	else if(currentalgo == "dijkstras")
		await DijkstrasUtil();
	else if(currentalgo == "jps")
		return;
	else if(currentalgo == "greedy-bfs")
		await BestFirstSearchUtil();
	else if(currentalgo == "bfs")
		await BFSUtil();
	else if(currentalgo == "dfs")
		await DFSUtil();
	else;
}





/*
** @param - ms: Takes number of milliseconds
** @return: new Promise that will timeout after ms 
*/
function sleep(ms) 
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

/*
** @param - row: 0 base row index of a cell
** @param - col: 0 base column index of a cell
** @return - The grid cell of specified row and col
*/
function getCell(row, col)
{
	return document.querySelector(".row:nth-child("+(row+1)+") .gridsquare:nth-child("+(col+1)+")");
}


/*
** @param - rows: Number of rows in grid
** @param - cols: Number of cols in grid
** Constructs a grid of the specified rows and columns
*/
function genDivs(rows, cols)
{ 
	var e = document.getElementById("gridContainer");
	for(var r = 0; r < rows; r++)
	{ 
		var row = document.createElement("div"); 
		row.className = "row";
		for(var c = 0; c < cols; c++)
		{ 
			var cell = document.createElement("div"); 
			cell.className = "gridsquare"; 

			if(r == startRow && c == startCol)
				cell.classList.add("start");
			
			else if(r == stopRow && c == stopCol)
				cell.classList.add("stop");
		    
		    row.appendChild(cell); 
		} 
		e.appendChild(row); 
	}
}

/*
** Function clears all the animated path in grid
*/
function clearAnimatedCells()
{
	for(var i=0; i<gridRows; i++) 
	{
	    for(var j=0; j<gridCols; j++) 
	    {
	        getCell(i, j).classList.remove("animateCell");
	        getCell(i, j).classList.remove("animatePath");
	    }

	}
}


/*
** Function clears everything of the grid
*/
function clearGrid()
{
	for(var i=0; i<gridRows; i++) 
	{
	    for(var j=0; j<gridCols; j++) 
	    {
	        getCell(i, j).classList.remove("animateCell");
	        getCell(i, j).classList.remove("wall");
	        getCell(i, j).classList.remove("animatePath");
	    }
	}
}


/*
** @param - row: 0 base row index of a cell
** @param - col: 0 base column index of a cell
** @return: A boolean value true signifying the cell is on grid, false otherwise
*/
function isValidCell(row, col)
{
	return (row >= 0 && row < gridRows && col >= 0 && col < gridCols);
}


/*
** @param - row: 0 base row index of a cell
** @param - col: 0 base column index of a cell
** @return: A boolean value true signifying the cell is walkable, false otherwise
*/
function isPath(row, col)
{
	return (!visited[row][col] && !getCell(row, col).classList.contains("wall") 
		|| getCell(row, col).classList.contains("stop"));
}


/*
** @param - pred: Takes predecessor matrix which has predecessor for every grid cells
** Draws the path from source to destination
*/
async function drawPath(pred)
{
	var path = [];
	var crawl = {row: stopRow, col: stopCol};
	path.push({r: stopRow, c: stopCol});
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


function toggleWallWeight(val)
{
	isWall = (val == 1);
}

genDivs(gridRows, gridCols);

// Nerd fix for centralizing grid horizontally
document.getElementById("gridContainer").style.left = (vw-document.getElementById("gridContainer").offsetWidth)/2+"px";
