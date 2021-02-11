var startTimerKl;
var countKl;      // number of edges. if n-1 nodes -> end prim alg
var iSizeKl, jSizeKl;   // width(i)/height(j) of array/field
var speedKl;
var sizeKl;
var arrayKl = [];        // array with all nodes		
var edgesKl = [];           // array with all edges

async function KruskalMazeUtil()
{
    if(isRunning)
        return;
	isRunning = true;
	clearGrid();
	for(var i=0; i<gridRows; i++)
	{
		for(var j=0; j<gridCols; j++)
			Matrix[i][j].classList.add("wall");
		await sleep(50);
        Matrix[startRow][startCol].classList.remove("wall");
        Matrix[stopRow][stopCol].classList.remove("wall");
	}
    
	iSizeKl = (gridRows-1)/2;
    jSizeKl = (gridCols-1)/2;
    speedKl = 10;
    sizeKl = 1;
    countKl = 0;
    arrayKl.length = 0;
    edgesKl.length = 0;

	startExecKruskal();
	isRunning = false;
}


// Node with edges
function NodeKl(x, y, size) 
{
    this.x = x * size * 2;         // coords
    this.y = y * size * 2;
    this.size = size;   // width and height of node
    this.father = this;	// if father of node is node itself, then node is representative of its set.
    this.height = 0; 	// number of levels of tree (set). only important if node is representative of set. when union(), node with greater height remains representative.
    
    this.graphics = graphics;

    function graphics() 
    {
    	Matrix[this.y+1][this.x+1].classList.remove("wall");        
    }
}

// edge with two nodes
function EdgeKl(a, b) 
{
    this.a = a;             // node at the end of edge
    this.b = b;             // node at the end of edge
    this.size = a.size;

    this.graphics = graphics;

    function graphics() 
    {
    	Matrix[Math.floor((a.y+b.y)/2)+1][Math.floor((a.x+b.x)/2)+1].classList.remove("wall");         
    }
}

// first function to get called. Calls all other needed functions-.
function startExecKruskal() 
{
    setupKruskal();
    startTimerKl = setInterval(function () 
    {
        kruskal();
    }, speedKl);
}

// fills array with nodes and sets up all edges.
function setupKruskal() 
{

	// loops through array to fill with nodes. 
    for (var i = 0; i < iSizeKl; i++) 
    {
        arrayKl[i] = [];
        for (var j = 0; j < jSizeKl; j++) 
        {
            arrayKl[i][j] = new NodeKl(j, i, sizeKl);
        }
    }
    
    // Loops through array and sets up all horizontal Edges. 
    for (var i = 0; i < iSizeKl; i++) 
    {
        for (var j = 0; j < jSizeKl - 1; j++) 
        {
            edgesKl[edgesKl.length] = new EdgeKl(arrayKl[i][j], arrayKl[i][j + 1]);
        }
    }
    
    // Loops through array and sets up all vertical Edges. 
    for (var i = 0; i < iSizeKl - 1; i++) 
	{
        for (var j = 0; j < jSizeKl; j++) 
        {
            edgesKl[edgesKl.length] = new EdgeKl(arrayKl[i][j], arrayKl[i + 1][j]);
        }
    }
    
    // creates random order in which edges are selected.
    shuffleKl(edgesKl);

}

// shuffles array
function shuffleKl(array) 
{
	var counter = array.length;
	var temp;
	var index;
	
	while (counter > 0) 
	{
		index = Math.floor(Math.random()*counter);
		counter--;
		
		temp = array[index];
		array[index] = array[counter];
		array[counter] = temp;
	}
}

function kruskal() 
{
    
    var edge = edgesKl.pop();
    
    // checks if selected edge is valid
    // nodes that are connected by edge have to be from a different set.
    //console.log(edge);
    if (findKl(edge.a) !== findKl(edge.b)) 
    {
    	unionKl(edge.a, edge.b);
    	edge.graphics();
    	edge.a.graphics();
    	edge.b.graphics();
    	
    	countKl++;
    }
	
    if (countKl === (iSizeKl * jSizeKl) - 1) 
    {    
    	// algorithm complete. stop execution.
        clearInterval(startTimerKl);
    }
}

// find operation.
// expects a node as parameter and returns the representative from the node's set.
function findKl(node) 
{
	
	var height = 0;
	
	while(node !== node.father) 
	{
		node = node.father;
		height++;
	}
	node.height = height;
	
	return node;
}

// two nodes as parameters.
// joins the two sets. 
// the set (tree) with the lower height is added under the other set's root (its representative) to reduce runtime.
function unionKl(a, b) 
{
	var repA = findKl(a);
	var repB = findKl(b);
	
	if (repA.height >= repB.height)
		repB.father = repA;
	else
		repA.father = repB.father;
}
