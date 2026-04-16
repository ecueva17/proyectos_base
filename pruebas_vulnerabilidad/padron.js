//var pagina = 1, inPaginacion = 1   ;
var ordenadoPor = "apPrimer";
$(document).ready(function () {
    if ($("#modoVisualizacion").val() === "totem") {
        var customCSS = {
            input: 'form-control input-sm',
            container: 'dropdown-menu',
            buttonDefault: 'btn',
            buttonHover: 'btn-primary',
            buttonAction: 'active',
            buttonDisabled: 'disabled'
        }, layoutNumerico = ['7 8 9', '4 5 6', '1 2 3', '0 {b} {a}', '{c}'];
        $('#nuDni,#nuDniAlertado').keyboard({
            css: customCSS,
            layout: 'custom',
            customLayout: {'default': layoutNumerico,},
            usePreview: false,
            resetDefault: true,
            maxLength: 8,
            acceptValid: true,
            useCombos: false,
            autoAccept: true,
            change: function (e, keyboard, el) {
                $('#formPadron').formValidation('revalidateField', 'nuDni');
                $('#formModalAlertas').formValidation('revalidateField', 'nuDniAlertado');
            },
            visible: function (e, keyboard, el) {
                keyboard.$allKeys.on('mousedown.audio', function () {
                    clicky.pause();
                    clicky.play();
                });
            }
        }).addTyping({showTyping: true, delay: 50});
        $('#apPrimer,#apSegundo,#prenomInscrito,#deDireccion, #deEmail').keyboard({
            css: customCSS,
            layout: 'spanish',
            usePreview: false,
            resetDefault: true,
            acceptValid: true,
            useCombos: false,
            autoAccept: true,
            change: function (e, keyboard, el) {
                var texto = keyboard.$preview[0].value;
                var ultima = texto.substring(texto.length - 1, texto.length);
                if (keyboard.$preview[0].name === 'deDireccion') {
                    if (!validarTextoDireccion(ultima)) {
                        keyboard.$preview[0].value = texto.substring(0, texto.length - 1);
                    }
                } else {
                    if (!validarTextoNombre(ultima)) {
                        keyboard.$preview[0].value = texto.substring(0, texto.length - 1);
                    }
                }
            },
            visible: function (e, keyboard, el) {
                keyboard.$allKeys.on('mousedown.audio', function () {
                    clicky.pause();
                    clicky.play();
                });
            }
        }).addTyping({showTyping: true, delay: 50});
    }
    $("#formPadron").formValidation({
        locale: 'es_ES',
        fields: {
            nuDni: {
                validators: {
                    stringLength: {min: 8, max: 8, message: msg_dni_completo},
                    digits: {message: 'El n�mero de DNI s�lo admite caracteres num&eacute;ricos.'}
                }
            },
            apPrimer: {
                validators: {
                    stringLength: {min: 1, max: 40, message: 'S�lo puede ingresar 40 caracteres.'},
                    callback: {message: 'Se ingresaron caracteres no permitidos', callback: validarCadenaNombre}
                }
            },
            pagina: {
                excluded: false,
                validators: {
                    notEmpty: {message: 'Ingresar pagina'},
                    digits: {message: 'El n�mero de pagina s�lo admite caracteres num&eacute;ricos.'}
                }
            },
            apSegundo: {
                validators: {
                    stringLength: {min: 1, max: 40, message: 'S�lo puede ingresar 40 caracteres.'},
                    callback: {message: 'Se ingresaron caracteres no permitidos', callback: validarCadenaNombre}
                }
            },
            prenomInscrito: {
                validators: {
                    stringLength: {
                        min: 1,
                        max: 60,
                        message: 'S�lo puede ingresar 60 caracteres.'
                    }, callback: {message: 'Se ingresaron caracteres no permitidos', callback: validarCadenaNombre}
                }
            }/*,
            deDireccion: {
                validators: {
                    stringLength: {min: 3, max: 100, message: msg_direccion_minimo},
                    callback: {message: 'Se ingresaron caracteres no permitidos', callback: validarCadenaDireccion}
                }
            }*/
        }
    }).on('err.field.fv', function (e, data) {
        data.fv.disableSubmitButtons(false);
    }).on('success.field.fv', function (e, data) {
        data.element.parents('.form-group').removeClass('has-success');
        data.element.data('fv.icon').hide();
        data.fv.disableSubmitButtons(false);
    }).on('success.form.fv', function (e) {
        e.preventDefault();
        //configurarConsulta(1, 0);        
        pagina = parseInt($("#pagina_act_cp").text());
        var orden = $("#tipo_busqueda_cp").text();
        var nuDniBusqueda = $("#formPadron #nuDni").val();
        var apPrimerBusqueda = trim($("#formPadron #apPrimer").val());
        var apSegundoBusqueda = trim($("#formPadron #apSegundo").val());
        var prenomInscritoBusqueda = trim($("#formPadron #prenomInscrito").val());
        var deDireccionBusqueda = trim($("#formPadron #deDireccion").val());
        var contador = 0;
        var mensaje = msg_criterios_busqueda;
        //    if ((apPrimerBusqueda=="" && apSegundoBusqueda=="") ||
        /*   (apPrimerBusqueda=="" && prenomInscritoBusqueda=="") ||
           (apPrimerBusqueda=="" && deDireccionBusqueda=="") ||
           (apSegundoBusqueda=="" && prenomInscritoBusqueda=="") ||
           (apSegundoBusqueda=="" && deDireccionBusqueda=="") ||
           (prenomInscritoBusqueda=="" && deDireccionBusqueda=="")
         ) */
        document.getElementById("divMensajeBusqueda").innerHTML = "";
        if (apPrimerBusqueda == "") {
            contador++;
        }
        if (apSegundoBusqueda == "") {
            contador++;
        }
        if (prenomInscritoBusqueda == "") {
            contador++;
        }
        if (deDireccionBusqueda == "") {
            contador++;
        }        
        if (contador > 2 && nuDniBusqueda == "") {
            if( $("#chkDni").prop('checked') ) {
                document.getElementById("divMensajeBusqueda").innerHTML = msg_dni_obligatorio;   
            }else{
                 document.getElementById("divMensajeBusqueda").innerHTML = mensaje;   
            }
            
        } else {

            /*grecaptcha.enterprise.ready(function () {
                grecaptcha.enterprise.execute(recaptchaSiteKey, {action: 'ordenar'}).then(function (token) {*/
                    
                    tipo_paginacion = 'A';
                    var params = {
                        "pagina": pagina,
                        "deOrdenar": orden,
                        "nuDni": nuDniBusqueda,
                        "apPrimer": apPrimerBusqueda,
                        "apSegundo": apSegundoBusqueda,
                        "prenomInscrito": prenomInscritoBusqueda,
                        "deDireccion": deDireccionBusqueda,
                        "tipoPaginacion": tipo_paginacion,
                        "grecaptcha": null/*token*/


                    };
                    $.ajax({
                        url: ctx + "/" + $("#formOrdenar").attr("action"),
                        data: params,
                        type: 'POST',
                        async: false,
                        cache: false,
                        dataType: 'html',
                        success: function (data) {
                            
                            $('#resultado_datos').html(data);
                            var res_cp = $("#respuesta_cp").text();
                            if (res_cp === "SI") {
                                dni_resaltado = $('#dni_resaltado').text();
                                pagina = parseInt($("#pagina_act_cp").text());
                                tipo_paginacion = $('#tipo_paginacion').text();
                                //configurarConsulta(pag, 1);
                                cargarPadron();
                            } else {
                                $('#dni_resaltado').text(dni_resaltado);
                                $("#pagina_ant_cp").text(parseInt(pagina) - 1);
                                $("#pagina_act_cp").text(pagina);
                                $("#pagina_sig_cp").text(parseInt(pagina) + 1);
                                $('#tipo_paginacion').text(tipo_paginacion);
                                $('#tipo_busqueda_cp').text($('#cmbOrdenar').val());

                                if (res_cp === "NO") {
                                    var mensaje = msg_no_ciudadanos;
                                } else {
                                    if (res_cp === "NO_UBI") {
                                        var mensaje = no_ciudadano_ubi + ' ' + ubigeo_otro;
                                    } else {
                                        var mensaje = no_ciudadano_dni;
                                    }
                                }
                                mostrarNotificacion("warning", msg_atencion, mensaje, true);
                            }

                        },
                        error: function (e, f, g) {
                        }
                    });
                    //cargarPadron();


                /*});
            });*/

        }


    });

    $("#formModalAlertas").formValidation({
        locale: 'es_ES',
        fields: {
            nuDniAlertado: {
                validators: {
                    stringLength: {min: 8, max: 8, message: msg_dni_completo},
                    digits: {message: 'El n�mero de DNI s�lo admite caracteres num&eacute;ricos.'}
                }
            }, 
            deEmail: {
                    validators: {
                        email: {min: 5, max: 100,required:true, message: 'Ingrese correo electr�nico completo'},
                        notEmpty: { message: campo_obligatorio},
                    }
            }
        }
    }).on('err.field.fv', function (e, data) {
        data.fv.disableSubmitButtons(true);
    }).on('success.field.fv', function (e, data) {
        data.element.parents('.form-group').removeClass('has-success');
        data.element.data('fv.icon').hide();
        //data.fv.disableSubmitButtons(true);
    }).on('success.form.fv', function (e) {
        e.preventDefault();
        guardarAlerta();
        //cargarPadron();
    });
    $('#verModAlertas').click(function () {
        document.getElementById('nuDniAlertado').value = "";
        //$('#nuDniAlertado').val("");
        document.getElementById('nombreAlertado').value = "";
        document.getElementById('deDireccionAlertada').value = "";
        document.getElementById('deJustificacion').value = "";
        document.getElementById('deEmail').value = "";
        document.formModalAlertas.btnAlertar.disabled = true;
    });

    cargarPadron();

    if (esIE) {
        validarCampoEnIE("formPadron", "nuDni");
        validarCampoEnIE("formPadron", "deDireccion");
        validarCampoEnIE("formModalAlertas", "nuDniAlertado");
    }

    // Bloquear clic derecho
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Bloquear teclas comunes para Modo desarrolladores
    document.onkeydown = function (e) {
        // F12
        if (e.keyCode == 123) return false;
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) return false;
        // Ctrl+U (ver código fuente)
        if (e.ctrlKey && e.keyCode == 85) return false;
    };

    if(window.top != window.self){
        window.top.location.href = window.self.location.href;
    }
});

