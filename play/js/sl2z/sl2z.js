var midx = 500;
var maxy = 700;
var scale = 500.0;
var max = 9;
var x;
var y;

void setup() {
  size(2*midx, maxy);
}

void draw() {
  background(200,200,200);
  noFill();
  stroke(255,255,255);
  ellipse(midx,       maxy, 2*scale, 2*scale);
  ellipse(midx+scale, maxy, 2*scale, 2*scale);
  ellipse(midx-scale, maxy, 2*scale, 2*scale);
  line(midx+scale/2, 0, midx+scale/2, maxy);
  line(midx-scale/2, 0, midx-scale/2, maxy);
  y = 0.375
  ellipse(midx+scale*y, maxy, 2*scale*y, 2*scale*y);
  ellipse(midx-scale*y, maxy, 2*scale*y, 2*scale*y);
  ellipse(midx+3*scale*y, maxy, 2*scale*y, 2*scale*y);
  ellipse(midx-3*scale*y, maxy, 2*scale*y, 2*scale*y);
  x = (mouseX - midx)/scale;
  y = (maxy - mouseY)/scale;
  noStroke();
  next("", [1, 0, 0, 1,     0.3, 0.3, 0.0]);
}

function apps(m){
    a = m[0]; b = m[1]; c = m[2]; d = m[3];
    red=m[4]; gre=m[5]; blu=m[6];
    return [-c, -d, a, b, red, gre, 1-blu];
}

function appt(m){
    a = m[0]; b = m[1]; c = m[2]; d = m[3];
    red=m[4]; gre=m[5]; blu=m[6];
    return [a+c, b+d, c, d, (1+red)/2, gre, blu];
}

function appu(m){
    a = m[0]; b = m[1]; c = m[2]; d = m[3];
    red=m[4]; gre=m[5]; blu=m[6];
    return [a-c, b-d, c, d, red, (1+gre)/2, blu];
}

function next(s, m){
    var L = s.length;
    if(L > max) 
	return;

//    console.log(s, m[0], m[1], m[2], m[3]);

    a = m[0]; b = m[1]; c = m[2]; d = m[3];
    w = (c*x+d)*(c*x+d) + c*c*y*y;
    p = ((a*x+b)*(c*x+d) + a*c*y*y)/w;
    q = (a*y*(c*x+d) - (a*x+b)*c*y)/w;
    
    radius = 150/(L+1);
    red=m[4]; gre=m[5]; blu=m[6];
    fill(255*red, 255*gre, 255*blu);
    ellipse(midx+scale*p, maxy-scale*q, radius, radius);

    if (L == 0){
        next("S", apps(m));
        next("T", appt(m));
        next("U", appu(m));
    } else {
        last = s.charAt(L-1);
        if(last == "S"){
            next(s+"T", appt(m));
            next(s+"U", appu(m));
        }
        if(last == "T"){
            next(s+"S", apps(m));
            next(s+"T", appt(m));
        }
        if(last == "U"){
            next(s+"S", apps(m));
            next(s+"U", appu(m));
        }
    }
}
