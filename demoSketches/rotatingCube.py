#
# Simple 3D example showing a rotating cube
#

from processing import *

ang = 0
def setup():
    size(300,300,OPENGL)
    
def draw():
    background(40)
    lights()
    global ang
    translate(environment.width/2, environment.height/2, 10)
    rotateY(ang)
    ang+=0.01
    box (100)

run()

