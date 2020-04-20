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

    for (var i = 2; i < gridRows-1; i += 2) 
    {
        for (var j = 1; j < gridCols-1; j++) 
        {
        	if(getCell(i, j).classList.contains("start") || getCell(i, j).classList.contains("stop"))
        		continue;
        	getCell(i, j).classList.add("wall");
        	await sleep(1);
            board[i][j].visited = false, board[i][j].wall = true;
        }
    }
    for (var j = 2; j < gridCols-1; j+=2) 
    {
        for (var i = 1; i < gridRows-1; i++) 
        {
        	if(getCell(i, j).classList.contains("start") || getCell(i, j).classList.contains("stop"))
        		continue;
        	getCell(i, j).classList.add("wall");
        	await sleep(1);
            board[i][j].visited = false, board[i][j].wall = true;
        }
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

        var validNeighbors = [];
        var straightMoves = [[0, -2], [0, 2], [-2, 0], [2, 0]];

        for (var move of straightMoves) 
        {
            var newNodePosition = 
            {
                x: current.x + move[0],
                y: current.y + move[1]
            };

            if (!isOnBoard(newNodePosition) || board[newNodePosition.y][newNodePosition.x].visited) 
            {
                continue;
            }

            validNeighbors.push(newNodePosition);
        }

        // If we have available neighbor(s), we choose a random neighbor
        // and remove the wall(obstacle cell) between these two cell.
        if (validNeighbors.length > 0) 
        {
            stack.push(current);
            var randNeighbor = validNeighbors[Math.floor(Math.random() * 101) % validNeighbors.length];

            if (randNeighbor.y == current.y) 
            { // Same row
                if (randNeighbor.x > current.x) 
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
                if (randNeighbor.y > current.y)
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

            board[randNeighbor.y][randNeighbor.x].visited = true;
            stack.push(randNeighbor);
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
