import networkx as nx
import sys, os
import json
from PIL import Image, ImageDraw
#sys.path.append(".")

class MapSet:

    def __init__(self, xycity, itemname):
        self.itemname = itemname
        self.xycitydict = {}
        self.xycity = xycity 
        self.img = Image.new("RGB", (400, 400), "white")
        self.eimg = ImageDraw.Draw(self.img)


    @property
    def shown(self):
        return self.itemname

    def pointcrt(self, v0, prc, p="d"):

        z = 0.3 if p=="ctr" else 1 #ctr for texts and lines
        v1 = v0[0]+((self.img.width*prc)*pow(2*z,0.5)),v0[1]+((self.img.height*prc)*pow(2*z,0.5))

        print("v0: ", v0,"v1: ", v1,sep="\n")

        return v0,v1


    def img_c(self):

        for val, (x,y) in self.xycity.items():
            
            n = x, y


            print(f"for {val}: ", 7*"-")

            l = self.pointcrt(n,0.05)[0]
            self.eimg.text((l[0]+((self.img.width*0.05)*pow(2,0.5)*0.25),l[1]-(self.img.height*0.02)), str(val).title(), fill="black")

            self.eimg.ellipse(self.pointcrt(n,0.05), fill="green")


            self.xycitydict[val]=self.pointcrt(n, 0.05, "ctr")[1] #for lines

        self.img.save(self.shown)
        self.img.show()


def lockey(locations):

    print(37*"-", "LOCKEY", 37*"-")

    xk = [float(x) for x,y in locations]
    yk = [float(y) for x,y in locations]

    print("xk: ", xk)
    print("yk: ", yk)



    xmax = max(xk)+1
    xmin = min(xk)-1

    ymax = max(yk)+1
    ymin = min(yk)-1

    print(xmin, xmax, ymin, ymax)

    d = []


    print(7*"-")
    print(locations)

    for (x,y) in locations:
        xp = ((float(x) - xmin)/(xmax - xmin))*350
        yp = ((ymax - float(y))/(ymax - ymin))*350

        d.append((xp,yp))

    print(37*"-", "LOCKEY", 37*"-")

    return d


def imgc(xycity, name):
    imgs = MapSet(xycity, name)
    imgs.img_c()
    print(imgs.shown)
    return imgs

