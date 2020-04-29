var iSize, jSize;   // width(i)/height(j) of array/field
var count = 0;      // number of edges. if n-1 nodes -> end prim alg
var speed;
var array = [];        // array with all nodes			
var father = [];       // saves father of node at index
var safe = [];          // all safe edges
var mst = [];           // array with all nodes and edges of mst
var size = 1;

async function PrimsMazeUtil()
{
	isRunning = true;
	clearGrid();
	for(var i=0; i<gridRows; i++)
	{
		for(var j=0; j<gridCols; j++)
			getCell(i, j).classList.add("wall");
		await sleep(50);
	}
	getCell(startRow, startCol).classList.remove("wall");
    getCell(stopRow, stopCol).classList.remove("wall");
	iSize = (gridRows-1)/2;
    jSize = (gridCols-1)/2;
    speed = 30;
    array.length = 0;
    father.length = 0;
    safe.length = 0;
    mst.length = 0;
    count = 0;

    await startExec();
    isRunning = false;

}

// Node with edges
function Node(x, y, size, value) 
{
    this.x = x * size * 2;         // coords
    this.y = y * size * 2;
    this.size = size;   // width and height of node
    this.value = value; // position in a simulated one dimensional array

    this.gray = false;  // gray when it becomes part of minimal spanning tree
    this.path = false;  // true when node is on path from start node to end node
    this.current = false;  // if true, node is the newest node of mst
    this.ed = [];       // array with all of node's edges
    this.graphics = graphics;

    function graphics() 
    {
        if (this.gray) 
        {
        	if (this.path || this.current);
        	else
        		getCell(this.y+1, this.x+1).classList.remove("wall");      
        		//ctx.fillStyle = "white";
            //ctx.fillRect(this.x, this.y, this.size, this.size);            
        }
    }
}

// edge with weight and two nodes
function Edge(a, b, edge) 
{
    this.a;             // node at the end of edge
    this.b;             // node at the end of edge
    this.weight;            // weight of edge. either 0 or 1
    this.minimal = false;   // true if part of minimal spanning tree
    
    if (typeof a == "undefined" && typeof b == "undefined" && typeof edge == "undefined")
        this.weight = 1000;
    else if (typeof edge == "undefined") 
    {
        this.weight = Math.round(Math.random());
        this.a = a;
        this.b = b;
    }
    else 
    {
        this.weight = edge.weight;
        this.a = a;
        this.b = b;
    }

    this.graphics = graphics;

    function graphics() 
    {
        if (this.minimal) 
        {
            var size = a.size;

            if (a.path && b.path);
            else
            	getCell(Math.floor((a.y+b.y)/2)+1, Math.floor((a.x+b.x)/2)+1).classList.remove("wall"); 
            	//ctx.fillStyle = "white";
            
            // ctx.fillRect((a.x + b.x) / 2, (a.y + b.y) / 2, size, size);            
        }
    }
}

// first function to get called. Calls all other needed functions-.
function startExec() 
{
    setup();

    running = true;
    getCell(1, 1).classList.remove("wall");
    startTimer = setInterval(function () 
    {
        prim();
    }, speed);
}


