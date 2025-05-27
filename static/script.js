



//// When displaying it 
const items = document.getElementById("text3");

const searchf = document.getElementById("datalistbox");

////Shows the bird image
const divc = document.querySelector("div.n");

const imgll = document.getElementById("imgll");
const imgllmap = document.getElementById("imglmap");

const imglltext  = document.getElementById("imglltext");
const imgllroad = document.getElementById("imgllroad");

const imgright = document.getElementById("imgright");

///////Not found? Add it
const addtxtb = document.getElementById("addtxtb");


const inftext = document.getElementById("inftext");

////////////////////




//// When adding the city: input and datalist

const textt2 = document.getElementById("textf2");
const listbox2 = document.getElementById("datalistbox2");

/// the image that will be displayed
const imgdl = document.getElementById("imgl");

const imgg = document.getElementById("imgsel");
////////////////////




////Uploads the image
const inpf = document.getElementById("filef");
const textt = document.getElementById("textf");

const formm = document.getElementById("texts");
const cityf = document.getElementById("cityf");

const divv = document.getElementById("divv");
////////////////////


//// The preview view of map and to send them
const ff = document.getElementById("f");
const imgmap = document.getElementById("imgmap");

////////////////////



const textcityf = document.getElementById("textcityf");


const divposs = document.getElementById("divposs");




const imgmapbuttonset = document.getElementById("imgmapbuttonset"); 

let list = [];
let listb = ["Eagle", "Hawk", "Hi"];

let ifcityselflag;

let newsrcc="";
//cityf -> textt2.addEvent(input) -> textt2 change


window.onload = function(){
    refrimg(delmain=true);
    divv.style.display = "none";
    textcityf.style.display = "block";
    inftext.style.display = "block";
    
};

    
const delfunct = function(event, item){ 
    event.preventDefault();

};



items.addEventListener("input", function(event){

    const theobj = event.target;

    const itemtext = items.value.toLowerCase().trim();

    searchf.innerHTML = "";

    const filtrd = listb.filter(item => item.toLowerCase().startsWith(itemtext));

    filtrd.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        searchf.appendChild(opt);
    });

});

    const delitem = function(n){

        fetch(`/db/${n}`, {
        method: "DELETE",
    })
        .then(response => {
            if(!response.ok){
                return response.json().then(data => {
                    throw new Error("fcydgg");
                })
            }

            return response.json();
        })
        .then(data => {
            if(data.status === "True"){

                const deltxt = document.createElement("a");
                deltxt.href = "#";
                deltxt.textContent = `Deleted: ${n}`;
                document.body.appendChild(deltxt);

                setTimeout(() => {
                    deltxt.remove();
                    window.location.reload();

                }, 4000);

                return;

            }
        }) 
        .catch(error => {
            //alert("Error message: " + error.message);

        });
    return;}

    const dltitem = document.getElementById("dltitem");

formm.addEventListener("submit", function(event){


    event.preventDefault();

    let n = items.value;

    
    dltitem.addEventListener("click", function(){delitem(n);});

    divv.style.display = "none";


    fetch(`/db/${n}`, {
        method: "POST",
    })
        .then(response => {
            if(!response.ok){
                return response.json().then(data => {
                    const error = new Error("fcydgg");
                    error.data = data;
                    throw error;
                })
            }

            return response.json();
        })
        .then(data => {
            if(data.Status === "True"){

                divv.style.display = "block";

                imgll.src = data.bird;
                imglltext.textContent = data.name;
                imgllmap.src = data.map;
                imgllroad.textContent = data.roadway;

                addtxtb.style.display = "none";

                ////////
            }
        }) 
        .catch(error => {
            //alert("Error message: " + error.message);
            addtxtb.innerText = `Not found? Add it: ${n}`;
            addtxtb.style.display = "block";
            document.body.appendChild(addtxtb);
            //alert(error.data.intstat);


            addtxtb.onclick = function(){
                //for some reason it didnt work with the variable error as a function parameter but also there are some issues when i try to assign the error to another variable and pass it as a param to the function   


                if(error.data.intstat === false){

                    textcityf.style.display = "none";
                    inftext.style.display = "none";
                }
                else{
                    textcityf.style.display = "block";
                    inftext.style.display = "block";
                }

                addtxtb.style.display = "none";

                document.body.removeChild(addtxtb);

                formm.style.display = "none";
                cityf.style.display = "block";

            };
        });




}); 


//this function is charged of changing colour of the cities depending on the input (n7.jpg)

