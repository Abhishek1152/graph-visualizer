function randomNumber(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function generateBorders()
{
	for(var i=parseInt(gridCols/2), j=i+1; i >= 0; i--, j++)
	{
			getCell(0, i).classList.add("wall");
		if(j < gridCols)
			getCell(0, j).classList.add("wall");
		await sleep(10);
	}
	for(var i = 1; i < gridRows; i++)
	{
		getCell(i, 0).classList.add("wall");
		getCell(i, gridCols-1).classList.add("wall");
		await sleep(10);
	}
	for(var i=0, j=gridCols-1; i <= j; i++, j--)
	{
		getCell(gridRows-1, i).classList.add("wall");
		if(j < gridCols)
			getCell(gridRows-1, j).classList.add("wall");
		await sleep(10);
	}
}

async function addInnerWalls(horizontal, minX, maxX, minY, maxY)
{
	if(horizontal)
	{
		if(maxX - minX < 2)
			return;
		var y = Math.floor(randomNumber(minY, maxY)/2)*2;
		
		await addHorizontalWall(minX, maxX, y);

		await addInnerWalls(!horizontal, minX, maxX, minY, y-1);
		await addInnerWalls(!horizontal, minX, maxX, y+1, maxY);
	}
	else
	{
		if(maxY - minY < 2)
			return;
		var x = Math.floor(randomNumber(minX, maxX)/2)*2;
		await addVerticalWall(minY, maxY, x);

		await addInnerWalls(!horizontal, minX, x-1, minY, maxY);
		await addInnerWalls(!horizontal, x+1, maxX, minY, maxY);
	}
}

async function addHorizontalWall(minX, maxX, y)
{
	var hole = Math.floor(randomNumber(minX, maxX)/2)*2 + 1;
	for(var i = minX; i <= maxX; i++)
	{
		if(y==0||y==gridRows-1||i==0||i==gridCols-1)
			continue;
		if(i == hole)
			getCell(y, i).classList.remove("wall");
		else
		{
			getCell(y, i).classList.add("wall");
			await sleep(5);
		}
	}
}

async function addVerticalWall(minY, maxY, x)
{
	var hole = Math.floor(randomNumber(minY, maxY)/2)*2+1;
	for(var i = minY; i <= maxY; i++)
	{
		if(i==0||i==gridRows-1||x==0||x==gridCols-1)
			continue;
		if(i == hole)
			getCell(i, x).classList.remove("wall");
		else
		{
			getCell(i, x).classList.add("wall");
			await sleep(5);
		}
	}
}

async function recursiveDivision()
{
	isRunning = true;
	clearGrid();
	await generateBorders();
	await addInnerWalls(false, 1, gridCols-2, 1, gridRows-2);
	isRunning = false;
}