// fills array with nodes and sets up all edges.
function setup() {

	// loops through array to fill with nodes. 
    for (var i = 0; i < iSize; i++) 
    {
        array[i] = [];
        for (var j = 0; j < jSize; j++) 
        {
            array[i][j] = new Node(j, i, size, i * jSize + j);
        }
    }
    
    // Loops through array and sets up all horizontal Edges. 
    for (var i = 0; i < iSize; i++) 
    {
        for (var j = 0; j < jSize - 1; j++) 
        {
            // Creates a new Edge between a Node and its right neighbor and puts it in the Node's edArray
            array[i][j].ed[0] = new Edge(array[i][j], array[i][j + 1]);
            // Creates a new Edge between the same Nodes with the same weight and puts it in the other Node's edArray
            array[i][j + 1].ed[2] = new Edge(array[i][j + 1], array[i][j], array[i][j].ed[0]);
        }
    }
    
    // Loops through array and sets up all vertical Edges.
    for (var i = 0; i < iSize - 1; i++) 
    {
        for (var j = 0; j < jSize; j++) 
        {
            // Creates a new Edge between a Node and its lower neighbor and puts it in the Node's edArray
            array[i][j].ed[1] = new Edge(array[i][j], array[i + 1][j]);
            // Creates a new Edge between the same Nodes with the same weight and puts it in the other Node's edArray
            array[i + 1][j].ed[3] = new Edge(array[i + 1][j], array[i][j], array[i][j].ed[1]);
        }
    }

    father[0] = array[0][0]; // father of start node is start node 

	safe[0] = array[0][0].ed[0];	// all edges of start node are safe. 
	safe[1] = array[0][0].ed[1];

	array[0][0].gray = true; // start node is already part of minimal spanning tree 
	array[0][0].path = true; // start node also part of path to node at upper right corner 

	mst[0] = array[0][0];
	mst[0].graphics();

}

function prim() 
{
    var min = new Edge();
    
    // with each iteration (since a timer is used, rather with each call of this function)
    // the newly added node (min.b) is drawn onto the canvas with red color, to show how the algorithm works.
    // however, when a new node is added the one that used to be the most recent one will be colored white again.
    var oldNode = mst[mst.length-1]; 
    oldNode.current = false;
    oldNode.graphics();
    
    /*
	 * loops through all edges of array "safe". compares weight of all safe edges to get edge with least weight
	 * edge also has to lead to a node that isnt part of MST (minimal spanning tree)
	 * breaks if edge with minimum weight of 0 has been found.
	 * 
	 * First if() to reduce size of list for runtime optimization. 
	 * Loops through list to find edges that dont have non-MST nodes anymore and removes them from list.
	 */
    for (var l = 0; l < safe.length; l++) {
        
        if (safe[l].a.gray && safe[l].b.gray) 
        {
            safe.splice(l, 1);
            continue;
        }
       
        if ((safe[l].weight < min.weight) && (!(safe[l].b.gray))) {
            min = safe[l];
            if (min.weight === 0)
                break;
        }
    }

    /*
     * all edges of the new node from the minimal edge are put into the safe list. light edges at front, heavy ones at end.
	 */
    for (var i = 0; i < 4; i++) 
    {
        if (typeof min.b.ed[i] != "undefined" && !(min.b.ed[i].b.gray)) 
        {
            if (min.b.ed[i].weight > 0)
                safe[safe.length] = min.b.ed[i];
            else
                safe.splice(0, 0, min.b.ed[i]);
        }
    }

    min.b.gray = true;	         // new node from minimal edge ist part of MST
    min.b.current = true;		 // min.b is newest node of mst, is colored red.
    min.minimal = true;		     // edge is part of MST

    min.b.graphics();            // paint new edge and new node
    min.graphics();

    mst[mst.length] = min;
    mst[mst.length] = min.b;     // add edge and node to mst

    //safe.remove(min);			 // removes the added edge from list for unneccessary further comparisons
    father[min.b.value] = min.a; // node a of edge is father of node b from the same edge
    count++;					 // addition of edge to MST
    
    if (count === (iSize * jSize) - 1) 
    {    // algorithm complete. stop execution.
    	//min.b.current = false;
    	min.b.graphics();
        clearInterval(startTimer);
    }
}

// displays the path from start node to end node
// or rather marks all nodes and edges that are on the path
// and then calls the paint function.
function pathDisplay() 
{
    var k = array[u][v];
    while (father[k.value].value !== k.value) 
    {
        k.path = true;
        k = father[k.value];
    }
    array[0][0].path = true;
    paintAllObjects();
}

// paints all objects that are part of the minimal spanning tree
function paintAllObjects() 
{
    for (var i = 0; i < mst.length; i++) 
        mst[i].graphics();
}