function atras() {
    reinicioTimeOut();

    pagina = parseInt($("#pagina_ant_cp").text());
    var orden = $("#tipo_busqueda_cp").text();
    //var params = {"pagina": pagina, "deOrdenar": orden};
    if (tipo_paginacion === 'A') {
        limpiarCampos();
    }
    var nuDniBusqueda = $("#formPadron #nuDni").val();
    var apPrimerBusqueda = $("#formPadron #apPrimer").val();
    var apSegundoBusqueda = $("#formPadron #apSegundo").val();
    var prenomInscritoBusqueda = $("#formPadron #prenomInscrito").val();
    var deDireccionBusqueda = $("#formPadron #deDireccion").val();

    /*grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise.execute(recaptchaSiteKey, {action: 'ordenar'}).then(function (token) {*/
            var params = {
                "pagina": pagina,
                "deOrdenar": orden,
                "nuDni": nuDniBusqueda,
                "apPrimer": apPrimerBusqueda,
                "apSegundo": apSegundoBusqueda,
                "prenomInscrito": prenomInscritoBusqueda,
                "deDireccion": deDireccionBusqueda,
                "tipoPaginacion": tipo_paginacion,
                "grecaptcha": null//token
            };
            $.ajax({
                url: ctx + "/" + $("#formOrdenar").attr("action"),
                data: params,
                type: 'POST',
                async: false,
                cache: false,
                dataType: 'html',
                success: function (data) {
                    $('#resultado_datos').html(data);
                    dni_resaltado = $('#dni_resaltado').text();
                    var res_cp = $("#respuesta_cp").text();
                    tipo_paginacion = $('#tipo_paginacion').text();
                    if (res_cp === "SI") {
                        //configurarConsulta(pag, 1);
                        cargarPadron();
                    }
                },
                error: function (e, f, g) {
                }
            });
        /*});
    });*/



}
;

