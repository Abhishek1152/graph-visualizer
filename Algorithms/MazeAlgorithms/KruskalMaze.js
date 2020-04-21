
async function KruskalMazeUtil()
{
	isRunning = true;
	clearGrid();
	for(var i=0; i<gridRows; i++)
		for(var j=0; j<gridCols; j++)
			getCell(i, j).classList.add("wall");
	sleep(1000);

	//await KruskalMaze();
	isRunning = false;
}
