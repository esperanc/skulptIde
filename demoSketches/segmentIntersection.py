from processing import *
from math import *

p = [100,100]
q = [300,300]

a = [100,300]
b = [300,100]

sel = None

def implicit(p,q):
    "Retorna forma implicita reta que passa por p e q"
    x0,y0 = p
    x1,y1 = q
    dx = x1-x0
    dy = y1-y0
    if dx==0: return None 
    a = 1.0*dy/dx
    b = y1-a*x1
    return [a,b]

def intersectionImplicit(l,s):
    "Retorna a intersecao de duas retas em forma implicita"
    a0,b0=l
    a1,b1=s
    f = 1.0*a0-a1
    if f==0: return None
    x = (b1-b0)/(a0-a1)
    y = a1*x+b1
    return [x,y]

def dot(u,v):
    "Retorna produto escalar entre vetores u e v"
    x0,y0 = u
    x1,y1 = v
    return x0*x1+y0*y1

def mousePressed():
    "Seleciona algum dos vertices"
    global sel
    sel = None
    for P in [p,q,a,b]:
        x,y = P
        if dist(x,y,mouse.x,mouse.y)<5: sel = P
            
def mouseDragged():
    "Arrasta o vertice selecionado"
    global sel
    if sel!=None:
        x,y = sel
        sel[:] = [x+(mouse.x-mouse.px),y+(mouse.y-mouse.py)]

def orient(p,q,r):
    "Retorna o sentido de orientacao entre os pontos p,q,r"
    x0,y0 = p
    x1,y1 = q
    x2,y2 = r
    det = x1*y2 + x0*y1 + y0*x2 -\
          y0*x1 - y1*x2 - x0*y2
    if det>0: return 1
    if det<0: return -1
    return 0

def intersection (a,b,c,d):
    "Retorna o ponto de intersecao entre a reta ab e a reta cd"
    l = implicit (a,b)
    s = implicit (p,q)
    if l == None: 
        if s == None: return None
        return [a[0],s[0]*a[0]+s[1]]
    if s == None:
        return [c[0],l[0]*c[0]+l[1]]
    return intersectionImplicit(l,s)
    
def intersects(a,b,c,d):
    "Retorna True sse segmento de reta a,b intersecta segmento c,d"
    o = [orient(a,b,c),orient(a,b,d), orient(c,d,a), orient(c,d,b)]
    return abs(o[0]-o[1])==2 and abs(o[2]-o[3])==2
    
def desenhaLinha(a,b):
    (x0,y0),(x1,y1)=a,b
    line(x0,y0,x1,y1)
    for x,y in a,b: ellipse(x,y,5,5)
        
def setup():
    size (400,400)

def draw():
    background(200)
    desenhaLinha(a,b)
    desenhaLinha(p,q)
    if intersects(a,b,p,q):
        x,y = intersection(a,b,p,q)
        fill(255,0,0)
        ellipse(x,y,10,10)
        fill(255)
        
run()

