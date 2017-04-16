//Author: Jey Cee;   e-mail: jey-cee@live.com
//
//Script Name: RezeptBuch
//Version: 0.1.1 Erstellungsdatum: 13.06.2016
//
//Beschreibung: Legt die Obejkt Struktur für das RezeptBuch an, ermöglicht das durchblättern der Rezepte und das einfügen von Rezepten in den Essensplan.
//
//Changelog: 
//          16.04.2017 0.1.1: Rezepte aus dem Buch können jetzt in den Essensplan eingefügt werden.

createStates();

function createStates(){
    
    createState("RezeptBuch.vis_switch", "", {type: "string"});
    createState("Essensplan.svae_Rezept", false, {type: "boolean"});
    
        createState("RezeptBuch.ID", 0, {Type: "string"});          
        createState("RezeptBuch.Link", 0, {Type: "string"});
        createState("RezeptBuch.Name", 0, {Type: "string"});
        createState("RezeptBuch.Zubereitung", 0, {Type: "string"});
        createState("RezeptBuch.Zutaten", 0, {Type: "string"});
}

var fs = require('fs');
var iR = 0;

on({id: "javascript.0.RezeptBuch.vis_switch"/*RezeptBuch.vis_switch*/
    }, function(obj){
        var fileData = fs.readFileSync('/opt/iobroker/iobroker-data/files/vis.0/main/RezeptBuch.json');
        var arr = JSON.parse(fileData);
        var vis_switch = getState("javascript.0.RezeptBuch.vis_switch"/*RezeptBuch.vis_switch*/).val;
        //var anzahl_rezepte = arr.Rezept.length -1;
        
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
