var maxx = 800;  // screen size
var maxy = 800;
void setup() {
  size(maxx, maxy);
}

var n = 0;   // num nodes
var x = [];  // nodes
var y = [];  // nodes
var ne = 0;  // num elements
var e = [];  // elements as [[4,3,77],[33,42,76], ...]
var r = [];   // radii as [[1.2,1.3,1.4], [2.4,3.4,8.6], ...

var rd = [];
var nrd = 0;
var rad = 6;

var cadd = function(a,b){
    return [a[0]+b[0], a[1]+b[1]];
};
var cmul = function(a, b){
    return [a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0]];
};
var smul = function(a, b){
    return [a*b[0], a*b[1]];
};
var csqrt = function(a){
    var th = 0.5*atan2(a[1],a[0]);
    var rq = sqrt(sqrt(a[0]*a[0]+a[1]*a[1]));
    var q = [rq*cos(th), rq*sin(th)];
    return(q);
};

var make_descartes = function(ie){
    var k = [];
    var zk = [];
    for(var i=0; i<3; i++){
        k[i] = 1.0/r[ie][i];
        var node = [x[e[ie][i]], y[e[ie][i]]];
        zk[i] = smul(k[i],node);
    }
    var kk = k[0] + k[1] + k[2] + 2*sqrt(k[0]*k[1] + k[1]*k[2] + k[2]*k[0]);

    var s = csqrt(cadd(cmul(zk[1],zk[0]), cadd(cmul(zk[2], zk[1]), cmul(zk[0], zk[2]))));
    var rr = 1.0/kk;
    var zz = smul(rr, cadd(zk[0], cadd(zk[1], cadd(zk[2], smul(2.0,s)))));
    x.push(zz[0]);
    y.push(zz[1]);
    n += 1;
};

var make_radius = function(ie){  // ielement
    var ee = e[ie];
    for(var iee=0; iee<3; iee++){
        var jee = (iee+1)%3;
        var kee = (jee+1)%3;
        r[ie][iee] = 0.5*(dist(x[ee[kee]],y[ee[kee]],  x[ee[iee]],y[ee[iee]]) + dist(x[ee[iee]],y[ee[iee]],  x[ee[jee]],y[ee[jee]]) - dist(x[ee[jee]],y[ee[jee]],  x[ee[kee]],y[ee[kee]]));
    }
};

mouseClicked = function() {
    for(var i=0; i<n; i++){
        if(dist(x[i], y[i], mouseX, mouseY) < 3*rad){
            rd.push(i);
            if(rd.length === 3){ // make element
                var newe = rd.slice(0); // deep copy
                e.push(newe);
                ne = e.length;
                r.push([0.0,0.0,0.0]);
                make_radius(ne-1);
                make_descartes(ne-1);
                rd = [];
            }
            return;
        }
    }
    x.push(mouseX);
    y.push(mouseY);
    n += 1;
};

draw = function() {
    background(200, 200, 200);
    fill(150, 120, 173);
    noStroke();
    for(var i=0; i<n; i++){
        ellipse(x[i], y[i], rad,rad);
    }

    fill(250, 5, 5); // red
    for(var ird=0; ird<rd.length; ird++){
        ellipse(x[rd[ird]], y[rd[ird]], rad,rad);
    }

    noFill();   
    stroke(0,0,0);
    for(var ie=0; ie<ne; ie++){
        var ee = e[ie];
        for(var iee=0; iee<3; iee++){
            var i = ee[iee];
            ellipse(x[i],y[i], 2*r[ie][iee], 2*r[ie][iee]);
        }
    }

//    for(var ie=0; ie<ne; ie++){
//        var ee = e[ie];
//        line(x[ee[0]],y[ee[0]], x[ee[1]],y[ee[1]]);
//        line(x[ee[1]],y[ee[1]], x[ee[2]],y[ee[2]]);
//        line(x[ee[2]],y[ee[2]], x[ee[0]],y[ee[0]]);
//    }
};
