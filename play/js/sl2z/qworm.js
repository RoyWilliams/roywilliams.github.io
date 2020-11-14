var rad = 400;
var max = 8;
var x;
var y;
twopi = 2*3.14159265;

void setup() {
  size(2*rad, 2*rad);
}

//mouseClicked = function() {
void draw(){
  background(255,255,255);
  fill(240,240,240);
  ellipse(rad, rad, rad*2, rad*2);
  qx = (mouseX - rad)/rad;
  qy = (mouseY - rad)/rad;
  d = sqrt(qx*qx+qy*qy);
//  if(d >= 1.0) return;

//  console.log(qx, qy);
  x = atan2(qy, qx)/twopi;
  y = -log(d)/twopi;

  next("", [1, 0, 0, 1]);
}

function apps(m){
    a = m[0]; b = m[1]; c = m[2]; d = m[3];
    return [-c, -d, a, b];
}

function appt(m){
    a = m[0]; b = m[1]; c = m[2]; d = m[3];
    return [a+c, b+d, c, d];
}

function appu(m){
    a = m[0]; b = m[1]; c = m[2]; d = m[3];
    return [a-c, b-d, c, d];
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
    
    radius = 80/L;
    p = p*twopi;
    q = q*twopi;
    ellipse(rad*(1+cos(p)*exp(-q)), rad*(1+sin(p)*exp(-q)), radius, radius);


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
