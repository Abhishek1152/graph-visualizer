var dist = [];

function isValidPath(row, col)
{
	return (!getCell(row, col).classList.contains("wall") 
		|| getCell(row, col).classList.contains("stop"));
}

async function Dijkstras()
{
	var setds = new Set();
	setds.add([0, startRow, startCol]);
	dist[startRow][startCol] = 0; 
	while(setds.size != 0)
	{
		var it = setds.values(), first = it.next();
		var tmp = first.value;
		setds.delete(tmp);
		var uRow = tmp[1], uCol = tmp[2];
		if(getCell(uRow, uCol).classList.contains("stop"))
			break;
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
				if(dist[vRow][vCol] != Number.MAX_SAFE_INTEGER)
					setds.delete([dist[vRow][vCol], vRow, vCol]);
				dist[vRow][vCol] = dist[uRow][uCol] + weight;
				setds.add([dist[vRow][vCol], vRow, vCol]);
			}
		}
		if(isValidCell(uRow-1, uCol) && isValidPath(uRow-1, uCol))
		{
			var vRow = uRow-1, vCol = uCol,
			weight = (getCell(vRow, vCol).classList.contains("weight")? 5 : 1);
			if(dist[vRow][vCol] > dist[uRow][uCol] + weight)
			{
				if(dist[vRow][vCol] != Number.MAX_SAFE_INTEGER)
					setds.delete([dist[vRow][vCol], vRow, vCol]);
				dist[vRow][vCol] = dist[uRow][uCol] + weight;
				setds.add([dist[vRow][vCol], vRow, vCol]);
			}
		}
		if(isValidCell(uRow, uCol+1) && isValidPath(uRow, uCol+1))
		{
			var vRow = uRow, vCol = uCol+1,
			weight = (getCell(vRow, vCol).classList.contains("weight")? 5 : 1);
			if(dist[vRow][vCol] > dist[uRow][uCol] + weight)
			{
				if(dist[vRow][vCol] != Number.MAX_SAFE_INTEGER)
					setds.delete([dist[vRow][vCol], vRow, vCol]);
				dist[vRow][vCol] = dist[uRow][uCol] + weight;
				setds.add([dist[vRow][vCol], vRow, vCol]);
			}
		}
		if(isValidCell(uRow, uCol-1) && isValidPath(uRow, uCol-1))
		{
			var vRow = uRow, vCol = uCol-1,
			weight = (getCell(vRow, vCol).classList.contains("weight")? 5 : 1);
			if(dist[vRow][vCol] > dist[uRow][uCol] + weight)
			{
				if(dist[vRow][vCol] != Number.MAX_SAFE_INTEGER)
					setds.delete([dist[vRow][vCol], vRow, vCol]);
				dist[vRow][vCol] = dist[uRow][uCol] + weight;
				setds.add([dist[vRow][vCol], vRow, vCol]);
			}
		}
	}
	console.log(dist[stopRow][stopCol]);
}


async function DijkstrasUtil() 
{
	isRunning = true;
	clearGrid();
	for(var i=0; i<gridRows; i++) 
	{
	    dist[i] = [];
	    for(var j=0; j<gridCols; j++) 
	        dist[i][j] = Number.MAX_SAFE_INTEGER;
	}
	await Dijkstras();
	isRunning = false;

}