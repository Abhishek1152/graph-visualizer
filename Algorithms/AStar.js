var closedList = []

async function AStar()
{

}


async function AStarUtil() 
{
	isRunning = true;
	clearAnimatedCells();
	for(var i=0; i<gridRows; i++) 
	{
	    dist[i] = [];
	    closedList[i] = [];
	    for(var j=0; j<gridCols; j++) 
	    {
	        dist[i][j] = Number.MAX_SAFE_INTEGER;
	        closedList[i][j] = false;
	    }
	}

	await AStar();
	isRunning = false;

}