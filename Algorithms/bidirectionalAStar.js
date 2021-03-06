var StartclosedList = [];
var StopclosedList = [];
var StartcellDetails = [];
var StopcellDetails = [];
var predecessor1 = [];
var predecessor2 = [];
var arg1, arg2;

/*
** @param - row: 0 base row index of a cell
** @param - col: 0 base column index of a cell
** @return: A boolean value true signifying that algorithm from the both direction has intersected at a common place,
** false otherwise.
*/
function checkIntersection(row, col)
{
    return (StartclosedList[row][col] && StopclosedList[row][col]);
}

/*
** @param - row: 0 base row index of a cell
** @param - col: 0 base column index of a cell
** @param - closedList: Boolean matrix representing if the cell is already visited or not
** @return: A boolean value true signifying the cell is walkable, false otherwise
*/
function isPathforBidirAStar(row, col, closedList)
{
    return (!closedList[row][col] && !Matrix[row][col].classList.contains("wall"));
}

/*
** @param - row: 0 base row index of the first intersected cell
** @param - col: 0 base column index of the first intersected cell
** @param - pred1: Takes predecessor1 matrix which has predecessor for every grid cells originating from start
** @param - pred2: Takes predecessor2 matrix which has predecessor for every grid cells originating from stop
** Draws the path from source to destination
*/
async function drawPathforBiDirAStar(row, col, pred1, pred2)
{
    var path1 = [], path2 = [];
    var crawl = {row: row, col: col};
    path1.push({r: row, c: col});
    while(pred1[crawl.row][crawl.col].r != -1 && 
            pred1[crawl.row][crawl.col].c != -1)
    {
        path1.push(pred1[crawl.row][crawl.col]);
        var tempRow = pred1[crawl.row][crawl.col].r, tempCol = pred1[crawl.row][crawl.col].c; 
        crawl.row = tempRow;
        crawl.col = tempCol;
    }

    crawl = {row: row, col: col};
    while(pred2[crawl.row][crawl.col].r != -1 && 
            pred2[crawl.row][crawl.col].c != -1)
    {
        path2.push(pred2[crawl.row][crawl.col]);
        var tempRow = pred2[crawl.row][crawl.col].r, tempCol = pred2[crawl.row][crawl.col].c; 
        crawl.row = tempRow;
        crawl.col = tempCol;
    }

    pathCost = -1;
    var prevRow = path1[path1.length-1].r, prevCol = path1[path1.length-1].c;

    for(var i = path1.length - 1; i >= 0; i--)
    {
        var direction;
        var cell = Matrix[path1[i].r][path1[i].c];

        if(path1[i].r - prevRow == 0)
        {
            if(prevCol - path1[i].c > 0)
                direction = "pathLeft";
            else
                direction = "pathRight";
        }
        else
        {
            if(prevRow - path1[i].r > 0)
                direction = "pathUp";
            else
                direction = "pathDown";
        }
        prevRow = path1[i].r, prevCol = path1[i].c;

        if(showAnimations)
        {
            cell.classList.remove("animateVisited");
            cell.classList.add(direction);
            await sleep(50);
            cell.classList.remove(direction);

            cell.classList.add("animatePath");
        }

        pathCost += (cell.classList.contains("weight")? 5 : 1);
    }
    for(var i = 0; i < path2.length; i++)
    {
        var direction;
        var cell = Matrix[path2[i].r][path2[i].c];

        if(path2[i].r - prevRow == 0)
        {
            if(prevCol - path2[i].c > 0)
                direction = "pathLeft";
            else
                direction = "pathRight";
        }
        else
        {
            if(prevRow - path2[i].r > 0)
                direction = "pathUp";
            else
                direction = "pathDown";
        }
        prevRow = path2[i].r, prevCol = path2[i].c;
        if(showAnimations)
        {
            cell.classList.remove("animateVisited");
            cell.classList.add(direction);
            await sleep(50);
            
            cell.classList.remove(direction);

            cell.classList.add("animatePath");
        }
        pathCost += (cell.classList.contains("weight")? 5 : 1);
    }
    if(showAnimations)
        showTimeandCost();
    isRunning = false;
}


