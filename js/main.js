$(function() { 
    $('#play').on('click', function(){
        let aliasJugador = prompt("Introdueix el teu àlies per jugar:");
        console.log("Àlies del jugdor: " + aliasJugador);
        alert("Benvingut, " + aliasJugador + "! El joc començarà aviat.");
        window.location.assign("./html/game.html");
    });

    $('#options').on('click', function(){
        console.error("Opció no implementada");
    });

    $('#saves').on('click', function(){
        console.error("Opció no implementada");
    });

    $('#exit').on('click', function(){
        console.warn("No es pot sortir!");
    });
});