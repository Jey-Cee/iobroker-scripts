//Author: Jey Cee;      e-mail: jey-cee@live.com 
//
//Script Name: Chefkoch_Rezept_holen
//Version: 0.1.1 Erstellungsdatum: 13.05.2016
//Beschreibung: Liest ein Rezept anhand des Links von der Seite Chefkoch.de und überträgt die Daten als reinen String in zuvor angelegte Objekte.
//              Wichtig: Die Objekt struktur wird vom script "Essensplan" erstellt.
//
//Changelog:
//          16.04.2017 0.1.1: Zubereitung wurde durch Änderungen bei Chefkoch nicht mehr abgerufen. Fixed.

var link;
var Tag;
var request = require('request');

function findeZubereitung (body) {   
    
    //Beschreibung der Zubereitung finden und vom HTML code befreien
    var index1 = body.indexOf('<div id="rezept-zubereitung" class="instructions m-b-200">');
    var text1 = body.slice(index1);
    var index2 = text1.indexOf('</div>');
    text1 = text1.slice(0, index2);
    
    text1 = text1.replace('<div id="rezept-zubereitung" class="instructions m-b-200">', "");
    text1 = text1.replace(/<br>/g, "");
    text1 = text1.replace(/<br \/>/g, "");
    text1 = text1.replace(/\t/g, "");
    text1 = text1.replace(/\n/g, "");
    text1 = text1.replace(/\s\s*/g, " ");
    
    setState("javascript.0.Essensplan." + Tag + ".Zubereitung"/*Essensplan." + Tag + ".Zubereitung*/, text1);

}

function findeZutaten (body) {   
    
    //Zutaten liste vom HTML Code befreien
    var index1 = body.indexOf('<table class="incredients">');
    var text1 = body.slice(index1);
    var index2 = text1.indexOf('</table>');
    text1 = text1.slice(0, index2);
    
    text1 = text1.replace(/<td>/g, " ");
    text1 = text1.replace(/\s<\/tr>/g, "; ");
    text1 = text1.replace(/<.*>/g, "");
    text1 = text1.replace(/\t/g, "");
    text1 = text1.replace(/\n/g, "");
    text1 = text1.replace(/\s\s;/g, "");
    text1 = text1.replace(/ ;/g, ";");
    text1 = text1.replace(/ /g, " ");
    text1 = text1.replace(/\&nbsp;/g, " ");
    
    
    //Anzahl der Portionen ermitteln
    var text2 = new RegExp(/id="divisor" value="\d"/);
    text2 = text2.exec(body);
    text2 = text2.toString();
    text2 = text2.replace('id="divisor" value="', "");
    var anzahlPortionen = text2.replace('"', "");
    
    setState("javascript.0.Essensplan." + Tag + ".Zutaten"/*Essensplan." + Tag + ".Zutaten*/, anzahlPortionen + ' Portionen: ' + text1);

}

function findeRezeptName (body) {   
    
    var text1 = new RegExp('<h1 class="page-title">.*</h1>');
    text1 = text1.exec(body);
    text1 = text1.toString();
    text1 = text1.replace('<h1 class="page-title">', "");
    text1 = text1.replace('</h1>', "");
    text1 = text1.replace(/ä/g, "ae");
    text1 = text1.replace(/ö/g, "oe");
    text1 = text1.replace(/ü/g, "ue");
    text1 = text1.replace(/&auml;/g, "ae");
    setState("javascript.0.Essensplan." + Tag + ".Name"/*Essensplan." + Tag + ".Name*/, text1);
}

function leseWebseite () {
    try {
        request(link, function (error, response, body) {
            if (!error && response.statusCode == 200) {              // kein Fehler, Inhalt in body
                findeRezeptName(body);
                findeZutaten(body);
                findeZubereitung(body);
            } else log(error,'error');                               // Error beim Einlesen
        });
    } catch (e) {
        log('Fehler (try) leseWebseite: ' + e, 'error');
    }   
}


// bei Skriptstart
on({id: /javascript\.0\.Essensplan\..*\.Link/
}, function (obj){
    Tag = obj.native.Tag;
    link = getState(obj.id).val;
    link = link.replace(/.* /g, "");
    var patt = new RegExp(/chefkoch/);
    if (patt.test(link)){
        leseWebseite();
    }
});