async function itemt(textt, listbox) {
    let text = textt.value.toLowerCase().trim();

    
    if (text.includes(",")) {
        const textParts = text.split(",");
        text = textParts[textParts.length - 1].trim();
    }

    listbox.innerHTML = ""; 

    const flist = list.filter(item => item.toLowerCase().startsWith(text));

   
    if (flist.length !== 1) {
        alert("82929291991");
        
        if (newsrcc && !(newsrcc.endsWith("n8.jpg"))) {
            try {
                const response = await fetch("/img", { method: "HEAD" });
                if (!response.ok) {
                    //it already covers 400-500 as well but without throwing an error if you dont add these lines
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                    
                }

                newsrcc = "static/images/n8.jpg";
                imgdl.innerHTML = "";
                imgdl.src="";
                imgdl.src = newsrcc;
                alert("not equal" + newsrcc.toString());
                                
            } catch (error) {
                //alert("Image does not exist:" +  error.message);
                
            }
            

        }

        ifcityselflag = ""; //The match is done but if its matched with the same city again 

    }
    
    else if (flist.length === 1) {
        const n = flist[0];
        if (n !== ifcityselflag) {
            
            fetch(`/img?q=${n}&timestamp=${Date.now()}`)
                .then(response => response.json())
                .then(data => {
                    let newSrc = data.data + "?timestamp=" + Date.now();
                    //newSrc = static/images/n7.jpg;
                    imgdl.innerHTML = "";
                    imgdl.src = newSrc; 
                    alert("equal 1" + newSrc.toString());
                });
            ifcityselflag = n;  //no need to send the same fetch img request again

        }
    }

    
    flist.forEach(fitem => {
        const opt = document.createElement("option");
        opt.value = fitem;
        listbox.appendChild(opt);
    });
}


textt2.addEventListener("input", function() {
    itemt(textt2, listbox2);
});


let rstext;

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("textf2");
    const imgdl = document.getElementById("imgl");

//this function is charged of creating lines between the cities depending on the input (n8.jpg)
    input.addEventListener("change", async function (event) {
    const textt2v = event.target.value;

        //alert(event.target.value);
        const lstx = textt2v.includes(",") && textt2v.split(",").length > 1 ? textt2v.split(", ") : null;

        if (lstx.length > 1) {
            const rs = [];
            for (let i = 0; i < lstx.length - 1; i++) {
                rs.push([lstx[i], lstx[i + 1]]);
            }

            rstext = JSON.stringify({ urtext: rs });

            try {

                const response = await fetch("/img", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: rstext
                });

                const data = await response.json();
                if (data.data) {
                    //alert(data.data);
                    newsrcc = data.data;
                    //n8.jpg

                    imgdl.src = "";
                    imgdl.innerHTML = "";
                    imgdl.src = data.data + "?timestamp=" + Date.now();
                }

            } catch (error) {
                alert("An error occurred: " + (error.message || "Unknown error"));
            }
        } else {
            alert("Error");
        }
    });
});


let ffflag = false;

ff.addEventListener("submit", async function(event) {
    event.preventDefault();

    
    
    const frm = new FormData(event.target);

    imgdl.src = "";
    imgdl.innerHTML = "";


    //const texttv = frm.get("textt"); 
    frm.append("textt", items.value);


    //alert("Cookues: " + document.cookie);


    const succstxt = document.createElement("a");
    succstxt.href = "#";
    succstxt.textContent = "It is not being downloaded";

    n = document.createElement("a");
    n.href = "#";
    n.innerText = "Waiting....";
        
    document.body.appendChild(n);



    //alert(document.cookie.split("; ").length);
    //alert(document.cookie.split("; "));




    if(rstext || document.cookie.split("; ").length){

        try{
            const response = await fetch(event.target.action, {
                method: "POST",
                body: frm
            });

            const data = await response.json();

            n.remove();

            if(data.Status !== "S"){
                alert("829292992929");
                return;
            }   
            else{
                alert("Successfull");
                listb.push(textt)
            }

            succstxt.textContent = "Successfull";
        }

        catch(error){
            alert("Error: " + (error.message || "Unknown error"));
        }

    }
        
        document.body.appendChild(succstxt);

        setTimeout(() => {
            succstxt.remove();
            window.location.reload();

        }, 4000);


});


////////////////////////////////////////////////////////////

let optidval;


const rareaselmnt = document.getElementById("selectf").options;
//let rareas = Array.from(rareaselmnt).slice(1).map((value) => value.value );
let rareas = ["Europe", "Asia"];

