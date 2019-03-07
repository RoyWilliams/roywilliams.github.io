var maxx = 500;  // screen size
var maxy = 500;
void setup() {
  size(maxx, maxy);
}


var dt                = 0.3;
var nstep             = 4;
var num_worm_segments = 5;  // initial number of segments
var worm_seg_radius   = 10; // pixels for drawing
var worm_head_radius  = 15; // pixels for drawing

var mouse_repulsion   = -0.05; // response of meworm head to mouse
var chaser_repulsion  = -0.04; // response of chaser head to tailend
var well              = 0.0;  // pull to center
var tail_inertia      = 0.05; // +ve tail sicks, -ve follows well

var nblob             = 5;    // initial number of blobs (feeding stations)
var blob_radius       = 50;   // for drawing
var close_enough      = 7;   // how close for chasers to get meworm tail

var nchasers          = 3;   // number of chasing worms
var new_chaser_rate   = 4;   // rate of random formation of new worms

// do not change anything under here

var started = 0;
var meworm  = 0;
var chasers = [];

var xblob=[nblob];
var yblob=[nblob];
var rblob=[nblob];
var kold = -1;


var maxSegs = 0;

for(var is=0; is<nblob; is++){
    xblob[is] = random(30,maxx-30);
    yblob[is] = random(30,maxy-30);
    rblob[is] = blob_radius;
}

var in_blob = function(x, y){
    for(var i=0; i<nblob; i++){
        var ex = xblob[i] - x;
        var ey = yblob[i] - y;
        if(ex*ex+ey*ey < rblob[i]*rblob[i]){
            return i;
        }
    }
    return -1;
};

var Worm = function(){
    this.num_worm_segments = num_worm_segments;
    this.worm_seg_radius = 10;
    var worm_head_radius = 15;
    var N = this.num_worm_segments;
    this.x = [];
    this.y = [];
    this.dx = [];
    this.dy = [];
    var xr = random(30,maxx-30);
    var yr = random(30,maxy-30);
    for(var i=0; i<N; i++){
        this.x[i] = xr;
        this.y[i] = yr;
    }

this.evolve = function(xt, yt, mouse_repulsion, well, tail_inertia) {
    var N = this.num_worm_segments;
    this.dx[0] = -mouse_repulsion*(xt - this.x[0]) - well*(this.x[0]-maxx/2);
    this.dy[0] = -mouse_repulsion*(yt - this.y[0]) - well*(this.y[0]-maxy/2);
    this.dx[N-1] = this.x[N-2] - this.x[N-1];
    this.dy[N-1] = this.y[N-2] - this.y[N-1];
    for(var i=1; i<N-1; i++){
        this.dx[i] = -2*this.x[i] + this.x[i+1] + this.x[i-1] + tail_inertia*(this.x[i]-this.x[i-1]);
        this.dy[i] = -2*this.y[i] + this.y[i+1] + this.y[i-1] + tail_inertia*(this.y[i]-this.y[i-1]);
    }
    
    for(var i=0; i<N; i++){
        var dtt;
        dtt = dt;
        this.x[i] += dtt*this.dx[i];
        this.y[i] += dtt*this.dy[i];
        if(this.x[i] < 0){ this.x[i] = 0; }
        if(this.y[i] < 0){ this.y[i] = 0; }
        if(this.x[i] >= maxx){ this.x[i] = maxx-1; }
        if(this.y[i] >= maxy){ this.y[i] = maxy-1; }
    }
};
        
this.draw = function(icolor){
    var N = this.num_worm_segments;
    for(var i = 0; i < N-1; i+=1){
        line(this.x[i],this.y[i],  this.x[i+1],this.y[i+1]);
    }
// worm head is 0 and tail is 1 to N-1
    if(icolor === 1) {
        fill(0, 38, 255);
        ellipse(this.x[0], this.y[0], 2*worm_head_radius, 2*worm_head_radius);
        fill(255, 242, 0);
    }
    else             {
        fill(255, 0, 200);
        ellipse(this.x[0], this.y[0], worm_head_radius, worm_head_radius);
        fill(173, 173, 173);
    }
    
    for(var i = 1; i < N; i+=1){
        ellipse(this.x[i], this.y[i], worm_seg_radius, worm_seg_radius);
    }
};

this.on_head = function(x, y) { 
    var ex = this.x[0] - x;
    var ey = this.y[0] - y;
    if(ex*ex+ey*ey < close_enough*close_enough){
        return 1;
    }
    return 0;
};

this.on_end_tail = function(x, y) { 
    var N = this.num_worm_segments;
    var ex = this.x[N-1] - x;
    var ey = this.y[N-1] - y;
    if(ex*ex+ey*ey < close_enough*close_enough){
        return 1;
    }
    return 0;
};

this.add_seg = function() {
    var n = this.num_worm_segments;
    this.x[n] = this.x[n-1];
    this.y[n] = this.y[n-1];
    this.num_worm_segments += 1;
};

this.sub_seg = function() {
    this.num_worm_segments -= 1;
    if(this.num_worm_segments < 2) {
        return -1;
    } else {
        return 1;
    }
};
};

