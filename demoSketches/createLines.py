#
#  Interactively draw line segments. Uses mouse click and drag
# 

from processing import *

l = []

def setup():
    size(300,300)
    
def mousePressed():
    l.append([mouse.x, mouse.y, mouse.x, mouse.y])

def mouseDragged():
    l[-1][2:] = [mouse.x, mouse.y]
    
def draw():
    background(200)
    for coord in l:
    	line(*coord)

run()

