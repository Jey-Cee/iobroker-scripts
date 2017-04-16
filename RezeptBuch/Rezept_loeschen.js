//Author: Jey Cee;   e-mail: jey-cee@live.com
//
//Script Name: Rezept Speichern
//Version: 0.1.0 Erstellungsdatum: 15.04.2017
//
//Beschreibung: Löscht das ausgewählte Rezept.

var pfadRezeptBuch = '/opt/iobroker/iobroker-data/files/vis.0/main/RezeptBuch.json';    //Pfad zum RezeptBuch

var fs = require('fs');
//var varID = getState("javascript.0.RezeptBuch.ID"/*RezeptBuch.ID*/).val;

on({id: "javascript.0.RezeptBuch.vis_switch"/*RezeptBuch.vis_switch*/,
    val: 'delete'
    }, function(obj){
        deleteRezept();
        
        setTimeout(function(){
            setState("javascript.0.RezeptBuch.vis_switch"/*RezeptBuch.vis_switch*/, '');   //Setzt den vis_switch zurück
        }, 500);                                                                           //Der Timeout dient lediglich optischen zwecken und kann entfernt werden
});
    
//Löscht ein Rezept
function deleteRezept(){
    
    //Datei öffnen
    fs.readFile(pfadRezeptBuch, function(err, data) {
    var obj = JSON.parse(data);
    var Rezept = obj.Rezept;
    
    var i = Rezept.length;
    var varID = getState("javascript.0.RezeptBuch.ID"/*RezeptBuch.ID*/).val;
    while( i-- ) {
        if( Rezept[i].ID === varID) break;
    }
    obj['Rezept'].splice(i, 1);
    
    fs.writeFile(pfadRezeptBuch, JSON.stringify(obj), function(err) {
    log('Rezept gelöscht');
    });
});

}
