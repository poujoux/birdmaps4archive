import requests
import os, sys
import json, uuid
import networkx as nx

from flask import Flask, jsonify, request, render_template, abort, session
from math import *
from shutil import rmtree
from PIL import Image, ImageDraw

sys.path.append(os.path.join(os.path.dirname(__file__), "static", "modules"))

import mapcrt
import dbset, bucketset


app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = os.urandom(32)


def get_i(city):

    url = "https://nominatim.openstreetmap.org/search"

    headers = {
        'User-Agent': 'YourAppName/1.0 (your@email.com)'
        }

    params = {
            "q": city,
            "format": "json"
            }

    link  = requests.get(url, params=params, headers=headers, timeout=30)

    if link.status_code == 200:
        try:
            print("\n\n")

            data = link.json()
            return data[0].get("lon"), data[0].get("lat")

        except requests.exceptions.JSONDecodeError as e:
            print(f"An error occured: {e}")
    else:
        print(f"Request failed {link.status_code}")


gr=None
rgr=None
dbpaths=None

buckt=None

intstat=False




@app.route("/", methods=["POST", "GET"])
def a():
    print(24*"-", "ENTERING TO THE MAIN", 24*"-", end="\n")

    cityljson = request.get_json(silent=True)

    print("cityljson: ", cityljson)

    global dbpaths
    global buckt
    global rgr
    global intstat



    databname, tablename = "mdbb.db", "mytable"

    #intstat=True
        
    if not dbpaths:
        dbpaths = dbset.DbSet(databname, tablename)

    if not rgr:
        rgr = nx.DiGraph()

    if not request.headers.get("Referer") and not intstat:
        try:
            print(9*"Some bucket stuff")
            buckt = bucketset.bucketsearch()
            intstat = True 
        except Exception as e:
            print(f"{e}")
            print(99*"-")

    
        print(9*str(intstat))


    if request.method == "POST" and cityljson and cityljson.get("citylist"):

        citylist = request.get_json().get("citylist")

        if isinstance(citylist, str) and citylist.find(", ") > 0:
            citylistloc = {i: get_i(i) for i in citylist.split(", ")}
            print(citylistloc)

            xycitylistloc = mapcrt.lockey(citylistloc.values())
            xylistloc = dict(zip(citylistloc.keys(), xycitylistloc))
            xycitylistloczip = dict(sorted(xylistloc.items(), key=lambda x: x[1], ))

            print('xycitylistloczip: ', xycitylistloczip)

        else:

            with open("config.json", "r") as file:

                citylf = file.read()

                print(citylf)

                print("It has been red")
                cityljson = json.loads(citylf)
                print(cityljson)
                # 0: Continent 1: Area

                xycitylistloc = cityljson["Region"][citylist[0]][citylist[1]]
                xycitylistloczip = dict(zip(xycitylistloc["Cities"], xycitylistloc["Locations"]))


        session["xycity_cach"] = xycitylistloczip

        mname = f"{citylist[2] if isinstance(citylist, list) else ''}n.jpg"

        print(mname)



        itempath = os.path.join("static", "images", mname)

        session["itempath"] = itempath

        print(itempath)

        imgpath = os.path.join("static", "images")
        npath = os.path.join(imgpath, "n.jpg")

        if os.path.exists(npath):
            os.remove(npath)


        if mname == "n.jpg" or not os.path.exists(itempath):
            print("The image is being created")
            xycity = session["xycity_cach"]

            simg = mapcrt.imgc(xycity,itempath)
            print(simg.shown)   

                
        print(24*"-", "EXITTING FROM THE MAIN", 24*"-", end="\n")


        return jsonify({"filepath": [itempath] if itempath=="n.jpg" else [itempath,list(xycitylistloczip.keys())]})

    return render_template("index.html")

painted = False

@app.route("/img", methods=["POST", "GET", "DELETE", "HEAD"])