function adelante() {   
    reinicioTimeOut();
    pagina = parseInt($("#pagina_sig_cp").text());
    var orden = $("#tipo_busqueda_cp").text();
    //var params = {"pagina": pagina, "deOrdenar": orden};
    if (tipo_paginacion === 'A') {
        limpiarCampos();
    }
    var nuDniBusqueda = $("#formPadron #nuDni").val();
    var apPrimerBusqueda = $("#formPadron #apPrimer").val();
    var apSegundoBusqueda = $("#formPadron #apSegundo").val();
    var prenomInscritoBusqueda = $("#formPadron #prenomInscrito").val();
    var deDireccionBusqueda = $("#formPadron #deDireccion").val();

    /*grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise.execute(recaptchaSiteKey, {action: 'ordenar'}).then(function (token) {*/
            var params = {
                "pagina": pagina,
                "deOrdenar": orden,
                "nuDni": nuDniBusqueda,
                "apPrimer": apPrimerBusqueda,
                "apSegundo": apSegundoBusqueda,
                "prenomInscrito": prenomInscritoBusqueda,
                "deDireccion": deDireccionBusqueda,
                "tipoPaginacion": tipo_paginacion,
                "grecaptcha": null//token
            };
            $.ajax({
                url: ctx + "/" + $("#formOrdenar").attr("action"),
                data: params,
                type: 'POST',
                async: false,
                cache: false,
                dataType: 'html',
                success: function (data) {
                    $('#resultado_datos').html(data);
                    dni_resaltado = $('#dni_resaltado').text();
                    var res_cp = $("#respuesta_cp").text();
                    tipo_paginacion = $('#tipo_paginacion').text();
                    if (res_cp === "SI") {
                        //configurarConsulta(pag, 1);
                        cargarPadron();
                    }
                },
                error: function (e, f, g) {
                }
            });
        /*});
    });*/



}
;

