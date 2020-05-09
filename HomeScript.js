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
var showAnimations = true;

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
	if(isRunning)
		return;
	if(currentalgo == "astar")
	{
		await AStarUtil();
	}
	else if(currentalgo == "bidir-astar")
	{
		await bidirectionalAStarUtil();
	}
	else if(currentalgo == "dijkstras")
	{
		await DijkstrasUtil();
	}
	else if(currentalgo == "jps")
	{
		await JPSUtil();
	}
	else if(currentalgo == "greedy-bfs")
	{
		await BestFirstSearchUtil();
	}
	else if(currentalgo == "bfs")
	{
		await BFSUtil();
	}
	else if(currentalgo == "dfs")
	{
		await DFSUtil();
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
	        cell.classList.remove("animateVisited");
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
	        cell.classList.remove("animateVisited");
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
	return (!visited[row][col] && !getCell(row, col).classList.contains("wall"));
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

	var prevRow = path[path.length-1].r, prevCol = path[path.length-1].c;
	for(var i = path.length - 1; i >= 0; i--)
	{
		var cell = getCell(path[i].r, path[i].c);
		var direction;
		if(path[i].r - prevRow == 0)
		{
			if(prevCol - path[i].c > 0)
				direction = "pathLeft";
			else
				direction = "pathRight";
		}
		else
		{
			if(prevRow - path[i].r > 0)
				direction = "pathUp";
			else
				direction = "pathDown";
		}
		prevRow = path[i].r, prevCol = path[i].c;
		if(showAnimations)
		{
			cell.classList.remove("animateVisited");
			cell.classList.add(direction);
			await sleep(50);
			
			cell.classList.remove(direction);

			cell.classList.add("animatePath");
		}

		pathCost += (cell.classList.contains("weight")? 5 : 1);
	}

	if(showAnimations)
		showTimeandCost();
	isRunning = false;
}

function showTimeandCost()
{
	document.getElementById("execTime").innerHTML = "Execution time: "+(executionTime.toFixed(2))+" ms <br> Cost: "+pathCost;
}

function toggleWallWeight(val)
{
	isWall = (val == 1);
}

function resetTable()
{
	var table = document.getElementById("algoCompareTable");
	document.getElementById("progressBar").style.width = "0%";
	while(table.rows.length > 0)
		table.deleteRow(0);

	var algoInfo = [{algo: "A* Algorithm", id: "astarCheckbox", isWeighted: true, isShortest: true}, {algo: "Bidirectional A*", id: "bidir-astarCheckbox", isWeighted: true, isShortest: false},
					{algo: "Dijkstra's", id: "dijkstrasCheckbox", isWeighted: true, isShortest: true}, {algo: "Greedy BFS", id: "greedy-bfsCheckbox", isWeighted: true, isShortest: false},
					{algo: "BFS", id: "bfsCheckbox", isWeighted: false, isShortest: true}, {algo: "DFS", id: "dfsCheckbox", isWeighted: false, isShortest: false}];
	for(var i in algoInfo)
	{
		var newRow = table.insertRow(i);
		var cell0 = newRow.insertCell(0);
		var cell1 = newRow.insertCell(1);
		var cell2 = newRow.insertCell(2);

		cell0.innerHTML = "<label><input id='"+algoInfo[i].id+"' type='checkbox'> "+algoInfo[i].algo+"</label>";
		if(algoInfo[i].isWeighted)
			cell1.innerHTML = "<font class='correct'>Weighted &#10003;</font>";
		else
			cell1.innerHTML = "<font class='incorrect'><strike>Weighted</strike> &#10007;</font>";
		if(algoInfo[i].isShortest)
			cell2.innerHTML = "<font class='correct'>Shortest path &#10003;</font>";
		else
			cell2.innerHTML = "<font class='incorrect'><strike>Shortest path</strike> &#10007;</font>";
	}
	document.getElementById("compareCheckedAlgo").style.display = "block";
	document.getElementById("tableResetbtn").style.display = "none";
}

document.getElementById("compareCheckedAlgo").onclick = async function()
{
	showAnimations = false;
	var execTimeandPath = [{algoName: "A* Algorithm", algo: "astar", id: "astarCheckbox", executionTime: INT_MAX, pathCost: INT_MAX}, 
					{algoName: "Bidirectional A*", algo: "bidir-astar", id: "bidir-astarCheckbox", executionTime: INT_MAX, pathCost: INT_MAX},
					{algoName: "Dijkstra's", algo: "dijkstras", id: "dijkstrasCheckbox", executionTime: INT_MAX, pathCost: INT_MAX}, 
					{algoName: "Greedy BFS", algo: "greedy-bfs", id: "greedy-bfsCheckbox", executionTime: INT_MAX, pathCost: INT_MAX},
					{algoName: "BFS", algo: "bfs", id: "bfsCheckbox", executionTime: INT_MAX, pathCost: INT_MAX}, 
					{algoName: "DFS", algo: "dfs", id: "dfsCheckbox", executionTime: INT_MAX, pathCost: INT_MAX}];
	
	var width = 0;

	for(var i in execTimeandPath)
	{
		if(document.getElementById(execTimeandPath[i].id).checked)
		{
			currentalgo = execTimeandPath[i].algo;
			await visualizeAlgo();
			if(found)
			{
				execTimeandPath[i].executionTime = executionTime;
				execTimeandPath[i].pathCost = pathCost;
			}
		}
		else
		{
			execTimeandPath[i].pathCost = -1;
		}
		await sleep(50);
		width = Math.min(width+16.66, 100);
		document.getElementById("progressBar").style.width = width+"%";
	}

	for(var i in execTimeandPath)
		if(execTimeandPath[i].pathCost != -1)
			execTimeandPath.push(execTimeandPath[i]);

	execTimeandPath.splice(0, 6);

	showAnimations = true;
	var table = document.getElementById("algoCompareTable");
	while(table.rows.length > 0)
		table.deleteRow(0);

	for(var i in execTimeandPath)
	{
		var newRow = table.insertRow(i);
		var cell0 = newRow.insertCell(0);
		var cell1 = newRow.insertCell(1);
		var cell2 = newRow.insertCell(2);

		cell0.innerHTML = execTimeandPath[i].algoName;
		if(execTimeandPath[i].executionTime != INT_MAX)
		{
			
			cell1.innerHTML = "<font class='correct'>"+execTimeandPath[i].executionTime.toFixed(2)+" ms &#10003;</font>";
			cell2.innerHTML = "<font class='correct'>"+execTimeandPath[i].pathCost+" &#10003;</font>";;
		}
		else
		{
			cell1.innerHTML = "<font class='incorrect'>Path not found &#10007;</font>";
		}
		
	}
	document.getElementById("compareCheckedAlgo").style.display = "none";
	document.getElementById("tableResetbtn").style.display = "block";
}



genDivs(gridRows, gridCols);

// Nerd fix for centralizing grid horizontally
document.getElementById("gridContainer").style.left = (vw-document.getElementById("gridContainer").offsetWidth)/2+"px";

resetTable();









