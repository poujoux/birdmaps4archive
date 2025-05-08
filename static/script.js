



//// When displaying it 
const items = document.getElementById("text3");

const searchf = document.getElementById("datalistbox");

////Shows the bird image
const divc = document.querySelector("div.n");

const imgll = document.getElementById("imgll");
const imgllmap = document.getElementById("imglmap");

const imglltext  = document.getElementById("imglltext");
const imgllroad = document.getElementById("imgllroad");

///////Not found? Add it
const addtxtb = document.getElementById("addtxtb");


const inftext = document.getElementById("inftext");

////////////////////




//// When adding the city: input and datalist

const textt2 = document.getElementById("textf2");
const listbox2 = document.getElementById("datalistbox2");

/// the image that will be displayed
const imgl = document.getElementById("imgl");

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



const radiox = document.getElementById("radiox");



let list = [];
let listb = ["Eagle", "Hawk", "Hi"];

let ifcityselflag;
let newsr;

let newsrcc="";


window.onload = function(){
    refrimg();
    divv.style.display = "none";
    
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
formm.addEventListener("submit", function(event){
    event.preventDefault();
    
    let n = items.value;

    divv.style.display = "none";


    if(listb.includes(n)){

        ///////

        if(true===false){
            alert("22222");

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
                        
                        window.location.reload();
                        return;

                    }
                }) 
                .natch(error => {
                    //alert("Error message: " + error.message);
                    
                });
            return;
        }

        fetch(`/db/${n}`, {
            method: "POST",
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
                if(data.Status === "True"){
                    alert("829292902");
                    
                    divv.style.display = "block";

                    imgll.src = data.bird;
                    imglltext.innerText = data.name;
                    imgllmap.src = data.map;
                    imgllroad.innerText = data.roadway;

                }
            }) 
            .catch(error => {
                //alert("Error message: " + error.message);
                addtxtb.innerText = `Not found? Add it: ${n}`;
                addtxtb.style.display = "block";
                document.body.appendChild(addtxtb);

                addtxtb.onclick = function(){
                    addtxtb.style.display = "none";

                    document.body.removeChild(addtxtb);

                    formm.style.display = "none";
                    cityf.style.display = "block";
                };






            });



    }

}); 



        



async function itemt(textt, listbox) {
    let text = textt.value.toLowerCase().trim();

    
    if (text.includes(",")) {
        const textParts = text.split(",");
        text = textParts[textParts.length - 1].trim();
    }

    listbox.innerHTML = ""; 

    const flist = list.filter(item => item.toLowerCase().startsWith(text));

   
    if (flist.length !== 1) {
        
               

        
        if (typeof newsr === "undefined") {
            try {
                
                const response = await fetch("/img", { method: "HEAD" });
                if (!response.ok) {
                    //it already covers 400-500 as well but without throwing an error if you dont add these lines
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                    
                }

                newsr = "static/images/n8.jpg";
                imgl.innerHTML = "";
                imgl.src="";
                imgl.src = newsr;
                newsrcc = newsr
                                
            } catch (error) {
                //alert("Image does not exist:" +  error.message);
                
            }
            

        }

        ifcityselflag = "";  //no need to send the same fetch img request again

 
    }
    
    else if (flist.length === 1) {
        const n = flist[0];
        if (n !== ifcityselflag) {
            
            fetch(`/img?q=${n}&timestamp=${Date.now()}`)
                .then(response => response.json())
                .then(data => {
                    let newSrc = data.data + "?timestamp=" + Date.now();
                    imgl.innerHTML = "";
                    imgl.src = newSrc; 
                });
            ifcityselflag = n; 
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

// it doesnt work without domcontentloaded somehow
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("textf2");
    const imgl = document.getElementById("imgl");

    input.addEventListener("change", async function (event) {
    const textt2v = event.target.value;
            //alert("92929299229929");
        //alert(event.target.value);
        const lstx = textt2v.includes(",") && textt2v.split(",").length > 1 ? textt2v.split(", ") : null;

        if (lstx.length > 1) {
            const rs = [];
            for (let i = 0; i < lstx.length - 1; i++) {
                rs.push([lstx[i], lstx[i + 1]]);
            }

            rstext = JSON.stringify({ urtext: rs });
            //alert(rstext);

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

                    imgl.src = "";
                    imgl.innerHTML = "";
                    imgl.src = data.data + "?timestamp=" + Date.now();
                }

            } catch (error) {
                alert("An error occurred: " + (error.message || "Unknown error"));
            }
        } else {
            alert("Error");
        }
    });
});