function limpiarCampos() {
    reinicioTimeOut();    
    document.getElementById("divMensajeBusqueda").innerHTML = "";
    //$('#formPadron')[0].reset();
    $('#formPadron').formValidation('revalidateField', 'nuDni').formValidation('revalidateField', 'apPrimer').formValidation('revalidateField', 'apSegundo').formValidation('revalidateField', 'prenomInscrito').formValidation('revalidateField', 'deDireccion');
}
;

function configurarConsulta(var1, var2) {
    pagina = var1;
    inPaginacion = var2;
}
;

function trim(cadena) {
    cadena = cadena.replace(/^\s+/, '').replace(/\s+$/, '');
    return (cadena);
}
;

function cargarPadron() {

    if (tipo_paginacion === 'A') {
        $('.paginacion').html(mostrando_pag + ": <span>" + pagina + " " + de_pag + ": " + pagina_fin + " " + paginas + " </span>");
        limpiarCampos();
    } else {
        $('.paginacion').html(result_busq + " - <span> " + pagina_cant + ": " + pagina + "</span>");
    }
    /*$("#formPadron #nuDni").val('');
     $("#formPadron #apPrimer").val('');
     $("#formPadron #apSegundo").val('');
     $("#formPadron #prenomInscrito").val('');
     $("#formPadron #deDireccion").val('');*/

    if (pagina === 1) {//si pag inicial
        $(".left-arrow").hide();//ocultar izquierda
    } else {
        $(".left-arrow").show();//mostrar
    }

    if (pagina === pagina_fin) {//si es la ultima pagina
        $(".right-arrow").hide();//ocultar derecha
    } else {
        $(".right-arrow").show();//mostrar
    }

    $("#pagina").val(pagina);
    //alert(pagina+"ggg")
    // var params = $('#formPadron').serialize();
    if ($("#modoVisualizacion").val() === "totem") {
        var kb = $('input[type=text]').getkeyboard();
        if (kb.isOpen) {
            kb.accept();
        }
    }


    /*grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise.execute(recaptchaSiteKey, {action: 'cargar'}).then(function (token) {*/
            //document.getElementById("grecaptcha").value = token;

            $.ajax({
                url: ctx + "/" + $("#urlCargarPadron").val(),
                //data:  $('#formPadron').serialize(),
                type: 'POST',
                async: false,
                cache: false,
                dataType: 'json',
                success: function (data) {
                    if (!$("body").hasClass("sidebar-collapse") || $("body").hasClass("sidebar-open")) {
                        $("body").addClass("sidebar-collapse");
                        $("body").removeClass("sidebar-open");
                    }

                    if (data.length === 0) {
                        var mensaje = msg_no_ciudadanos;
                        mostrarNotificacion("warning", msg_atencion, mensaje, true);
                    } else {
                        $(".content .row").fadeOut(300, function () {
                            $(this).html("").fadeIn(300, cargarPagina(data));
                        });
                    }
                },
                error: function (e, f, g) {
                }
            });
        /*});
    });*/



}
;

