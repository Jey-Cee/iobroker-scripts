//Author: Jey Cee;   e-mail: jey-cee@live.com
//
//Script Name: Rezept Speichern
//Version: 0.1.1 Erstellungsdatum: 13.05.2016
//
//Beschreibung: Speichert das Rezept entsprechend dem Ausgewählten Tag (Objekt: vis-switch enthält den Tag als String) im Essensplan.
//              Dabei erhält das Rezept eine ID und es wird das Datum an dem es gespeichert wurde hinterlegt.
//
//Changelog: 
//          16.04.2017 0.1.1: Formatierung entfernt aufgrund von Problemen beim Löschen von Rezepten.

var pfadRezeptBuch = '/opt/iobroker/iobroker-data/files/vis.0/main/RezeptBuch.json';    //Pfad zum RezeptBuch

var fs = require('fs');
var Tag;

on({id: "javascript.0.Essensplan.save_rezept"/*Essensplan.save_rezept*/,
    val: true
    }, function(obj){
        
        fs.stat(pfadRezeptBuch, function(err, stats){                   //Prüfen ob datei vorhanden
            if (err === null){
                leseRezepte();                                          //Wenn datei vorhanden, Rezept hinzufügen
            }else{
                fs.writeFileSync(pfadRezeptBuch, '{"Rezept":[      }');              //Wenn datei nicht vorhanden, Datei erstellen und danach Rezept hinzufügen
                schreibeRezept();
            }
        });
        
        setTimeout(function(){
            setState("javascript.0.Essensplan.save_rezept"/*Essensplan.save_Rezept*/, false);   //Setzt den Speichern Auslöser zurück
        }, 500);                                                                                //Der Timeout dient lediglich optischen zwecken und kann entfernt werden
    });

//Liest die RezeptBuch.json ein und schreibt sie in eine Variable
function leseRezepte(){
    var Rezepte = fs.readFileSync(pfadRezeptBuch);
    Tag = getState("javascript.0.Essensplan.vis_switch"/*Essensplan.vis_switch*/).val;
    var Name = getState("javascript.0.Essensplan." + Tag + ".Name").val;
    var Link = getState("javascript.0.Essensplan." + Tag + ".Link").val;
    var Zutaten = getState("javascript.0.Essensplan." + Tag + ".Zutaten").val;
    var Zubereitung = getState("javascript.0.Essensplan." + Tag + ".Zubereitung").val;
        
        setTimeout(function(){
        Rezepte = JSON.parse(Rezepte);
        
        //Prüft ob das Rezept schon im RezeptBuch vorhanden ist
        var vorhanden;
        
        for (var z = 0; z <= Rezepte.Rezept.length -1; z++){        
            var Name_json = Rezepte.Rezept[z].Name;
            var Link_json = Rezepte.Rezept[z].Link;
            var Zutaten_json = Rezepte.Rezept[z].Zutaten;
            var Zubereitung_json = Rezepte.Rezept[z].Zubereitung;
            
            if (Name === Name_json && Link === Link_json && Zutaten === Zutaten_json && Zubereitung === Zubereitung_json){
                vorhanden = "true";
            }else{
                //schreibeRezept();
                vorhanden = "false";
            }
        }
        if(vorhanden === "false"){schreibeRezept(); log("Rezept hinzugefügt");}
        }, 300);
        
        
        
}   


//Schreibt die Rezepte ans Ende der Datei
function schreibeRezept(){
    Tag = getState("javascript.0.Essensplan.vis_switch"/*Essensplan.vis_switch*/).val;
    //Datei öffnen
    fs.open(pfadRezeptBuch, 'r+', function(err, fd) {
        if (err) {
            return console.error(err);
        }

        fs.fstat(fd, function(err, stats){
        
            //Daten Sammeln und in String packen
            var Name = getState("javascript.0.Essensplan." + Tag + ".Name").val;
            var Link = getState("javascript.0.Essensplan." + Tag + ".Link").val;
            var Zutaten = getState("javascript.0.Essensplan." + Tag + ".Zutaten").val;
            var Zubereitung = getState("javascript.0.Essensplan." + Tag + ".Zubereitung").val;
            var Datum = new Date();
            
            var Daten;
            
            if (stats.size <=25){
                Daten = '{"ID":"' + erzeugeID() + '","Name":"' + Name + '","Link":"' + Link + '","Zutaten":"' + Zutaten + '","Zubereitung":"' + Zubereitung + '","Datum":"' + Datum + '"}]}';
                }else{
                    Daten = ', {"ID":"' + erzeugeID() + '","Name":"' + Name + '","Link":"' + Link + '","Zutaten":"' + Zutaten + '","Zubereitung":"' + Zubereitung + '","Datum":"' + Datum + '"}]}';
                }
             log(fd);
             log(Tag);
             log(Daten);
             
            //Schreibe Daten
            fs.write(fd, Daten, stats.size -2, function(err, fd) {   
                if (err) {
                    return console.error(err);
                    }
            });
        });

    });
}

//Erzeugt eine eindeutige ID für jedes Rezept das gespeichert wird
function erzeugeID(){
    var heute = new Date();
    heute = heute.toLocaleString();
    heute = heute.replace(/-/g, '');
    heute = heute.replace(/ /g, '');
    var ID = heute.replace(/:/g, '');
    return ID;
}
