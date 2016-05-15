from processing import *
from math import *

l = []
n = 12
c1 = 199,20,50 # first color
c2 = 20,100,150 # second color
alpha = 122

def setup():
    size(600,600)
    noStroke()

def mousePressed():
    l[:] = [[mouse.x,mouse.y]]
    
def mouseDragged():
    if dist(mouse.px,mouse.py,mouse.x,mouse.y)>3:
        l.append([mouse.x,mouse.y])

def rotatedAround (l,cx,cy,ang):
    res = []
    for x,y in l:
        dx,dy = x-cx,y-cy
        r = sqrt(dx*dx+dy*dy)
        a = atan2(dy,dx)+ang
        res.append([cx+r*cos(a),cy+r*sin(a)])
    return res

def drawList(l):
    beginShape()
    for x,y in l:
        vertex(x,y)
    endShape()
    
def draw():
    background(250)
    a = l[:]
    ang = radians(360)/n/2
    for i in range (n):
        if i%2==0: fill(color(*c1),alpha)
        else: fill(color(*c2),alpha)
        b = rotatedAround(a,300,300,ang)
        drawList(a+b[::-1])
        a = rotatedAround(b,300,300,ang)
  
run()