function cargarPagina(data) {
    // console.log("ordenado por " + ordenadoPor);
    var dataResaltInicio = [];
    var encontro = 0;
    // var suma;

    /*if (ordenadoPor === "deDireccion") {
        //console.log("aaa");
        data = data.sort(function (a, b) {
            return a.deDireccion.localeCompare(b.deDireccion);
        });
    } else {
        if (ordenadoPor === "nuDni") {
            data = data.sort(function (a, b) {
                return a.nuDni.localeCompare(b.nuDni);
            });
        } else {
            data = data.sort(function (a, b) {
                return a.nombreCompleto.localeCompare(b.nombreCompleto);
            });
        }
    }*/

    $.each(data, function (index, item) {
        if (item.nuDni == dni_resaltado) {
            dataResaltInicio.push(item);
            // console.log(item.nombreCompleto + " ooo " + index);
            encontro = index;
        }
    });
    if (encontro === "0") {
        dataResaltInicio = data;
    } else {
        $.each(data, function (index, item) {           
            if (item.nuDni != dni_resaltado) {
                dataResaltInicio.push(item);
            }
            //    console.log(item.nombreCompleto + " indice " + index + " suma " + suma);
        });
        data = dataResaltInicio;
    }


    var div2 = '<div class="clearfix visible-xs"></div>', div3 = '<div class="clearfix visible-sm"></div>',
        div4 = '<div class="clearfix visible-md"></div><div class="clearfix visible-lg"></div>';
    //var busquedaDni = 1;
    var cont = 0;
    $.each(data, function (index, item) {        
       
        console.log(index);
        if (item.nuDni == dni_resaltado) {  //&& busquedaDni==1
            var htmlContent = '<div class="col-md-3 col-sm-4 col-xs-12">' + '<!-- DIRECT CHAT PRIMARY @educapraX-->' + '<div id="foto-'+(index+1)+'" class="box box-warning direct-chat direct-chat-warning tarjeta-dni" style="border:solid 4px #7e0047" data-dni="DNI: ' + item.nuDni + '">' + '<div class="box-body">' + '<p class="watermarker t' + item.inCaducidad + '">';
        } else {
            //var htmlContent = '<div class="col-md-3 col-sm-4 col-xs-12">' + '<!-- DIRECT CHAT PRIMARY @educapraY-->' + '<div id="foto-'+(index+1)+'" class="box box-warning direct-chat direct-chat-warning">' + '<div class="box-body">' + '<p class="watermarker t' + item.inCaducidad + '">';
            var htmlContent = '<div class="col-md-3 col-sm-4 col-xs-12">' + '<!-- DIRECT CHAT PRIMARY @educapraY-->' + '<div id="foto-'+(index+1)+'" class="box box-warning direct-chat direct-chat-warning tarjeta-dni" data-dni="DNI: ' + item.nuDni + '">' + '<div class="box-body" style="overflow: visible !important;">' + '<p class="watermarker t' + item.inCaducidad + '">';
        }
        
        
        var estado = null;

        if (item.inCaducidad == null) {
            estado = estado_vigente;
        }
        if (item.inCaducidad == '1') {
            estado = estado_caduco;
        }
        if (item.inCaducidad == '2') {
            estado = estado_porcaducar;
        }

        htmlContent = htmlContent + '</p><div class="direct-chat-messages"><div class="direct-chat-msg">' +
            '<img class="foto"' + ' src="' + item.imagen + '" alt="message user image"' + '/>' +
            '<div class=" direct-chat-text"><img class="img-responsive" src="data:image/gif;base64,' + item.datos + '"/></div>';
       
        $(".content .row").append(htmlContent);
        if ((index + 1) % 4 == 0) {
            $(".content .row").append(div4);
        }

        if ((index + 1) % 3 == 0) {
            $(".content .row").append(div3);
        }
        if ((index + 1) % 2 == 0) {
            $(".content .row").append(div2);
        }
        $('.box').css("background-image", "url(" + imgTramado + ")");
        cont = cont + 1;
    });
    if (cont < $("#cantidadRegistros").val()) {
        $(".right-arrow").hide();//ocultar derecha
    }
}
;

