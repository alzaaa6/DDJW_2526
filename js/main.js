import {$} from "../library/jquery-4.0.0.slim.module.min.js";


$(function() { 

    function iniciarPartida(mode) {
        let aliasJugador = prompt("Introdueix el teu àlies per jugar:");
        if (aliasJugador) {
            sessionStorage.setItem('playerAlias', aliasJugador);
            sessionStorage.removeItem('load'); 
            window.location.assign("./html/canvasgame.html?mode=" + mode);
        }
    }

    $('#play1').on('click', function(){
        iniciarPartida(1);
    });
    
    $('#play2').on('click', function(){
        iniciarPartida(2);
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

