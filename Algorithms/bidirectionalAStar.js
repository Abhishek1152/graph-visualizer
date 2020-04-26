var StartclosedList = [];
var StopclosedList = [];
var cellDetails = [];

async function bidirectionalAStar()
{
    var beginRow = startRow, beginCol = startCol;
    var endRow = stopRow, endCol = stopCol;
    cellDetails[beginRow][beginCol].f = 0;
    cellDetails[beginRow][beginCol].g = 0;
    cellDetails[beginRow][beginCol].h = 0;

}


async function bidirectionalAStarUtil()
{
    isRunning = true;
    clearAnimatedCells();
    for(var i=0; i<gridRows; i++) 
    {
        dist[i] = [];
        closedList[i] = [];
        cellDetails[i] = [];
        for(var j=0; j<gridCols; j++) 
        {
            dist[i][j] = Number.MAX_SAFE_INTEGER;
            closedList[i][j] = false;
            cellDetails[i][j] = {"f":Number.MAX_SAFE_INTEGER,
                                 "g":Number.MAX_SAFE_INTEGER,
                                 "h":Number.MAX_SAFE_INTEGER,
                                 "parent_i": -1, "parent_j": -1};
        }
    }
    await bidirectionalAStar();

}