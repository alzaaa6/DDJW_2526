import {$} from "../library/jquery-4.0.0.slim.module.min.js";


$(function() { 
    $('#play').on('click', function(){
        let aliasJugador = prompt("Introdueix el teu àlies per jugar:");
        if (aliasJugador) {
            sessionStorage.setItem('playerAlias', aliasJugador);
            sessionStorage.removeItem('load'); 
            window.location.assign("./html/canvasgame.html");
        }
    });

    $('#scores').on('click', function(){
        console.error("Opció no implementada");
    });

    $('#options').on('click', function(){
        window.location.assign("./html/options.html");
    });

    $('#saves').on('click', function(){
        console.error("Opció no implementada");
    });
});