//const areas = document.querySelectorAll("div[button='a'] > select > option");


let areas = ["Southwestern", "Northeastern"];
//It includes all the options that are listed in the regions below
//
//rareas.forEach(v => alert(v));

    


let indx = -1;
//It is just here to create a file name


function areasel(optid){

    const ediv = document.getElementById("Europe");
    const adiv = document.getElementById("Asia");
    const edivs = ediv.style.display === "none";
    const adivs = ediv.style.display === "none"; 

    
    const n = document.querySelectorAll("[button='a']");

    const isitopen = Array.from(n).some((d, index) => { 
        if(d.style.display === "block"){
            indx = index;
            return true;
        }
        return false;
    });


    if(isitopen){
        if(optid && areas.includes(optid)){
            optidval = optid; 

        }
        
        else{
            Array.from(n).forEach(n => {
                if(n.style.display == "block"){
                    n.style.display = "none";
                }});

            if(rareas.includes(optid)){

                document.getElementById(optid).style.display = "block";
                optidval = areas[0];
                indx = rareas.indexOf(optid);

            }
            else{
                optidval = "";
                indx = 0;

                textcityf.style.display = "block";
                inftext.style.display = "block";
            }
        }
    }

    else if(!isitopen){
        if(optid && rareas.includes(optid)){
            document.getElementById(optid).style.display = "block";

            textcityf.style.display = "none";
            inftext.style.display = "none";


            optidval = areas[0];
            indx = rareas.indexOf(optid);
        }
    }

}
    
//////Place to select or type the area

cityf.addEventListener("submit", function(event){
    event.preventDefault();

    //const textbox = document.getElementById("textcityf").value.toLowerCase();
    const textbox = document.getElementById("textcityf").value;

    const textboxvld = textbox && textbox.includes(", ") && 6 >= textbox.split(", ").length ? true : false;

    indxnmbr = indx+areas.indexOf(optidval); 
    //a distinct number to put it in the beginning of the file name 

    const txtsn = optidval && typeof(indx) !== "undefined" && typeof(areas.indexOf(optidval)) !== "undefined" ? [rareas[indx], optidval, indxnmbr] : textboxvld ? textbox : null;

    //alert(indxnmbr);


    if(!txtsn){
        alert("Enter a valid text");
        return;
    }

    alert(txtsn);
    



    fetch("/", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"citylist": txtsn})
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(data => {
                throw new Error("An error occured");
            })
        }
        return response.json();
    })
    .then(data => {
        imgdl.innerHTML = "";
        imgdl.src = "";

        imgdl.src = data.filepath[0];
        //alert(imgdl.src);
        newsrcc = data.filepath[0];

        ff.style.display = "block";
        imgmap.style.display = "block";

        
        cityf.style.display = "none";
        list = txtsn instanceof String ? textbox.split(", ") : data.filepath[1]; 

        optidval = "";

        


    })
    .catch(error => alert("Invalid input " + (error.message || "An error occured")));
        
        



});
    


let url;

const imgupl = document.getElementById("imgprv");

//this is for displaying the bird image you upload 
inpf.addEventListener("change", function(event){
    const file = event.target.files[0];

    if(url){
        URL.revokeObjectURL(url);
    }



    url = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = url; 
    img.width = 40;

    brc = document.createElement("br");

    ff.insertBefore(img, imgprv.previousSibling);
    ff.insertBefore(brc, img.nextElementSibling);

    
    setTimeout(() => {img.remove(); brc.remove();}, 4000);
});




let pos = 999999;
const cookieclnr = async function(){
        pos = 0;
        //alert("now the pos is: " + pos.toString());

        let docl = document.cookie ? document.cookie.split(";") : [];

        
    

        if (docl.length > 1) {
            for (let i = 0; i < docl.length; i++) {
                document.cookie = docl[i].split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            }
            docl = await cookiedel(docl);
        }

        

        imgg.style.display = "block";
        if(imgg.nextElementSibling.tagName === "BR"){
        imgmapbuttonset.removeChild(imgg.nextElementSibling);
        }
        //
        //no need to use spans for informing
            
        const brs = document.querySelectorAll("div#divposs");
        //const brs = document.querySelectorAll("div#divposs > span");
        brs.forEach(el => el.remove());
        return;
};


