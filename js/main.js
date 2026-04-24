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
        let saved = {};
        if (localStorage.options) {
            saved = JSON.parse(localStorage.options);
        }
        let resum = "Configuració del Mode 1:\n" +
                    "- Formes: " + (saved.m1_pairs || 2) + "\n" +
                    "- Dificultat: " + (saved.m1_difficulty || 'normal') + "\n" +
                    "- Mida del grup: " + (saved.m1_groupSize || 2) + "\n\n" +
                    "Vols jugar amb aquesta configuració?";
        if (confirm(resum)) {
            iniciarPartida(1);
        } else {
            window.location.assign("./html/options.html");
        }
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
        window.location.assign("./html/saves.html");    
    });
});

