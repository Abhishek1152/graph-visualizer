var closedList = [];
var cellDetails = [];
var predecessor = [];

function isPathforAStar(row, col)
{
	return (!closedList[row][col] && !getCell(row, col).classList.contains("wall") 
		|| getCell(row, col).classList.contains("stop"));
}

async function AStar()
{
	// Check if source is same as destination
	var i = startRow, j = startCol;
	cellDetails[i][j].f = 0;
	cellDetails[i][j].g = 0;
	cellDetails[i][j].h = 0;
	cellDetails[i][j].parent_i = i;
	cellDetails[i][j].parent_j = j;

	var openList = new PriorityQueue();
	openList.enqueue([i, j], 1);
	while(!openList.isEmpty())
	{
		var p = openList.dequeue();

		i = p.element[0];
		j = p.element[1];
		currentCell = getCell(i, j);
		currentCell.classList.add("animateCell");
		await sleep(ms);
		closedList[i][j] = true;
		if(getCell(i, j).classList.contains("stop"))
		{
			await drawPath(predecessor);
			break;
		}

		var gNew, hNew, fNew;
		// for(var k in neighbours)
		// {
		// 	if(isValidCell(i+neighbours[k].R, j+neighbours[k].C) 
		// 		&& isPathforAStar(i+neighbours[k].R, j+neighbours[k].C))
		// 	{
		// 		if(!closedList[i+neighbours[k].R][j+neighbours[k].C])
		// 		{
		// 			gNew = parseInt(cellDetails[i][j].g) + getCell(i+neighbours[k].R, j+neighbours[k].C).classList.contains("weight")? 5 : 1;
		// 			console.log(gNew);
		// 			hNew = Math.abs(stopRow-(i+neighbours[k].R)) + Math.abs(stopCol - (j+neighbours[k].C));
		// 			fNew = gNew + hNew;

		// 			if(cellDetails[i+neighbours[k].R][j+neighbours[k].C].f == Number.MAX_SAFE_INTEGER
		// 				|| cellDetails[i+neighbours[k].R][j+neighbours[k].C].f > fNew)
		// 			{
		// 				openList.enqueue([i+neighbours[k].R, j+neighbours[k].C], fNew);
		// 				cellDetails[i+neighbours[k].R][j+neighbours[k].C].f = fNew;
		// 				cellDetails[i+neighbours[k].R][j+neighbours[k].C].g = gNew;
		// 				cellDetails[i+neighbours[k].R][j+neighbours[k].C].h = hNew;
		// 				cellDetails[i+neighbours[k].R][j+neighbours[k].C].r = i;
		// 				cellDetails[i+neighbours[k].R][j+neighbours[k].C].c = j;
		// 			}
		// 		}
		// 	}
		// }
		if(isValidCell(i+1, j) && isPathforAStar(i+1, j))
		{
			if(!closedList[i+1][j])
			{
				gNew = parseInt(cellDetails[i][j].g) + 1;//getCell(i+1, j).classList.contains("weight")? 5 : 1;
				hNew = Math.abs(stopRow-(i+1)) + Math.abs(stopCol - j);
				fNew = gNew + hNew;

				if(cellDetails[i+1][j].f == Number.MAX_SAFE_INTEGER
					|| cellDetails[i+1][j].f > fNew)
				{
					openList.enqueue([i+1, j], fNew);
					cellDetails[i+1][j].f = fNew;
					cellDetails[i+1][j].g = gNew;
					cellDetails[i+1][j].h = hNew;
					predecessor[i+1][j].r = i;
					predecessor[i+1][j].c = j;
				}
			}
		}
		if(isValidCell(i-1, j) && isPathforAStar(i-1, j))
		{
			if(!closedList[i-1][j])
			{
				gNew = parseInt(cellDetails[i][j].g) + 1;//getCell(i-1, j).classList.contains("weight")? 5 : 1;
				hNew = Math.abs(stopRow-(i-1)) + Math.abs(stopCol - j);
				fNew = gNew + hNew;

				if(cellDetails[i-1][j].f == INT_MAX
					|| cellDetails[i-1][j].f > fNew)
				{
					openList.enqueue([i-1, j], fNew);
					cellDetails[i-1][j].f = fNew;
					cellDetails[i-1][j].g = gNew;
					cellDetails[i-1][j].h = hNew;
					predecessor[i-1][j].r = i;
					predecessor[i-1][j].c = j;
				}
			}
		}
		if(isValidCell(i, j+1) && isPathforAStar(i, j+1))
		{
			if(!closedList[i][j+1])
			{
				gNew = parseInt(cellDetails[i][j].g) + 1;//getCell(i, j+1).classList.contains("weight")? 5 : 1;
				hNew = Math.abs(stopRow-i) + Math.abs(stopCol - (j+1));
				fNew = gNew + hNew;

				if(cellDetails[i][j+1].f == INT_MAX
					|| cellDetails[i][j+1].f > fNew)
				{
					openList.enqueue([i, j+1], fNew);
					cellDetails[i][j+1].f = fNew;
					cellDetails[i][j+1].g = gNew;
					cellDetails[i][j+1].h = hNew;
					predecessor[i][j+1].r = i;
					predecessor[i][j+1].c = j;
				}
			}
		}
		if(isValidCell(i, j-1) && isPathforAStar(i, j-1))
		{
			if(!closedList[i][j-1])
			{
				gNew = parseInt(cellDetails[i][j].g) + 1;//getCell(i, j-1).classList.contains("weight")? 5 : 1;
				hNew = Math.abs(stopRow-i) + Math.abs(stopCol - (j-1));
				fNew = gNew + hNew;

				if(cellDetails[i][j-1].f == INT_MAX
					|| cellDetails[i][j-1].f > fNew)
				{
					openList.enqueue([i, j-1], fNew);
					cellDetails[i][j-1].f = fNew;
					cellDetails[i][j-1].g = gNew;
					cellDetails[i][j-1].h = hNew;
					predecessor[i][j-1].r = i;
					predecessor[i][j-1].c = j;
				}
			}
		}
	}
}


async function AStarUtil() 
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
	        cellDetails[i][j] = {"f":Number.MAX_SAFE_INTEGER,
	        					 "g":Number.MAX_SAFE_INTEGER,
	        					 "h":Number.MAX_SAFE_INTEGER,
	        					 "parent_i": -1, "parent_j": -1};
	        predecessor[i][j] = {r: -1, c: -1};
	    }
	}

	await AStar();
	isRunning = false;

}