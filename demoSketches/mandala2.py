"""
Animated Mandalas:

Drag with left button to add a rotating mandala.
Middle button removes last mandala.
Right button clears screen.

"""
from processing import *
from math import *
from random import randint

n = 12
colors = []
c1 = 255,200,50 # first color
c2 = 20,100,255 # second color
alpha = 180 # Transparency

drawing = []

def setup():
    size(600,600)
    colorMode(HSB)
    noStroke()

def mousePressed():
    if mouse.button == RIGHT: 
        drawing[:] = []
        colors[:] = []
    elif mouse.button == CENTER:
        if drawing != []:
            drawing.pop()
            colors.pop()
    else:
        colors.append (color(randint(0,255),255,255,alpha))
        drawing.append([[mouse.x,mouse.y]])
    
def mouseDragged():
    if mouse.button == LEFT:
        if dist(mouse.px,mouse.py,mouse.x,mouse.y)>3:
            drawing[-1].append([mouse.x,mouse.y])

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
    background(0)
    startAngle = radians(environment.frameCount)
    for i,l in enumerate(drawing):
        a = rotatedAround(l[:],300,300,startAngle)
        startAngle = -startAngle
        ang = radians(360)/n/2
        fill(colors[i])
        for i in range (n):
            b = rotatedAround(a,300,300,ang)
            drawList(a+b[::-1])
            a = rotatedAround(b,300,300,ang)
  
run()