async function bidirectionalAStar()
{
    var row1 = startRow, col1 = startCol;
    var row2 = stopRow, col2 = stopCol;
    StartcellDetails[row1][col1].f = 0;
    StartcellDetails[row1][col1].g = 0;
    StartcellDetails[row1][col1].h = 0;
    StopcellDetails[row2][col2].f = 0;
    StopcellDetails[row2][col2].g = 0;
    StopcellDetails[row2][col2].h = 0;

    var StartopenList = new PriorityQueue();
    var StopopenList = new PriorityQueue();
    StartopenList.enqueue([row1, col1], 1);
    StopopenList.enqueue([row2, col2], 1);

    while(!StartopenList.isEmpty() && !StopopenList.isEmpty())
    {
        // Evaluating for start
        if(!StartopenList.isEmpty())
        {
            var p1 = StartopenList.dequeue();
            row1 = p1.element[0], col1 = p1.element[1];
            
            if(showAnimations)
            {
                var timeStamp = performance.now();
                Matrix[row1][col1].classList.add("animateVisited");
                await sleep(ms);
                totalTimeSlept += (performance.now() - timeStamp);
            }

            StartclosedList[row1][col1] = true;

            // Path found
            if(checkIntersection(row1, col1))
            {
                found = true;
                if(showAnimations)
                    drawPathforBiDirAStar(row1, col1, predecessor1, predecessor2);

                arg1 = row1, arg2 = col1;
                break;
            }
            var gNew, hNew, fNew;
            var neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

            for(var i=0; i<neighbours.length; i++)
            {
                if(isValidCell(row1+neighbours[i][0], col1+neighbours[i][1]) && isPathforBidirAStar(row1+neighbours[i][0], col1+neighbours[i][1], StartclosedList))
                {
                    if(!StartclosedList[row1+neighbours[i][0]][col1+neighbours[i][1]])
                    {
                        gNew = StartcellDetails[row1][col1].g + (Matrix[row1][col1].classList.contains("weight")? 5 : 1);
                        hNew = Math.abs(stopRow-(row1+neighbours[i][0])) + Math.abs(stopCol - (col1+neighbours[i][1]));
                        fNew = gNew + hNew;
                        if(StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f == INT_MAX
                            || StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f > fNew)
                        {
                            StartopenList.enqueue([row1+neighbours[i][0], col1+neighbours[i][1]], fNew);
                            StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f = fNew;
                            StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].g = gNew;
                            StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].h = hNew;
                            predecessor1[row1+neighbours[i][0]][col1+neighbours[i][1]].r = row1;
                            predecessor1[row1+neighbours[i][0]][col1+neighbours[i][1]].c = col1;
                        }
                    }
                }
            }
        }
        if(!StopopenList.isEmpty())
        {
            var p1 = StopopenList.dequeue();
            row1 = p1.element[0], col1 = p1.element[1];

            if(showAnimations)
            {
                var timeStamp = performance.now();
                Matrix[row1][col1].classList.add("animateVisited");
                await sleep(ms);
                totalTimeSlept += (performance.now() - timeStamp);
            }

            StopclosedList[row1][col1] = true;

            // Path found
            if(checkIntersection(row1, col1))
            {
                found = true;
                if(showAnimations)
                    drawPathforBiDirAStar(row1, col1, predecessor1, predecessor2);

                arg1 = row1, arg2 = col1;
                break;
            }
            var gNew, hNew, fNew;
            var neighbours = [[0, 1], [0, -1], [-1, 0], [1, 0]];
            for(var i=0; i<neighbours.length; i++)
            {
                if(isValidCell(row1+neighbours[i][0], col1+neighbours[i][1]) && isPathforBidirAStar(row1+neighbours[i][0], col1+neighbours[i][1], StopclosedList))
                {
                    if(!StopclosedList[row1+neighbours[i][0]][col1+neighbours[i][1]])
                    {
                        gNew = StopcellDetails[row1][col1].g + (Matrix[row1][col1].classList.contains("weight")? 5 : 1);
                        hNew = Math.abs(startRow-(row1+neighbours[i][0])) + Math.abs(startCol-(col1+neighbours[i][1]));
                        fNew = gNew + hNew;
                        if(StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f == INT_MAX
                            || StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f > fNew)
                        {
                            StopopenList.enqueue([row1+neighbours[i][0], col1+neighbours[i][1]], fNew);
                            StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f = fNew;
                            StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].g = gNew;
                            StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].h = hNew;
                            predecessor2[row1+neighbours[i][0]][col1+neighbours[i][1]].r = row1;
                            predecessor2[row1+neighbours[i][0]][col1+neighbours[i][1]].c = col1;
                        }
                    }
                }
            }
        }
    }
}

/*
**  Utility function of Bidirectional A* to initialize values and grid
*/
async function bidirectionalAStarUtil()
{
    isRunning = true;
    clearAnimatedCells();

    var timeStamp0 = performance.now();
    totalTimeSlept = 0;
    found = false;

    for(var i=0; i<gridRows; i++) 
    {
        dist[i] = [];
        StartclosedList[i] = [];
        StopclosedList[i] = [];
        StartcellDetails[i] = [];
        StopcellDetails[i] = [];
        predecessor1[i] = [];
        predecessor2[i] = [];

        for(var j=0; j<gridCols; j++) 
        {
            dist[i][j] = INT_MAX;
            StartclosedList[i][j] = false;
            StopclosedList[i][j] = false;
            StartcellDetails[i][j] = {f: INT_MAX,
                                g: INT_MAX,
                                h: INT_MAX};
            StopcellDetails[i][j] = {f: INT_MAX,
                                g: INT_MAX,
                                h: INT_MAX};
            predecessor1[i][j] = {r: -1, c: -1};
            predecessor2[i][j] = {r: -1, c: -1};
        }
    }

    await bidirectionalAStar();
    var timeStamp1 = performance.now();

    executionTime = (timeStamp1-timeStamp0) - totalTimeSlept;
    if(!showAnimations && found)
        drawPathforBiDirAStar(arg1, arg2, predecessor1, predecessor2);
    
    if(!found)
        isRunning = false;
}