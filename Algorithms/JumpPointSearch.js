var closedList = [];
var cellDetails = [];
var predecessor = [];
var ts1;

async function drawPathforJPS(pred)
{
	if(found)
	{
		var i = stopRow;
		var j = stopCol;
		var path = [];
		path.push({r: i, c: j});
		while(pred[i][j] != null)
		{
			var prevCell = pred[i][j];
			x = prevCell[0];
			y = prevCell[1];
			// Horizontal
			if((i-x) == 0)
			{
				// Move right
				if(j < y)
				{
					for(var k=j; k<y; k++)
						path.push({r: i, c: k});
				}
				// Move left
				else
				{
					for(var k=j; k>y; k--)
						path.push({r: i, c: k});
				}
			}
			// Vertical
			else
			{
				// Move down
				if(i < x)
				{
					for(var k=i; k<x; k++)
						path.push({r: k, c: j});
				}
				// Move up
				else
				{
					for(var k=i; k>x; k--)
						path.push({r: k, c: j});
				}
			}
			i = prevCell[0];
			j = prevCell[1];
			path.push({r: i, c: j});
		}
		for(var i = path.length - 1; i >= 0; i--)
		{
			getCell(path[i].r, path[i].c).classList.remove("animateCell");
			getCell(path[i].r, path[i].c).classList.add("animatePath");
			await sleep(40);
		}
	}
	isRunning = false;
}

async function JumpPointSearch()
{
	var i = startRow, j = startCol;
	cellDetails[i][j].distance = 0;
	cellDetails[i][j].cost = 0;
	cellDetails[i][j].parent_i = i;
	cellDetails[i][j].parent_j = j;

	var openList = new PriorityQueue();
	openList.enqueue([i, j], 1);
	while(!openList.isEmpty())
	{
		var p = openList.dequeue();
		i = p.element[0];
		j = p.element[1];
		
		getCell(i, j).classList.add("animateCell");
		await sleep(ms);

		closedList[i][j] = true;
		if(getCell(i, j).classList.contains("stop"))
		{
			found = true;
			break;
		}
		var neigh = pruneNeighbors(i, j);
		for(var k = 0; k < neigh.length; k++)
		{
			var m = neigh[k][0];
			var n = neigh[k][1];
			if(closedList[m][n])
				continue;
			var newDistance = cellDetails[i][j].distance + Math.abs(i-m)+Math.abs(j-n) + (getCell(i, j).classList.contains("weight")? 5 : 1);

			if(newDistance < cellDetails[m][n].distance)
			{
				cellDetails[m][n].distance = newDistance;
				predecessor[m][n] = [i, j];
			}
			var newCost = cellDetails[i][j].distance + Math.abs(stopRow-m)+Math.abs(stopCol-n);
			if(newCost < cellDetails[m][n].cost)
			{
				cellDetails[m][n].cost = newCost;
				openList.enqueue([m, n], newCost);
			}
		}
	}
	while (!openList.isEmpty())
	{
		var cell = openList.dequeue();
		var i = cell.element[0];
		var j = cell.element[1];
		if (closedList[i][j])
			continue;
		closedList[i][j] = true;
		getCell(i, j).classList.add("animateCell");
		await sleep(ms);
	}

	drawPathforJPS(predecessor);
}