function dniCambio() {
    document.formModalAlertas.btnAlertar.disabled = true;
}

function limpiarDni() {    
    document.getElementById('nuDni').value = "";
    $('#formPadron').formValidation('revalidateField', 'nuDni');

}

function limpiarDatosPersonales() {
    //$('#formPadron').formValidation('revalidateField', 'apPrimer').formValidation('revalidateField', 'apSegundo').formValidation('revalidateField', 'prenomInscrito').formValidation('revalidateField', 'deDireccion');
    document.getElementById('apPrimer').value = "";
    document.getElementById('apSegundo').value = "";
    document.getElementById('prenomInscrito').value = "";
    document.getElementById('deDireccion').value = "";
    $('#formPadron').formValidation('revalidateField', 'deDireccion');

}

function buscarDni() {   
    reinicioTimeOut();
    var params = {"nuDniAlertado": $("#nuDniAlertado").val()};
    $.ajax({
        url: ctx + "/" + $("#urlBuscarDni").val(),
        data: params,
        type: 'POST',
        async: true,
        cache: false,
        dataType: 'html',
        success: function (data) {

            $('#resultado_alerta').html(data);
            var res_alerta = $("#respuesta_alerta_cp").text();
            if (res_alerta === "NO") {
                var mensaje = msg_no_ciudadanos;
                mostrarNotificacion("warning", msg_atencion, mensaje, true);
                document.getElementById('nombreAlertado').value = "";
                document.getElementById('deDireccionAlertada').value = "";
                document.getElementById('deJustificacion').value = "";
                document.formModalAlertas.btnAlertar.disabled = true;
            } else {
                document.getElementById('nombreAlertado').value = $("#nombrec_alert_cp").html();
                document.getElementById('deDireccionAlertada').value = $("#direccion_alert_cp").html();
                document.getElementById('deJustificacion').value = msg_justificacion_inicio + ' ' + $("#nuDniAlertado").val() + ', ' + msg_justificacion_fin + '.';
                document.formModalAlertas.btnAlertar.disabled = false;
                $("#btnAlertar").removeClass('disabled');
            }
        },
        error: function (e, f, g) {
            var mensaje = msg_no_ciudadanos + " 222";
            mostrarNotificacion("warning", msg_atencion, mensaje, true);
        }
    });

}
;

