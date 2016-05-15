#
# Inspired by the Pendulum Wave Toy
# https://www.youtube.com/watch?v=RrX2yTGJ6N0
#

from processing import *
from math import *

# Gravity
g = 10.0

class Pendulum(object):
    "A Pendulum"
    r = 10 # Radius
    t = 0 # elapsed time for this pendulum 
    
    def __init__(self, ax, ay, angmax, l = 100.0):
        "Constructor: anchor position, max angle and length of the rod"
        self.ax,self.ay = ax,ay
        self.angmax = self.ang = angmax
        self.l = l
        
    def move(self,dt):
        "Move the pendulum assuming dt time has passed"
        self.t = self.t + dt
        self.ang = self.angmax * sin(sqrt(g/self.l) * self.t)

    def pos(self):
        "Returns the position (x,y) of the pendulum"
        return (self.ax+sin(self.ang)*self.l, 
                self.ay+cos(self.ang)*self.l)
    
    def draw(self, drawRod = False):
        "Draws the pendulum"
        x,y = self.pos()
        if drawRod: 
            stroke (100)
            line (self.ax, self.ay, x, y) 
        d = self.r*2
        stroke(0)
        ellipse(x,y,d,d)

def initPendulum ():
    global pend
    pend = []
    height = environment.height
    for l in range(height/3, 2*height/3,5):
       pend.append(Pendulum(200, 10, radians(25), l))
    
def setup():
    size(400,400)
    initPendulum()

def draw():
    background(200)
    for p in pend:
        p.move(0.2)
        p.draw(not mouse.pressed)

run()