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
	for(var i=0, j=gridCols-1; i < j; i++, j--)
	{
		getCell(gridRows-1, i).classList.add("wall");
		if(j < gridCols)
			getCell(gridRows-1, j).classList.add("wall");
		await sleep(10);
	}
}

async function recursiveDivision()
{
	await generateBorders();
}