function reordenar(val) {
   
    $("#cmbOrdenar").val(val);
    limpiarCampos();
    var nuDniBusqueda = $("#formPadron #nuDni").val();
    var apPrimerBusqueda = $("#formPadron #apPrimer").val();
    var apSegundoBusqueda = $("#formPadron #apSegundo").val();
    var prenomInscritoBusqueda = $("#formPadron #prenomInscrito").val();
    var deDireccionBusqueda = $("#formPadron #deDireccion").val();
    ordenadoPor = val;

    /*grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise.execute(recaptchaSiteKey, {action: 'ordenar'}).then(function (token) {*/
            var params = {
                "pagina": "0",
                "deOrdenar": val,
                "nuDni": nuDniBusqueda,
                "apPrimer": apPrimerBusqueda,
                "apSegundo": apSegundoBusqueda,
                "prenomInscrito": prenomInscritoBusqueda,
                "deDireccion": deDireccionBusqueda,
                "tipoPaginacion": tipo_paginacion,
                "grecaptcha": null,//token
                "isOrdenar": true
            };
            //var params = {"deOrdenar": val};
            $.ajax({
                url: ctx + "/" + $("#formOrdenar").attr("action"),
                data: params,
                type: 'POST',
                async: false,
                cache: false,
                dataType: 'html',
                success: function (data) {
                    $('#resultado_datos').html(data);
                    dni_resaltado = $('#dni_resaltado').text();
                    var res_cp = $("#respuesta_cp").text();
                    tipo_paginacion = $('#tipo_paginacion').text();
                    pagina = $('#pagina_act_cp').text();
                    if (res_cp === "SI") {
                        cargarPadron();
                    }
                },
                error: function (e, f, g) {
                }
            });
        /*});
    });*/


}
;

function cambiarImagen() {
    $('#imgDni').html('<img src="images/DNI_azul_dni.png" alt="RENIEC">');
}
;

function guardarAlerta() {
    var params = {
        "nuDniAlertado": $("#nuDniAlertado").val(),
        "nombreAlertado": $("#nombreAlertado").val(),
        "deEmail": $("#deEmail").val(),
        "deDireccionAlertada": $("#deDireccionAlertada").val()
    };
    $.ajax({
        url: ctx + "/" + $("#formModalAlertas").attr('action'),
        data: params,
        type: 'POST',
        async: true,
        cache: false,
        dataType: 'text',
        success: function (data) {
            //$('#resultado_datos').html(data);
            //var res_cp = $("#respuesta_cp").val();
            //alert(res_cp);
            var mensaje = "";
            if (data === "NO") {
                mensaje = msg_no_ciudadanos;
                mostrarNotificacion("warning", msg_atencion, mensaje, true);
            } else {
                if (data === "SI") {
                    mensaje = msg_alertar;
                    mostrarNotificacion("warning", msg_atencion, mensaje, true);
                } else {
                    mensaje = msg_no_ciudadanos;
                    mostrarNotificacion("warning", msg_atencion, mensaje, true);
                }
            }
            $('#modAlertar').modal('toggle');
        },
        error: function (e, f, g) {
        }
    });
}

var tiempo;
if(modo == 'totem') {
    tiempo = 900000; // 15 minutos
} else {
    tiempo = 180000; // 3 minutis
}


var timer=setTimeout(redirect, tiempo);

function redirect() {
  window.location = "/PLPI/login";
}
;
function reinicioTimeOut() {
    clearTimeout(timer);
    timer=setTimeout(redirect, tiempo);
}

function abrirModalConsultar(){    
    $("#modalConsultar").modal("show");    
    limpiarCampos();
    resetearFormularioConsultar();
    pintarDatosPersonales();
}

function AbrirModalAnuncio(){
   
    $("#modAnuncio").modal("show");
}

function pruebaTamanoDiv(){
    for(i=1; i <= $("#cantidadRegistros").val(); i++)
    {
        $("foto-"+i).height();
        if( i < $("#cantidadRegistros").val()/4 ){
            
        }
    }
}

/*
$("#modalConsultar").on("hide.bs.modal", function () {
   console.log("cerrar modal");
});
*/

function limpiarFomularioConsultar(){
    console.log("limpaiarrrrr");
    document.getElementById("divMensajeBusqueda").innerHTML = "";
    if( $("#chkDni").prop('checked') ) {
        $("#nuDni").val("");
        console.log("dni ckek");
    }else{
        $("#apPrimer").val("");
        $("#apSegundo").val("");
        $("#prenomInscrito").val("");
        $("#deDireccion").val("");
        console.log("datos personales");
    }
     
}
function  pintarDatosPersonales(){
    $("#divDni").hide();
    $("#divDatosPersonales").show();
}
    
function resetearFormularioConsultar(){
    $('#formPadron')[0].reset();
}