mouseClicked = function() {
    if(started === 0){
        started = 1;
        meworm = new Worm();
        for(var ichasers=0; ichasers<nchasers; ichasers++){
            chasers.push(new Worm());
        }
    }
};


var drawWorms = function() {
    var n;
    var prevW;
    for(var i=0; i<nstep; i++){
        meworm.evolve(mouseX, mouseY, mouse_repulsion, well, tail_inertia);
        for(var ichasers=0; ichasers<nchasers; ichasers++){
            n = meworm.num_worm_segments;
            chasers[ichasers].evolve(meworm.x[n-1]+random(-100,100), meworm.y[n-1]+random(-100,100), chaser_repulsion, 0, tail_inertia);
        }
    }

    for(var i=0; i<nblob; i++){
        if(i === kold){
            fill(178, 204, 30);
        } else {
            fill(59, 130, 14);   // green obstacles
        }
        ellipse(xblob[i], yblob[i], rblob[i], rblob[i]);
    }
    
//    fill(245, 12, 12);
//    ellipse(mouseX, mouseY, 15, 15); // mouse is red spot
    
    meworm.draw(1);
    for(var ichasers=0; ichasers<nchasers; ichasers++){
        chasers[ichasers].draw(2);
    }
 
    var k = in_blob(meworm.x[0], meworm.y[0]);

    if(k>=0 && k !== kold){
        kold = k;
        meworm.add_seg();
    }

    for(var ichasers=0; ichasers<nchasers; ichasers++){
        var w = chasers[ichasers];
// if chaser on my tail
        if(meworm.on_end_tail(w.x[0], w.y[0])){
            meworm.sub_seg();
            w.add_seg();
            // randomize the head
            w.x[0] = random(20,maxx-20);
            w.y[0] = random(20,maxy-20);
        }
// if my head on chaser head
        if(w.on_head(meworm.x[0], meworm.y[0])){
            w.num_worm_segments = 0;
            chasers.splice(ichasers,1);
            nchasers -= 1;
            meworm.x[0] = random(20,maxx-20);
            meworm.y[0] = random(20,maxy-20);
        }
    }
    
    if(random(0,1000) < new_chaser_rate){
        chasers.push(new Worm());
        nchasers += 1;
    }
    
    if(meworm.num_worm_segments > maxSegs){
        maxSegs = meworm.num_worm_segments;
    }
};

void draw() {
    background(200, 200, 200);
    if(started === 0){
        fill(10, 153, 163);
        text("click2start", 200,30);
    } else {
        drawWorms();

        textSize(15);
        fill(152, 156, 179);
        text(meworm.num_worm_segments, 20,50);
    }
    
    fill(0, 34, 255);
    textSize(30);
    text('score='+maxSegs, 20,30);

    if(meworm.num_worm_segments < 2){
        started = 0;
    }
};
