//Author: Jey Cee;   e-mail: jey-cee@live.com
//
//Script Name: Essensplan
//Version: 0.1.0 Erstellungsdatum: 13.05.2016
//Beschreibung: Legt die Obejkt Struktur für den Essensplan an. 

createStates();

function createStates(){
    var Tag = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    
    createState("Essensplan.vis_switch");
    createState("Essensplan.save_rezept", false, {type: "boolean"});
    for(var i = 0; i < Tag.length; i++){
        createState("Essensplan." + Tag[i] + ".ID", 0, {Tag: Tag[i]});          //Wird im Zusammenhang mit RezeptBuch benötigt
        createState("Essensplan." + Tag[i] + ".Link", 0, {Tag: Tag[i]});
        createState("Essensplan." + Tag[i] + ".Name", 0, {Tag: Tag[i]});
        createState("Essensplan." + Tag[i] + ".Zubereitung", 0,{Tag: Tag[i]});
        createState("Essensplan." + Tag[i] + ".Zutaten", 0,{Tag: Tag[i]});
    }
}