function pruneNeighbors(i, j)
{
	var neighbors = [];
	var stored = {};
	// Scan horizontally
	for (var num = 0; num < 2; num++)
	{
		if (!num)
		{
			var direction = "right";
			var increment = 1;
		} 
		else 
		{
			var direction = "left";
			var increment = -1;
		}
		for (var c = j + increment; (c < gridCols) && (c >= 0); c += increment)
		{
			var xy = i + "-" + c;
			if (closedList[i][c] || getCell(i, c).classList.contains("wall"))
				break;
			//Check if same row or column as end cell
			if ((stopRow == i || stopCol == c) && !stored[xy])
			{
				neighbors.push([i, c]);
				stored[xy] = true;
				continue;
			}
			// Check if dead end
			var deadEnd = !(xy in stored) && 
							((direction == "left" && (c > 0) && getCell(i, c-1).classList.contains("wall"))
								|| (direction == "right" && c < (gridCols - 1) 
									&& getCell(i, c+1).classList.contains("wall"))
									|| (c == gridCols - 1) || (c == 0));  
			if (deadEnd)
			{
				neighbors.push([i, c]);
				stored[xy] = true;
				break;
			}
			//Check for forced neighbors
			var validForcedNeighbor = (direction == "right" && c < (gridCols - 1) && (!getCell(i, c+1).classList.contains("wall"))) 
										|| (direction == "left" && (c > 0) && (!getCell(i, c-1).classList.contains("wall")));
			if (validForcedNeighbor)
			{
				checkForcedNeighbor(i, c, direction, neighbors, stored);
			}
		}
	}
	// Scan vertically
	for (var num = 0; num < 2; num++)
	{
		if (!num)
		{
			var direction = "down";
			var increment = 1;
		} 
		else 
		{
			var direction = "up";
			var increment = -1;
		}
		for (var r = i + increment; (r < gridRows) && (r >= 0); r += increment)
		{
			var xy = r + "-" + j;
			if (closedList[r][j] || getCell(r, j).classList.contains("wall"))
				break;
			if ((stopRow == r || stopCol == j) && !stored[xy])
			{
				neighbors.push([r, j]);
				stored[xy] = true;
				continue;
			}
			// Check if dead end
			var deadEnd = !(xy in stored) && ((direction == "up" && (r > 0) && getCell(r-1, j).classList.contains("wall"))
							 || (direction == "down" && r < (gridRows - 1) && getCell(r+1, j).classList.contains("wall"))
							 	|| (r == gridRows - 1) || (r == 0));  
			if (deadEnd)
			{
				neighbors.push([r, j]);
				stored[xy] = true;
				break;
			}
			//Check for forced neighbors
			var validForcedNeighbor = (direction == "down" && (r < (gridRows - 1)) && (!getCell(r+1, j).classList.contains("wall"))) 
										|| (direction == "up" && (r > 0) && (!getCell(r-1, j).classList.contains("wall")));
			if (validForcedNeighbor)
				checkForcedNeighbor(r, j, direction, neighbors, stored);
		}
	}
	return neighbors;
}

function checkForcedNeighbor(i, j, direction, neighbors, stored)
{
	if (direction == "right")
	{
		var isForcedNeighbor = ((i > 0) && getCell(i-1, j).classList.contains("wall") 
								&& (!getCell(i-1, j+1).classList.contains("wall"))) 
								|| ((i < (gridRows - 1)) && getCell(i+1, j).classList.contains("wall") && 
									(!getCell(i+1, j+1).classList.contains("wall")));
		var neighbor = [i, j + 1];
	} 
	else if (direction == "left")
	{
		var isForcedNeighbor = ((i > 0) && getCell(i-1, j).classList.contains("wall") 
								&& !getCell(i-1, j-1).classList.contains("wall")) || ((i < (gridRows - 1)) 
								&& getCell(i+1, j).classList.contains("wall") && !getCell(i+1, j-1).classList.contains("wall"));
		var neighbor = [i, j - 1];
	} 
	else if (direction == "up")
	{
		var isForcedNeighbor = ((j < (gridCols - 1)) && getCell(i, j+1).classList.contains("wall") 
								&& !getCell(i-1, j+1).classList.contains("wall")) || ((j > 0) && 
								getCell(i, j-1).classList.contains("wall") && !getCell(i-1, j-1).classList.contains("wall"));
		var neighbor = [i - 1, j];
	} 
	else 
	{
		var isForcedNeighbor = ((j < (gridCols - 1)) && getCell(i, j+1).classList.contains("wall") 
								&& !getCell(i+1, j+1).classList.contains("wall")) || ((j > 0) 
								&& getCell(i, j-1).classList.contains("wall") && !getCell(i+1, j-1).classList.contains("wall"));
		var neighbor = [i + 1, j];
	}
	var xy = neighbor[0] + "-" + neighbor[1];
	if (isForcedNeighbor && !stored[xy])
	{
		neighbors.push(neighbor);
		stored[xy] = true;
	} 
}



function JPSUtil()
{
	isRunning = true;
	clearAnimatedCells();
	for(var i=0; i<gridRows; i++) 
	{
	    dist[i] = [];
	    closedList[i] = [];
	    cellDetails[i] = [];
	    predecessor[i] = [];
	    for(var j=0; j<gridCols; j++) 
	    {
	        dist[i][j] = Number.MAX_SAFE_INTEGER;
	        closedList[i][j] = false;
	        cellDetails[i][j] = {distance: INT_MAX,
	        					 cost: INT_MAX};
	        predecessor[i][j] = null;
	    }
	}
	JumpPointSearch();
}