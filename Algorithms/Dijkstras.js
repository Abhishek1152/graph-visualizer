var dist = [];
var predecessor = [];

/*
** Helper function for Dijkstras algorithm
*/
function isPathDijkstras(row, col)
{
	return (!getCell(row, col).classList.contains("wall") 
		|| getCell(row, col).classList.contains("stop"));
}

async function Dijkstras()
{
	var setds = new PriorityQueue();
	setds.enqueue([startRow, startCol], 1);
	dist[startRow][startCol] = 0; 
	while(!setds.isEmpty())
	{
		var tmp = setds.dequeue();
		var uRow = tmp.element[0], uCol = tmp.element[1];

		if(getCell(uRow, uCol).classList.contains("stop"))
		{
			drawShortestPath(predecessor);
			found = true;
			break;
		}
		
		getCell(uRow, uCol).classList.add("animateCell");
		await sleep(ms);

		for(var i in neighbours)
		{
			if(isValidCell(uRow+neighbours[i].R, uCol+neighbours[i].C) 
				&& isPathDijkstras(uRow+neighbours[i].R, uCol+neighbours[i].C))
			{
				var vRow = uRow+neighbours[i].R, vCol = uCol+neighbours[i].C,
				weight = (getCell(vRow, vCol).classList.contains("weight")? 5 : 1);
				if(dist[vRow][vCol] > dist[uRow][uCol] + weight)
				{
					dist[vRow][vCol] = dist[uRow][uCol] + weight;
					setds.enqueue([vRow, vCol], dist[vRow][vCol]);
					predecessor[vRow][vCol].r = uRow;
					predecessor[vRow][vCol].c = uCol;
				}
			}
		}
	}
}


function DijkstrasUtil() 
{
	isRunning = true;
	clearAnimatedCells();
	found = true;

	for(var i=0; i<gridRows; i++) 
	{
	    dist[i] = [];
	    predecessor[i] = [];
	    for(var j=0; j<gridCols; j++) 
	    {
	        dist[i][j] = INT_MAX;
	        predecessor[i][j] = {r: -1, c: -1};
	    }
	}
	Dijkstras();
}