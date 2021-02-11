var dist = [];
var predecessor = [];

/*
** Helper function for Dijkstras algorithm
*/
function isPathDijkstras(row, col)
{
	return (!Matrix[row][col].classList.contains("wall") 
		|| Matrix[row][col].classList.contains("stop"));
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

		if(showAnimations)
		{
			var timeStamp = performance.now();
			Matrix[uRow][uCol].classList.add("animateVisited");

			await sleep(ms);
			totalTimeSlept += (performance.now() - timeStamp);
		}

		if(Matrix[uRow][uCol].classList.contains("stop"))
		{
			found = true;
			if(showAnimations)
				drawShortestPath(predecessor);
			
			break;
		}

		for(var i in neighbours)
		{
			if(isValidCell(uRow+neighbours[i].R, uCol+neighbours[i].C) 
				&& isPathDijkstras(uRow+neighbours[i].R, uCol+neighbours[i].C))
			{
				var vRow = uRow+neighbours[i].R, vCol = uCol+neighbours[i].C,
				weight = (Matrix[vRow][vCol].classList.contains("weight")? 5 : 1);
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


async function DijkstrasUtil() 
{


	isRunning = true;
	clearAnimatedCells();
	found = false;

	var timeStamp0 = performance.now();
	totalTimeSlept = 0;

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


	await Dijkstras();
	var timeStamp1 = performance.now();
	executionTime = (timeStamp1-timeStamp0) - totalTimeSlept;
	if(found && !showAnimations)
		drawShortestPath(predecessor);

    if(!found)
    	isRunning = false;

}