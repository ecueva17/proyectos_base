/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ajaxStart(function() {
    $('#load-panel').show();
    $('#image-loading').show();
});

$(document).ajaxStop(function() {
    $('#load-panel').fadeOut(400);
});

function navegar(id, url, target, method, parametros) {
    $("#mensaje").addClass("hide");
    $.ajax({
        async: true,
        url: ctx + "/" + url,
        type: (method) ? method : 'POST',
        data: parametros,
        success: function(data) {
            $("#" + target).html(data);
            $(".menu li").removeClass("active");
            $("#" + id).addClass("active");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function mostrarMensaje(contenedor, tipo, mensaje) {//tipo: danger, info, success, warning
    $("#" + contenedor).attr("class", "");
    $("#" + contenedor).addClass("alert").addClass("alert-" + tipo);
    $("#" + contenedor).removeClass("hide");
    $("#" + contenedor).html(mensaje);
}

function soloNumero(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function noEsTextoNumerico(texto) {
    if (isNaN(texto))
    {
        return true;
    }
    return false;
}

function esTeclaEspecial(codigo) {
    switch (codigo) {
        case 8:  // Backspace
            //console.log('backspace');
        case 9:  // Tab
        case 13: // Enter
        case 32: // Space
        case 37: // Left
        case 38: // Up
        case 39: // Right
        case 40: // Down
            break;

        default:
            return false;
    }
    return true;
}