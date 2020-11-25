var max =  800;
var strip = 70;
var bar  = 400;
var n     = 30;

var SUSCEP = 0;
var IMMUNE = 1;
var INFECT = 2;
var prob_immune = 0.7;

var scale = max/(n+1);
var rad   = 0.5*scale;
var barminx = max-bar-50;

var s;

void setup() {
  size(max, max+strip);

  s = new Array(n)
  console.log(s);
  for(var i=0; i<n; i++){
    s[i] = new Array(n);
  }
  make_board();
}

void make_board(){
  background(255,255,255);
  for(var i=0; i<n; i++){
    for(var j=0; j<n; j++){
      if(random(0.0, 1.0) < prob_immune){
	s[i][j] = IMMUNE;
      } else {
        s[i][j] = SUSCEP;
      }
    }
  }
}

void infect() {
  for(var i=0; i<n; i++){
    if(i<n-1) ip = i+1; else ip = i;
    if(i>  0) im = i-1; else im = i;
    for(var j=0; j<n; j++){
      if(s[i][j] == IMMUNE) continue;
      if(s[i][j] == INFECT) continue;
      if(j<n-1) jp = j+1; else jp = j;
      if(j>  0) jm = j-1; else jm = j;
      if(s[im][j] == INFECT || s[ip][j] == INFECT || s[i][jm] == INFECT || s[i][jp] == INFECT){
        if(random(0.0, 1.0) < 0.1){
	  s[i][j] = INFECT;
	}
      }
    }
  }
}

void draw() {
  noStroke();
  textSize(15);
  fill(255, 255,   0); ellipse(30, 10, rad, rad); fill(0,0,0); text('Susceptible', 50, 20);
  fill(  0,   0, 255); ellipse(30, 30, rad, rad); fill(0,0,0); text('Immune',      50, 40);
  fill(255,   0,   0); ellipse(30, 50, rad, rad); fill(0,0,0); text('Infected',    50, 60);
  fill(200,200,200);
  rect(barminx, 10, bar, 10);
  stroke(0,0,0);
  line(barminx + prob_immune*bar, 10, barminx + prob_immune*bar, 30);
  fill(0,0,0);
  text('Immune percentage = ' + floor(prob_immune*100), barminx, 60);
  noStroke();

  for(var i=0; i<n; i++){
    for(var j=0; j<n; j++){
      if(s[i][j] == SUSCEP){ fill(255, 255,   0); } 
      if(s[i][j] == IMMUNE){ fill(  0,   0, 255); } 
      if(s[i][j] == INFECT){ fill(255,   0,   0); } 
      ellipse((i+1)*scale, (j+1)*scale+strip, rad, rad);
    }
  }
  infect();
}

void mouseClicked() {
  if(mouseY > strip){
    i = floor(mouseX/scale - 0.5);
    j = floor((mouseY-strip)/scale - 0.5);
    s[i][j] = 2;
  } else {
    if(mouseX > barminx){
      prob_immune = (mouseX - barminx)/bar;
      console.log('prob_immune', prob_immune);
      make_board();
    }
  }
}