def img():
    args = request.args
    ckies = request.cookies
    #h  = request.headers
    fls = request.files
    rjson = request.get_json(silent=True)
    rjsont = None if not rjson else rjson.get("urtext")


    print(24*"-", "ENTERING TO THE MAIN", 24*"-", end="\n")
    print("session", session)

    print("rjsont: ", rjsont)


    imgpath = os.path.join("static", "images")

    if request.method=="DELETE":

        if args.get("delmain"):
            if os.path.exists(os.path.join(imgpath, "n.jpg")):
                os.remove(os.path.join(imgpath, "n.jpg"))
                print("It has been deleted")

        if os.path.exists(os.path.join(imgpath, "n8.jpg")):
            os.remove(os.path.join(imgpath, "n8.jpg"))
            print("It has been deleted")

        if os.path.exists(os.path.join(imgpath, "n7.jpg")):
            os.remove(os.path.join(imgpath, "n7.jpg"))
            print("It has been deleted")

        if os.path.exists(os.path.join(imgpath, "n9.jpg")):
            os.remove(os.path.join(imgpath, "n9.jpg"))
            print("It has been deleted")
         

        if list(rgr.edges):
            rgr.remove_edges_from(list(rgr.edges))
            print("The edge has been deleted")


        return jsonify({"Status": "True", "mainfile": session["itempath"]})    


    if request.method == "HEAD":
        if os.path.exists(os.path.join(imgpath, "n8.jpg")):
            return jsonify({"Status": "True"}),200
        
        return jsonify({"Status": "False"}),404
    

    if args.get("q") or ckies.get("pos2", None) or rjsont:

        argcityshow = args.get("q")
        print("args: ", args)

        

    
        n9jpg = os.path.join(imgpath, "n9.jpg")
        n8jpg = os.path.join(imgpath, "n8.jpg")
        n7jpg = os.path.join(imgpath, "n7.jpg")
        n1jpg = os.path.join(imgpath, "n1.jpg")
        isitsel = args.get("isitsel")
        print(args)

        imgpathm = n8jpg if os.path.exists(n8jpg) and isitsel == "false" else n9jpg if os.path.exists(n9jpg) and isitsel == "true" else session.get("itempath")

        #need to save n9 over n8

        print("isitsel: ", isitsel)
    
        imgg = Image.open(imgpathm)
        img = ImageDraw.Draw(imgg) 

        if session.get("xycity_cach"):
            print("Based on: ", imgpathm)
            prc = 0.05

            z = 0.3 if ckies.get("pos2", None) or rjsont else 1
            print("cookies: ", ckies, end="\n")


            if ckies.get("pos2", None) or rjsont:
                print("\n", 13*"-", "\nA LINE IS SELECTED: ") 

                if ckies.get("pos2", None):

                    print("cookies: ", ckies)
                    node0 = ckies.get("pos1")
                    node1 = ckies.get("pos2")


                    nn = [(node0, node1)]

                    print("nn: ", nn)

                    imgpath1 = n8jpg


                elif rjsont:
                    nn = rjsont
                    print(nn)

                    imgpath1 = n8jpg

                for i in range(len(nn) if len(nn)>1 else 1):

                    print(i)

                    nn0 = nn[i][0] 
                    nn1 = nn[i][1]

                    v00 = tuple(session["xycity_cach"].get(nn0))
                    v10 = tuple(session["xycity_cach"].get(nn1))

                    v01 = v00[0]+((imgg.width*prc)*pow(2*z,0.5)),v00[1]+((imgg.height*prc)*pow(2*z,0.5))
                    v11 = v10[0]+((imgg.width*prc)*pow(2*z,0.5)),v10[1]+((imgg.height*prc)*pow(2*z,0.5))
                    print(v00, v10, v01, v11, sep="\n")

                    img.line([v01,v11], fill="green")

                    rgr.add_edge(nn0, nn1)
                    print("edges ", rgr.edges)
                    print(nn0, "---->", nn1)

            

            elif args.get("q"):
                
                print("\n", 13*"-", "\nANOTHER CITY IS SELECTED: ", argcityshow)                  



                v0 = tuple(session["xycity_cach"].get(argcityshow))
                #it works when you clicked on the arrow buttons but isitsel is related with the selection button so it selects the actual city but paints the next/previous city
                 
                print(v0)
                v1 = v0[0]+((imgg.width*prc)*pow(2*z,0.5)),v0[1]+((imgg.height*prc)*pow(2*z,0.5))

                print(v0,v1)

                img.ellipse((v0,v1), fill="purple")

                isitsel = args.get("isitsel")
                
                print("isitsel; ", isitsel)

                global painted

                if isitsel == "true" and not painted:
                    print(22*"$$$")
                    imgpath0 = os.path.join(imgpath, "n9.jpg")
                    painted = True
                
                elif isitsel == "true" and painted:
                    print(22*"&&&")
                    imgpath0 = os.path.join(imgpath, "n7.jpg")
                    print(24*"-", "MAIN", 24*"-", end="\n")
                    
                else: 
                    print(22*"%%%")
                    imgpath0 = os.path.join(imgpath, "n7.jpg")
                    painted = False


                imgpath1 = imgpath0


            #n7 refers to cityshow
            #n8 refers to imgfromthetextbo
            #n1 refers to imgfromthebuttons

        imgg.save(imgpath1)
        os.chmod(imgpath1, 0o777)


        if (ckies.get("pos2", None) or rjsont) and os.path.exists(n9jpg):
            print("Saving over it")
            imgg.save(n9jpg)
            os.chmod(n9jpg, 0o777)



        print(24*"-", "EXITTING FROM THE MAIN", 24*"-", end="\n")

        return jsonify({"data": imgpath1}), 200

    else:
        return jsonify({"error": "An error occured"}), 400

        

