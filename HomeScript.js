// Viewport height and width for calculations
const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const WALLCOLOR = "black", STARTCOLOR = "red", STOPCOLOR="green", VISITEDCOLOR="magenta", CURRENTCOLOR="yellow";
const neighbours = [{R: 1, C: 0}, {R: -1, C: 0}, {R: 0, C: 1}, {R: 0, C: -1}]; // The neighbours down, up, right, left
const INT_MAX = Number.MAX_SAFE_INTEGER;


var gridCols = Math.floor(vw/26), gridRows = Math.floor((vh-120)/26);
var startRow = Math.floor(gridRows/2), startCol = Math.floor(1/5*gridCols);
var stopRow = Math.floor(gridRows/2), stopCol = Math.ceil(4/5*gridCols);
var isRunning = false, isWall = true;
var currentalgo = "", currentmazeAlgo;
var totalTimeSlept;
var found, pathCost, executionTime;

var ms = 30;


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


document.getElementById("algobtn").onclick = function toggleAlgoDropdown()
{
	document.getElementById("algoDropdown").classList.add("show-dropdown");
	document.getElementById("mazeDropdown").classList.remove("show-dropdown");
	document.getElementById("speedDropdown").classList.remove("show-dropdown");
}

document.getElementById("mazebtn").onclick = function toggleMazeDropdown()
{
	document.getElementById("mazeDropdown").classList.add("show-dropdown");
	document.getElementById("algoDropdown").classList.remove("show-dropdown");
	document.getElementById("speedDropdown").classList.remove("show-dropdown");

}

document.getElementById("speedbtn").onclick = function toggleSpeedDropdown()
{
	document.getElementById("speedDropdown").classList.add("show-dropdown");
	document.getElementById("mazeDropdown").classList.remove("show-dropdown");
	document.getElementById("algoDropdown").classList.remove("show-dropdown");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) 
{
	if (!e.target.matches(".dropbtn")) 
	{
		document.getElementById("algoDropdown").classList.remove("show-dropdown");
		document.getElementById("mazeDropdown").classList.remove("show-dropdown");	
		document.getElementById("speedDropdown").classList.remove("show-dropdown");
  	}
  	var modal = document.getElementById('modal-wrapper');
  	if (event.target == modal) 
        modal.style.display = "none";
}

document.getElementById("astar").onclick = function()
{
	currentalgo = "astar";
	document.getElementById("visualizebtn").innerHTML = "Visualize A*";
}

document.getElementById("bidir-astar").onclick = function()
{
	currentalgo = "bidir-astar";
	document.getElementById("visualizebtn").innerHTML = "Visualize Bidirectional A*";
}

document.getElementById("dijkstras").onclick = function()
{
	currentalgo = "dijkstras";
	document.getElementById("visualizebtn").innerHTML = "Visualize Dijkstra's";
}

document.getElementById("jps").onclick = function()
{
	currentalgo = "jps";
	document.getElementById("visualizebtn").innerHTML = "Visualize JPS";
}

document.getElementById("greedy-bfs").onclick = function()
{
	currentalgo = "greedy-bfs";
	document.getElementById("visualizebtn").innerHTML = "Visualize Greedy BFS";
}

document.getElementById("bfs").onclick = function()
{
	currentalgo = "bfs";
	document.getElementById("visualizebtn").innerHTML = "Visualize BFS";
}

document.getElementById("dfs").onclick = function()
{
	currentalgo = "dfs";
	document.getElementById("visualizebtn").innerHTML = "Visualize DFS";
}

function changeSpeed(val)
{
	if(val == "slow")
		ms = 300;
	else if(val == "medium")
		ms = 80;
	else
		ms = 30;
}


async function visualizeAlgo()
{
	if(currentalgo == "astar")
	{
		AStarUtil();
	}
	else if(currentalgo == "bidir-astar")
	{
		bidirectionalAStarUtil();
	}
	else if(currentalgo == "dijkstras")
	{
		DijkstrasUtil();
	}
	else if(currentalgo == "jps")
	{
		JPSUtil();
	}
	else if(currentalgo == "greedy-bfs")
	{
		BestFirstSearchUtil();
	}
	else if(currentalgo == "bfs")
	{
		BFSUtil();
	}
	else if(currentalgo == "dfs")
	{
		DFSUtil();
	}
	else if(currentalgo == "")
		document.getElementById("visualizebtn").innerHTML = "Pick an Algorithm";
	else
		console.log("How did you even reach here?");
}



document.getElementById("navbarWall").onclick = function()
{
	isWall = true;
	document.getElementById("navbarWall").style.border = "2px solid white";
	document.getElementById("navbarWeight").style.border = "none";
}

document.getElementById("navbarWeight").onclick = function()
{
	isWall = false;
	document.getElementById("navbarWall").style.border = "none";
	document.getElementById("navbarWeight").style.border =  "2px solid white";
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
	    	var cell = getCell(i, j);
	        cell.classList.remove("animateCell");
	        cell.classList.remove("animatePath");
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
	    	var cell = getCell(i, j);
	        cell.classList.remove("animateCell");
	        cell.classList.remove("wall");
	        cell.classList.remove("animatePath");
	        cell.classList.remove("weight");

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
async function drawShortestPath(pred)
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
	pathCost = -1;
	for(var i = path.length - 1; i >= 0; i--)
	{
		var cell = getCell(path[i].r, path[i].c);
		cell.classList.remove("animateCell");
		cell.classList.add("animatePath");
		pathCost += (cell.classList.contains("weight")? 5 : 1);
		await sleep(50);
	}

	showTimeandCost();
	isRunning = false;
}

function showTimeandCost()
{
	document.getElementById("execTime").innerHTML = "Execution time: "+(executionTime)+" ms <br> Cost: "+pathCost;
}

function toggleWallWeight(val)
{
	isWall = (val == 1);
}

genDivs(gridRows, gridCols);

// Nerd fix for centralizing grid horizontally
document.getElementById("gridContainer").style.left = (vw-document.getElementById("gridContainer").offsetWidth)/2+"px";


// TODO: Implement arrow directions