ff.addEventListener("submit", async function(event) {
    event.preventDefault();

    alert("9292929929");
    
    
    const frm = new FormData(event.target);

    imgl.src = "";
    imgl.innerHTML = "";


    //const texttv = frm.get("textt"); 
    frm.append("textt", items.value);


    alert("Cookues: " + document.cookie);


    const succstxt = document.createElement("a");
    succstxt.href = "#";
    succstxt.textContent = "a";


    if(rstext || document.cookie.split("; ").length > 1){
        alert("11111");

        try{
            alert("22222");
            const response = await fetch(event.target.action, {
                method: "POST",
                body: frm
            });


            const data = await response.json();
            alert(data);

            if(data.Status !== "S"){
                alert("829292992929");
                return;
            }   
            else{
                alert("Successfull");
                listb.push(texttv)
            }

            succstxt.textContent = "b";
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
/*
let areas = Array.from(ee).reduce((acc, option) => {
    if (!acc.includes(option.value)) {
        acc.push(option.value);
    }
    return acc;
}, []);*/

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
            }
        }
    }

    else if(!isitopen){
        if(optid && rareas.includes(optid)){
            document.getElementById(optid).style.display = "block";

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
        alert("92929292992929222929");
        return;
    }
    



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
        imgl.innerHTML = "";
        imgl.src = "";


        imgl.src = data.filepath[0];
        alert(imgl.src);
        newsrcc = data.filepath[0];

        ff.style.display = "block";
        imgmap.style.display = "block";

        
        cityf.style.display = "none";
        list = txtsn instanceof String ? textbox.split(", ") : data.filepath[1]; 

        optidval = "";


    })
    .catch(error => alert("An error occured " + (error.message || "An error occured")));
        
        



});
    
////////////////////////////////////////////////////////////

let nnn = function(){
    cityf.style.display = "block";

}





let url;


inpf.addEventListener("change", function(event){
    const file = event.target.files[0];

    if(url){
        URL.revokeObjectURL(url);
    }



    url = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = url; 
    img.width = 40;
    document.body.appendChild(img);

    
    setTimeout(() => img.remove(), 4000);
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
        //
            
        const spans = document.querySelectorAll("div > span");
        spans.forEach(el => el.remove());
        return;
};



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

    /////////
    /////////

    let text = list[pos];

    fetch(`/img?q=${text}&timestamp=${Date.now()}`)
    .then(response => response.json())
    .then(data => {
        let newSrc = data.data + "?timestamp=" + Date.now();
        imgl.innerHTML = "";
        imgl.src = "";
        imgl.src = newSrc;

    });// data => data.json doesnt work
}


async function cookiedel(old){
        return new Promise(resolve => {
            setTimeout(() => {
                let updatedDocl = document.cookie ? document.cookie.split("; ") : [];
                //alert("Updated cookie length: " + updatedDocl.length);
                //old = updatedDocl; 
                resolve(updatedDocl);

            }, 1000)});
}






let selcity = async function(img) {
        
    let u = [];
    let docl = document.cookie ? document.cookie.split("; ") : [];

    if (pos === 999999) {
        return;
    }
    //alert(docl.length);

    if (docl.length === 0) {
        u = ["pos1", "first"];
    } else if (docl.length === 1) {
        u = ["pos2", "second"];
        img.style.display = "none";
    }

    let newcookie = u[0] + "=" + list[pos] + "; path=/;";
    document.cookie = newcookie; // Now actually setting the cookie

    //alert("the new cookie: " + newcookie);

    let possp = document.createElement("span");
    possp.innerText = `The ${u[1]} is selected as: ${list[pos]}`;
    imgmap.appendChild(possp);

    //pos = -1;

    if(u[0] !== "pos1"){
        
        try{  
            const response = await fetch("/img", {
                credentials: "same-origin" //for cookies
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message);
            }
            //alert("Data: " + data.data);

            let newSrc = data.data + "?timestamp=" + Date.now();
        imgl.innerHTML = "";
        imgl.src = "";
            imgl.src = newSrc;


            
        }
        catch(error){
            alert(error.message || "Unknown error");
        }

        pos = 999999;
    }
                

};




let refrimg = function(){
    const cs = document.cookie.split("; ");
4

    fetch("/img", {method: "DELETE",})
        .then(() => {
        imgl.innerHTML = "";
        imgl.src = "";

            imgl.src= newsrcc;
            newsr = undefined;

            for(let i=0;i<cs.length;i++){
                document.cookie = cs[i].split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            }});
        
    cookieclnr();
    pos = 999999;
};
    


const qlist = document.querySelectorAll("form#cityf, [button='b']");
let indxls = 2;
 

let nextprev = function(name){
    qlist[indxls].style.display = "none";
    indxls = (indxls + (name === "next" ? 2: -2) + qlist.length) % qlist.length;
    qlist[indxls].style.display = "block";

    if(indxls === 1){
        imgg.style.display = "block";
        //
            
        const spans = document.querySelectorAll("span");
        spans.forEach(el => el.remove());
        return;

    }

};


