function isOnBoard(cell)
{
	return (cell.x >= 0 && cell.x < gridCols && cell.y >= 0 && cell.y < gridRows);
}

async function DFSMaze()
{
	var board = [];
    // Make walls
    for(var i = 0; i < gridRows; i++)
    {
    	board[i] = [];
    	for(var j = 0; j < gridCols; j++)
    		board[i][j] = {"visited": false, "wall": true};
    }

    for (var i = 1; i < gridRows-1; i++) 
    {
        for (var j = 2; j < gridCols-1; j+=2) 
        {
        	if(getCell(i, j).classList.contains("start") || getCell(i, j).classList.contains("stop"))
        		continue;
        	getCell(i, j).classList.add("wall");
        	
            board[i][j].visited = false, board[i][j].wall = true;
        }
        await sleep(50);
    }
    for (var j = 1; j < gridCols-1; j++) 
    {
        for (var i = 2; i < gridRows-1; i += 2) 
        {
        	if(getCell(i, j).classList.contains("start") || getCell(i, j).classList.contains("stop"))
        		continue;
        	getCell(i, j).classList.add("wall");
        	
            board[i][j].visited = false, board[i][j].wall = true;
        }
        await sleep(50);
    }

    // Choose start point
    var sy = 1;
    var sx = 1;

    board[sy][sx].visited = true;

    var stack = [];
    stack.push({ x: sx, y: sy });
    while (stack.length > 0) 
    {
        var current = stack.pop();

        var validNeighbours = [];
        var straightMoves = [[0, -2], [0, 2], [-2, 0], [2, 0]];

        for (var move of straightMoves) 
        {
            var newNodePosition = 
            {
                x: current.x + move[0],
                y: current.y + move[1]
            }

            if (!isOnBoard(newNodePosition) || board[newNodePosition.y][newNodePosition.x].visited) 
            {
                continue;
            }

            validNeighbours.push(newNodePosition);
        }

        // If we have available Neighbour(s), we choose a random Neighbour
        // and remove the wall(obstacle cell) between these two cell.
        if (validNeighbours.length > 0) 
        {
            stack.push(current);
            var randNeighbour = validNeighbours[Math.floor(Math.random() * 101) % validNeighbours.length];

            if (randNeighbour.y == current.y) 
            { // Same row
                if (randNeighbour.x > current.x) 
                {
                	getCell(current.y, current.x+1).classList.remove("wall");
                	await sleep(25);
                    board[current.y][current.x + 1].wall = false;
                }
                
                else 
                {
                	getCell(current.y, current.x-1).classList.remove("wall");
                	await sleep(25);
                    board[current.y][current.x - 1].wall = false;
                }
                
            } 
            else 
            { // Same column
                if (randNeighbour.y > current.y)
                {
                	getCell(current.y+1, current.x).classList.remove("wall");
                	await sleep(25);
                    board[current.y + 1][current.x].wall = false;
                }
                else
                {
                	getCell(current.y-1, current.x).classList.remove("wall");
                	await sleep(25);
                    board[current.y - 1][current.x].wall = false;
                }
            }

            board[randNeighbour.y][randNeighbour.x].visited = true;
            stack.push(randNeighbour);
        }
    }

    // Cells were marked as visited. Mark them as empty again.
    for (var i = 0; i < gridRows; i++) {
        for (var j = 0; j < gridCols; j++) {
            if (board[i][j] == -1) 
            {
            	getCell(i, j).classList.remove("wall");
            	await sleep(5);

                board[i][j].wall = false;
            }
        }
    }
}

async function DFSMazeUtil()
{
	isRunning = true;
	clearGrid();

	await generateBorders();
	await DFSMaze();
	
	isRunning = false;
}