@app.route("/files", methods=["POST", "GET", "DELETE", "HEAD"])

def filess():
    print(24*"-", "ENTER THE FILES", 24*"-", end="\n")
    print("Form :", request.form)
    print("Files: ", request.files)
        
    name = request.form.get("textt")

    img = request.files.get("fileff")
    print("Name of the file :", img.filename)

    img.filename = f"{name}.jpg"

    
    path0 = os.path.join("static", "images")
    pathname = os.path.join(path0, name)
    pathn8 = os.path.join(path0, "n8.jpg")

    pathnameimg = os.path.join(pathname, img.filename)
    pathnamen8 = os.path.join(pathname, "n8.jpg")
    
    if not os.path.exists(pathname):
        os.makedirs(pathname)


    edgelines = "-".join(sum(list(rgr.edges), ()))
    
####

    #imgpath = os.path.join(path0, img.filename)
    img.save(pathnameimg)
    os.rename(pathn8, pathnamen8)

    os.chmod(pathname, 0o755)

    if intstat and buckt:
        print(9*"Trying to bucket it...")
        try:
            print(buckt.getlist())
            print(buckt.bucketn)
            pathnameimg, pathnamen8 = bucketset.addandlink(buckt, name)
            print("Trying to bucket it...")
            rmtree(pathname)

        except Exception as e:
            print(f"An error occured: {e}")
            print("Trying to obtain it...")

            if os.path.exists(pathname):
                print("They are obtained")

            else:
                return jsonify({"Status": "F"}), 404

            print(name,pathnameimg,pathnamen8,edgelines)

    
    dbpaths.addf(name, pathnameimg, pathnamen8, edgelines)


    return jsonify({"Status": "S"}), 200


@app.route("/db/<itemname>", methods=["POST", "GET", "DELETE", "HEAD"])
def dbb(itemname): 
    global dbpaths

    if request.method == "POST":

        nvalue = dbpaths.searchf(itemname)
        print("nvalue: ", nvalue)

        if bool(nvalue): 
            return jsonify({"Status": "True", "name": nvalue[0], "map": nvalue[2], "bird": nvalue[1], "roadway": nvalue[-1], "intstat": intstat}), 200


        else:
            return jsonify({"Status": "False", "intstat": intstat}), 400


    if request.method == "DELETE":
        try:
            if dbpaths.searchf(itemname):

                print("itemname: ", itemname)

                dbpaths.delf(itemname)
                print("The table has been deleted.")
                    
                imgpath = os.path.join("static", "images")

                if os.path.exists(os.path.join(imgpath, itemname)):
                    rmtree(os.path.join(imgpath, itemname))
                    print("The folder has been deleted")


                if list(rgr.edges):
                    rgr.remove_edges_from([list(rgr.edges)[-1]])
                    print("The edge has been deleted")




                return jsonify({"Status": "True"}), 200

            print("9202920200202")

            return jsonify({"status": "error"}), 400

        except Exception as e:
            return jsonify({"status": "error"}), 400




if __name__ == "__main__":
    app.run(debug=True)