async function cookiedel(old){
        return new Promise(resolve => {
            setTimeout(() => {
                let updatedDocl = document.cookie ? document.cookie.split("; ") : [];
                //alert("Updated cookie length: " + updatedDocl.length);
                //old = updatedDocl; 
                resolve(updatedDocl);

            }, 1000)});
}



let isitsel = false;

async function moveit(dirct){


    if(pos===999999){
        cookieclnr();
    }
    
    
    //////////////nextprev  algporithme ovVR

    if (dirct && dirct==="left"){
        pos = pos===0 ? list.length-1 : pos-1;
    }
    else if (dirct && dirct==="right"){
        pos = pos===list.length-1 ? 0 : pos+1;
    }

    //alert(list);
    //alert(pos);

    let text = list[pos];

    fetch(`/img?q=${text}&isitsel=${isitsel}&timestamp=${Date.now()}`)
    .then(response => response.json())
    .then(data => {
        let newSrc = data.data + "?timestamp=" + Date.now();
        imgdl.innerHTML = "";
        imgdl.src = "";
        imgdl.src = newSrc;

    });// data => data.json doesnt work
    //alert(isitsel);
}



let selcity = async function(img) {


    isitsel = false;
        
    let u = [];
    let docl = document.cookie ? document.cookie.split("; ") : [];

    if (pos === 999999) {
        return;
    }

    if (docl.length === 0) {
        u = ["pos1", "first"];
        isitsel = true;

    } else if (docl.length === 1) {
        u = ["pos2", "second"];

        const brc = document.createElement("br");
        imgg.style.display = "none";
        
        imgmapbuttonset.insertBefore(brc, imgg.nextElementSibling);

    }

    let newcookie = u[0] + "=" + list[pos] + "; path=/;";
    document.cookie = newcookie; // Now actually setting the cookie

    //alert("the new cookie: " + newcookie);


    //const possp = document.createElement("span");
    const br = document.createElement("br");
    //possp.innerText = `The ${u[1]} is selected as: ${list[pos]}`;

    //divposs.appendChild(possp);
    divposs.appendChild(br);

    //pos = -1;
    //
    
    if(u[0] === "pos1"){
        try{
            const response = await fetch(`/img?q=${list[pos]}&isitsel=${isitsel}&timestamp=${Date.now()}`)
            const data = await response.json();

            if(!response.ok){
                throw new Error("wtf? " + data.message);
            }
            
            let newSrc = data.data + "?timestamp=" + Date.now();
            imgdl.innerHTML = "";
            imgdl.src = "";
            imgdl.src = newSrc;



        }
        catch(error){
                alert(error.message || "Unknown error");
            }
    }

                

    if(u[0] !== "pos1"){
        
        try{  
            const response = await fetch(`/img?isitsel=${isitsel}`, {
                credentials: "same-origin" //for cookies
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message);
            }
            //alert("Data: " + data.data);

            let newSrc = data.data + "?timestamp=" + Date.now();
            imgdl.innerHTML = "";
            imgdl.src = "";
            imgdl.src = newSrc;



        }
        catch(error){
            alert(error.message || "Unknown error");
        }

        pos = 999999;
    }
                

};




let refrimg = function(delmain=""){
    const cs = document.cookie.split("; ");
4

    fetch(`/img?delmain=${delmain}`, {method: "DELETE",})
        .then(response => response.json())
        .then(data => {
        imgdl.innerHTML = "";
        imgdl.src = "";

            imgdl.src= data.mainfile;
            newsr = undefined;

            for(let i=0;i<cs.length;i++){
                document.cookie = cs[i].split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            }});
        
    cookieclnr();
    pos = 999999;
};



let imgsetchange = function(){
    const imgbuttonstyle = imgmapbuttonset.style.display === "block";

    imgmapbuttonset.style.display = imgbuttonstyle ? "none" : "block";
    textt2.style.display = imgbuttonstyle ? "block" : "none";
    listbox2.style.display = imgbuttonstyle ? "block" : "none";

    refrimg();
};

//cityf imgupl imgmap divposs

const qlist = document.querySelectorAll("form#cityf, [button='b']");
let indxls = 2;
 
    
let nextprev = function(name){

    qlist[indxls].style.display = "none";
    indxls = (indxls + (name === "next" ? 2: -2) + qlist.length) % qlist.length;
    qlist[indxls].style.display = "block";

    if(indxls === 1){
        imgg.style.display = "block";
        
        document.cookie = "stat=y; path=/;";
        pos = 999999;

        return;

    }
    else{
        document.cookie =  "stat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }


};


