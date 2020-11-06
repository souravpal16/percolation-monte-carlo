class Cell{
    constructor(flag, id){
        this.flag = flag;   //flag = 0/1
        this.id = id;       // row = i, col = 
    }
}

function make_matrix(n){
    var a = new Array(n);
    for(var i=0; i<n; i++){
        a[i] = new Array(n);
    }
    for(var i = 0; i<n; i++){
        for(j = 0; j<n; j++){
            a[i][j] = new Cell(0, n*i+j);
        }
    }
    return a;
}

function root(connect, i){
    while(i != connect[i]){
        i = connect[i];
    }
    return i;
}

function find(connect, i, j){
    return root(connect, i) == root(connect, j);
}

function quick_union(connect, p, q){
    var i = root(connect, p);
    var j = root(connect, q);
    connect[i] = j;
}

function make_connections(connect, a, n){
    for(var i = 0; i<n; i++){
        for(var j = 0; j<n; j++){
            if(j+1<n && a[i][j].flag == 1 && a[i][j+1].flag == 1){
                var pid = a[i][j].id
                var qid = a[i][j+1].id
                quick_union(connect, pid, qid) 
            }
            if(i+1<n && a[i][j].flag == 1 && a[i+1][j].flag == 1){
                var pid = a[i][j].id
                var qid = a[i+1][j].id
                quick_union(connect, pid, qid) 
            }
        }
    }
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var n = prompt("Enter :size of square matrix");
var a = make_matrix(n);
var connect = []
for(var i = 0; i<n*n; i++){
    connect.push(i);
}
var connections = document.getElementById("connections")

canvas.width = 30*n;
canvas.height = 30*n;

ctx.fillStyle="black"
ctx.fillRect(0,0,30*n, 30*n)

var id = setInterval(func, 50)
var count = 0
function func(){
    var v = verdict(connect)
    if(v == "Connected"){
        connections.innerHTML +=  "The system percolates after opening " + count + " sites.<br>";
        connections.innerHTML += "The percolation threshold is: "+ count / (n*n);
        clearInterval(id)
    }
    else{
        x = random_number()
        y = random_number()
        if(a[y][x].flag==1){
            return;
        }
        ctx.fillStyle="white"
        ctx.fillRect(30*x, 30*y, 30, 30)
        a[y][x].flag = 1
        count++;
        make_connections(connect, a, n)
    }
}

function random_number(){
    return Math.floor(Math.random()*n)
}

function id_to_coordiante(i){
    coordinate = []
    var x = (i - (i%n))/n
    var y = i % n
    coordinate.push(x)
    coordinate.push(y)
    return coordinate
}

function color_change(i, j){
    ctx.fillStyle="#33CFFF"
    ctx.fillRect(30*i, 30*j, 30, 30)
}

function verdict(connect){
    for(var i = 0; i<n; i++){
        for(var j=0; j<n; j++){
            if(find(connect, i, j+n*(n-1))){
                // i ka color change
                var i_coordiante = id_to_coordiante(i)
                color_change(i_coordiante[0], i_coordiante[1])
                
                for(var k = 0; k<n*n; k++){
                    if(find(connect,i, k)){
                        //k ka color change
                        var k_coordinate = id_to_coordiante(k)
                        color_change(k_coordinate[1], k_coordinate[0])
                    }
                }
                return "Connected"
            }
            if(i==n-1 && j==n-1){
                return "Not connected"
            }
        }
    }
}

function Run_one_simulation(i){
    //make an empty matrix
    a = make_matrix(n)
    var connect = [];
    for(var i = 0; i<n*n; i++){
        connect.push(i);
    }
    var count = 0;
    //open cell until percolates 
    var v = "Not connected";
    while(v != "Connected"){
        x = random_number()
        y = random_number()
        if(a[y][x].flag==1){
            continue;
        }
        a[y][x].flag = 1
        count++;
        make_connections(connect, a, n)
        v = verdict(connect)
    }
    //return the count
    return count
}

var minMax = document.getElementById('min-max')
function buttonFunction(){
   
    var cache = [];
    for(i=0; i<100; i++)
    {
        var one_simulation_result = Run_one_simulation(i)
        cache.push(one_simulation_result)
        if(i==99){
            ctx.fillStyle="black"
            ctx.fillRect(0,0,30*n, 30*n)
        }
    }
    var mean = find_x_mean(cache, 100);
    var vari = variance(mean, cache, 100);
    // b = cumulative(cache)   //b = cumulative cache
    for(i = 0; i<cache.length; i++){
        console.log(cache[i])
    }

    X = plot(cache)
    minMax.innerHTML = ""
    minMax.innerHTML += "The threshold value for percolation in this " +n+"X"+n+" grid is: "+ mean 
    minMax.innerHTML += "<br>The standard deviation of the percolation threshold is: "+vari
    minMax.innerHTML += "<br>Value of site vacancy below which no percolation is possible in a "+n+"X"+n+" grid is: "+X[1]
    minMax.innerHTML += "<br>Value of site vacancy above which "+n+"X"+n+" grid always percolates is: "+X[X.length - 2]
}

function display(cache){
    for(i = 0; i<cache.length; i++)
    {
        console.log(cache[i][0], cache[i][1] )
    }
}

function find_x_mean(cache, x){      //x = number of simulations
    var sum = 0;
    for(i = 0; i<cache.length; i++){
        sum += cache[i];
    }
    sum = sum / (n*n)
    var mean = sum / x
    return mean;
}

function variance(mean, cache, x){    // x = number of simulations
    var sum = 0;
    mean = mean;
    for(i = 0; i<cache.length; i++){
        sum += (cache[i]/(n*n) - mean)*(cache[i]/(n*n) - mean);
    }
    var vari = sum / (x-1);        //vari = variance

    return vari;
}

function sort_cache(cache){
    for(var i = 1; i<cache.length; i++){
        var key = cache[i];
        var j = i-1;
        while(j >= 0 && cache[j]>key){
            cache[j+1] = cache[j];
            j = j - 1;
        }
        cache[j + 1] = key;
    }
}

function cache_count(cache){
    var cache_frequency = []
    var size = cache.length
    for(i = 0; i<size; i++){
        var count = 1;
        while(i+1<size &&cache[i] == cache[i+1]){
            count++;
            i++;
        }
        cache_frequency.push([cache[i], count]);
    }
    return cache_frequency;
}

function cumulative(cache){
    sort_cache(cache)
    var cache_cumulative_count = cache_count(cache)
    for(i = 1; i<cache_cumulative_count.length; i++){
        var x = cache_cumulative_count[i-1][1]
        cache_cumulative_count[i][1] += x;
        x = cache_cumulative_count[i-1][1]
    }
    return cache_cumulative_count
}

function plot(cache){
    cumulative_count = cumulative(cache)
    X = []
    Y = []
    X.push(0)
    Y.push(0)
    for(i=0; i<cumulative_count.length; i++){
        X.push(cumulative_count[i][0] / (n*n))
        Y.push(cumulative_count[i][1] / 100)
    }
    X.push(1)
    Y.push(1)
    var trace1 = {
        x: X,
        y: Y,
        type: 'scatter'
        };
    var data = [trace1];

    Plotly.newPlot('myDiv', data);
    return X
}

