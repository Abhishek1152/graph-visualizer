var dist = [];
var predecessor = [];

function isValidPath(row, col)
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
			await drawPath(predecessor);
			break;
		}
		currentCell = getCell(uRow, uCol);
		await sleep(ms);
		currentCell.classList.add("animateCell");
		await sleep(ms);

		if(isValidCell(uRow+1, uCol) && isValidPath(uRow+1, uCol))
		{
			var vRow = uRow+1, vCol = uCol,
			weight = (getCell(vRow, vCol).classList.contains("weight")? 5 : 1);
			if(dist[vRow][vCol] > dist[uRow][uCol] + weight)
			{
				dist[vRow][vCol] = dist[uRow][uCol] + weight;
				setds.enqueue([vRow, vCol], dist[vRow][vCol]);
				predecessor[vRow][vCol].r = uRow;
				predecessor[vRow][vCol].c = uCol;
			}
		}
		if(isValidCell(uRow-1, uCol) && isValidPath(uRow-1, uCol))
		{
			var vRow = uRow-1, vCol = uCol,
			weight = (getCell(vRow, vCol).classList.contains("weight")? 5 : 1);
			if(dist[vRow][vCol] > dist[uRow][uCol] + weight)
			{
				dist[vRow][vCol] = dist[uRow][uCol] + weight;
				setds.enqueue([vRow, vCol], dist[vRow][vCol]);
				predecessor[vRow][vCol].r = uRow;
				predecessor[vRow][vCol].c = uCol;
			}
		}
		if(isValidCell(uRow, uCol+1) && isValidPath(uRow, uCol+1))
		{
			var vRow = uRow, vCol = uCol+1,
			weight = (getCell(vRow, vCol).classList.contains("weight")? 5 : 1);
			if(dist[vRow][vCol] > dist[uRow][uCol] + weight)
			{
				dist[vRow][vCol] = dist[uRow][uCol] + weight;
				setds.enqueue([vRow, vCol], dist[vRow][vCol]);
				predecessor[vRow][vCol].r = uRow;
				predecessor[vRow][vCol].c = uCol;
			}
		}
		if(isValidCell(uRow, uCol-1) && isValidPath(uRow, uCol-1))
		{
			var vRow = uRow, vCol = uCol-1,
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


async function DijkstrasUtil() 
{
	isRunning = true;
	clearAnimatedCells();
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
	isRunning = false;

}