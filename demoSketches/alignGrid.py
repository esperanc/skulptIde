#
# Based on program P.2.1.2 of "Generative Design" by
# H. Bohnacker, B. Gross, J. Laub, C. Lazzeroni
#

from processing import *
from random import random,seed

randomSeed = 1000
tileCount = 10

def setup():
    size(600,600)
    global colorLeft, colorRight
    colorLeft = color(197, 0, 123)
    colorRight = color(87, 35, 129)

def mousePressed():
    global randomSeed
    seed()
    randomSeed = random()*100000
    
def keyPressed():
    if keyboard.key.upper()=="R": strokeCap(ROUND)
    if keyboard.key.upper()=="S": strokeCap(SQUARE)
    if keyboard.key.upper()=="P": strokeCap(PROJECT)
        
    
def draw():
    background(255)
    seed(randomSeed)
    dy = environment.height / tileCount
    dx = environment.width / tileCount
    wx = mouse.x * 1.0 / environment.width * 100
    wy = mouse.y * 1.0 / environment.height * 100
    for gridY in range(tileCount):
        posY = dy * gridY
        for gridX in range(tileCount):
            posX = dx * gridX
            if random()>=0.5:
                strokeWeight(wx)
                stroke(colorLeft,100)
                line(posX,posY+dy,posX+dx,posY)
            else:
                strokeWeight(wy)
                stroke(colorRight,100)
                line(posX,posY,posX+dx,posY+dy)

run()
