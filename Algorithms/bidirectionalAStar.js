var StartclosedList = [];
var StopclosedList = [];
var StartcellDetails = [];
var StopcellDetails = [];
var predecessor = [];

function checkIntersection(row, col)
{
    //console.log(StartclosedList[row][col], StopclosedList[row][col]);
    return (StartclosedList[row][col] && StopclosedList[row][col]);
}

function isPathforBidirAStar(row, col, closedList)
{
    return (!closedList[row][col] && !getCell(row, col).classList.contains("wall") 
        || getCell(row, col).classList.contains("stop"));
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
            currentCell = getCell(row1, col1);
            currentCell.classList.add("animateCell");
            await sleep(ms);
            StartclosedList[row1][col1] = true;
            if(checkIntersection(row1, col1))
            {
                await drawPath(predecessor);
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
                        gNew = StartcellDetails[row1][col1].g + 1 //getCell(i+1, j).classList.contains("weight")? 5 : 1;
                        hNew = Math.abs(stopRow-(row1+neighbours[i][0])) + Math.abs(stopCol - (col1+neighbours[i][1]));
                        fNew = gNew + hNew;
                        if(StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f == INT_MAX
                            || StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f > fNew)
                        {
                            StartopenList.enqueue([row1+neighbours[i][0], col1+neighbours[i][1]], fNew);
                            StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f = fNew;
                            StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].g = gNew;
                            StartcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].h = hNew;
                            predecessor[row1+neighbours[i][0]][col1+neighbours[i][1]].r = row1;
                            predecessor[row1+neighbours[i][0]][col1+neighbours[i][1]].c = col1;
                        }
                    }
                }
            }
        }
        if(!StopopenList.isEmpty())
        {
            var p1 = StopopenList.dequeue();
            row1 = p1.element[0], col1 = p1.element[1];
            currentCell = getCell(row1, col1);
            currentCell.classList.add("animateCell");
            await sleep(ms);
            StopclosedList[row1][col1] = true;
            if(checkIntersection(row1, col1))
            {
                await drawPath(predecessor);
                break;
            }
            var gNew, hNew, fNew;
            var neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for(var i=0; i<neighbours.length; i++)
            {
                if(isValidCell(row1+neighbours[i][0], col1+neighbours[i][1]) && isPathforBidirAStar(row1+neighbours[i][0], col1+neighbours[i][1], StopclosedList))
                {
                    if(!StopclosedList[row1+neighbours[i][0]][col1+neighbours[i][1]])
                    {
                        gNew = StopcellDetails[row1][col1].g + 1 //getCell(i+1, j).classList.contains("weight")? 5 : 1;
                        hNew = Math.abs(startRow-(row1+neighbours[i][0])) + Math.abs(startCol-(col1+neighbours[i][1]));
                        fNew = gNew + hNew;
                        if(StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f == INT_MAX
                            || StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f > fNew)
                        {
                            StopopenList.enqueue([row1+neighbours[i][0], col1+neighbours[i][1]], fNew);
                            StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].f = fNew;
                            StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].g = gNew;
                            StopcellDetails[row1+neighbours[i][0]][col1+neighbours[i][1]].h = hNew;
                            predecessor[row1+neighbours[i][0]][col1+neighbours[i][1]].r = row1;
                            predecessor[row1+neighbours[i][0]][col1+neighbours[i][1]].c = col1;
                        }
                    }
                }
            }
        }
    }







}


async function bidirectionalAStarUtil()
{
    isRunning = true;
    clearAnimatedCells();
    for(var i=0; i<gridRows; i++) 
    {
        dist[i] = [];
        StartclosedList[i] = [];
        StopclosedList[i] = [];
        StartcellDetails[i] = [];
        StopcellDetails[i] = [];
        predecessor[i] = [];

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
            predecessor[i][j] = {r: -1, c: -1};
        }
    }
    await bidirectionalAStar();
    isRunning = false;

}