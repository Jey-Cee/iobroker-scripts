//Author: Jey Cee;   e-mail: jey-cee@live.com
//
//Script Name: RezeptBuch
//Version: 0.1.2 Erstellungsdatum: 13.06.2016
//
//Beschreibung: Legt die Obejkt Struktur für das RezeptBuch an, ermöglicht das durchblättern der Rezepte und das einfügen von Rezepten in den Essensplan.
//
//Changelog: 
//          05.11.2017 0.1.2: Filterfunktion hinzugefügt um die Anzahl der angezeigten Rezepte zu reduzieren
//          16.04.2017 0.1.1: Rezepte aus dem Buch können jetzt in den Essensplan eingefügt werden.

createStates();

function createStates(){
    
    createState("RezeptBuch.vis_switch", "", {type: "string"});
    createState("RezeptBuch.filter", "", {type: "string"});
    createState("Essensplan.svae_Rezept", false, {type: "boolean"});
    
        createState("RezeptBuch.ID", 0, {Type: "string"});          
        createState("RezeptBuch.Link", 0, {Type: "string"});
        createState("RezeptBuch.Name", 0, {Type: "string"});
        createState("RezeptBuch.Zubereitung", 0, {Type: "string"});
        createState("RezeptBuch.Zutaten", 0, {Type: "string"});
}

var fs = require('fs');
var iR = 0;

var arr = [];

//arr Befüllen wenn der Filter gesetzt wird
on({id: "javascript.0.RezeptBuch.filter"
    },function(obj){
        var fileData = fs.readFileSync('/opt/iobroker/iobroker-data/files/vis.0/main/RezeptBuch.json');
        
        if(getState("javascript.0.RezeptBuch.filter").val !== ''){
           
            var all = JSON.parse(fileData);     //Ganzes Rezept Buch lesen
            anzahl_all = all.Rezept.length -1;     //Anzahl aller Rezepte im Buch
            
            
            arr= {Rezept: []};
            
            var search_string = getState("javascript.0.RezeptBuch.filter").val;
            
            var patt_komma = new RegExp(/,/g);
            
            if(patt_komma.test(search_string) === false){
                search_string = search_string + ',';
            }
            
            var search_array = search_string.split(',');                            //Suchbegriffe von einem String in ein Array umwandeln   
            var anzahl_s_arr = search_array.length -1;
            
            
            for(var i = 0; i <= anzahl_all; i++){               //für jedes Rezept
                for(var z = 0; z <= anzahl_s_arr; z++){         //für jeden Suchbegriff
                    var id = all.Rezept[i].ID;
                    var checkID = new RegExp (id, 'g');
                    var str_arr = JSON.stringify(arr);
                    var result = checkID.test(str_arr);
                    
                    log(str_arr);
                    
                    if(search_array[z] === ''){
                        //log(search_array[z]);
                    }else if(result === true){
                        
                    }else{
                        
                        var sString = new RegExp (search_array[z], 'g');
                        log(search_array[z]);
                        if(sString.test(all.Rezept[i].Name)){       //prüft das vorkommen des Suchbegriffs im Namen
                            log(sString.test(all.Rezept[i].Name) + ' ' + all.Rezept[i].Name);
                            arr['Rezept'].push(all.Rezept[i]);
                        }else if(sString.test(all.Rezept[i].Zutaten)){  //prüft das vorkommen des Suchbegriffs in den Zutaten
                            log(sString.test(all.Rezept[i].Name) + ' ' + all.Rezept[i].Name);
                            arr['Rezept'].push(all.Rezept[i]);
                        }
                    }
                    
                }
            }
        }
    })

on({id: "javascript.0.RezeptBuch.vis_switch"/*RezeptBuch.vis_switch*/
    }, function(obj){
        var fileData = fs.readFileSync('/opt/iobroker/iobroker-data/files/vis.0/main/RezeptBuch.json');
        var vis_switch = getState("javascript.0.RezeptBuch.vis_switch"/*RezeptBuch.vis_switch*/).val;
        var anzahl_rezepte;
        
        
        if(getState("javascript.0.RezeptBuch.filter").val !== ''){
            anzahl_rezepte = arr.Rezept.length -1;
            log(anzahl_rezepte);
        }else{
            arr = JSON.parse(fileData);
            anzahl_rezepte = arr.Rezept.length -1;
        }
        
        if(vis_switch === "vor"){
            if(iR < arr.Rezept.length -1) {++iR;}
            setState("javascript.0.RezeptBuch.ID"/*RezeptBuch.ID*/, arr.Rezept[iR].ID);
            setState("javascript.0.RezeptBuch.Name"/*RezeptBuch.Name*/, arr.Rezept[iR].Name);
            setState("javascript.0.RezeptBuch.Link"/*RezeptBuch.Link*/, arr.Rezept[iR].Link);
            setState("javascript.0.RezeptBuch.Zutaten"/*RezeptBuch.Zutaten*/, arr.Rezept[iR].Zutaten);
            setState("javascript.0.RezeptBuch.Zubereitung"/*RezeptBuch.Zubereitung*/, arr.Rezept[iR].Zubereitung);
            
            setState("javascript.0.RezeptBuch.vis_switch"/*RezeptBuch.vis_switch*/, "");
            log("Rauf: " + iR);
        }
        else if(vis_switch === "zurueck"){
            if(iR > 0) {--iR; log("Zählt runter " + iR);}
            setState("javascript.0.RezeptBuch.ID"/*RezeptBuch.ID*/, arr.Rezept[iR].ID);
            setState("javascript.0.RezeptBuch.Name"/*RezeptBuch.Name*/, arr.Rezept[iR].Name);
            setState("javascript.0.RezeptBuch.Link"/*RezeptBuch.Link*/, arr.Rezept[iR].Link);
            setState("javascript.0.RezeptBuch.Zutaten"/*RezeptBuch.Zutaten*/, arr.Rezept[iR].Zutaten);
            setState("javascript.0.RezeptBuch.Zubereitung"/*RezeptBuch.Zubereitung*/, arr.Rezept[iR].Zubereitung);
            
            setState("javascript.0.RezeptBuch.vis_switch"/*RezeptBuch.vis_switch*/, "");
            log("Runter: " + iR); 
        }
        else if((vis_switch === "Montag") || (vis_switch === "Dienstag") || (vis_switch === "Mittwoch") || (vis_switch === "Donnerstag") || (vis_switch === "Freitag") || (vis_switch === "Samstag") || (vis_switch === "Sonntag")){
            setState("javascript.0.Essensplan." + vis_switch + ".ID", getState("javascript.0.RezeptBuch.ID"/*RezeptBuch.ID*/).val);
            setState("javascript.0.Essensplan." + vis_switch + ".Name", getState("javascript.0.RezeptBuch.Name"/*RezeptBuch.Name*/).val);
            setState("javascript.0.Essensplan." + vis_switch + ".Zutaten", getState("javascript.0.RezeptBuch.Zutaten"/*RezeptBuch.Zutaten*/).val);
            setState("javascript.0.Essensplan." + vis_switch + ".Zubereitung", getState("javascript.0.RezeptBuch.Zubereitung"/*RezeptBuch.Zubereitung*/).val);
            setTimeout(function(){
                setState("javascript.0.RezeptBuch.vis_switch"/*RezeptBuch.vis_switch*/, "");   //Setzt den Speichern Auslöser zurück
            }, 500); 
        }
});
