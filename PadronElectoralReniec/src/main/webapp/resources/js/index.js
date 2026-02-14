var clave_ok = false;
var codCont = 92;
var codPais = 33;
var codDep = -1;
var codPro = -1;
var codDis = -1;
var codMCP = -1;

//**************************** GENERAR PADRON *****************************

function mostrarResultadosUbigeos(ejecutarDespues) {
    $("#tablaResultadoUbigeos").load(ctx + "/mostrarResultadoUbigeo", ejecutarDespues);
}
function mostrarResultadosGeneracion() {
   $("#tablaResultadoGeneracion").load(ctx + "/mostrarResultadoGeneracion");
}

function inicializarGenerarPadron() {

    $("#cargaform").submit(function() {
        if (document.cargaform.archivo.value === "") {
            mostrarMensaje("mensaje", 'danger', 'Debe seleccionar un archivo');
        } else {
            $("#cargaform").ajaxSubmit({
                success: function(data) {
                    if (/j_spring_security_check/i.test(data)){
                        mostrarMensaje("mensaje", 'danger', 'Sesi&oacute;n expirada. Vuelva a ingresar.');
                        return;
                    }
                    limpiarGeneracion();
                    mostrarMensaje("mensaje", data.ti_respuesta, data.de_mensaje);    
                    if(data.ti_respuesta === "success"){
                        $("#btnGenerarReporte").prop("disabled", false);
                        mostrarResultadosUbigeos(function() {
                            if ($("#in_generados_antes").val()==="true") {
                                $("#caja_justificacion").show();
                            }
                        });
                    }
                }
            });
        }
        return false;

    });
    $("#caja_justificacion").hide();
    $("#de_justificacion").keyup(function(e) {
        var unicode=e.keyCode? e.keyCode : e.charCode;
        if(!esTeclaEspecial(unicode)){
            var $th = $(this);
            $th.val($th.val().replace(/[^a-zA-ZÑñ0-9 \n.]/g, function(str) {
                return '';
            }));
        }
    });
}

var mantenerSesion;
function generarPadron() {
    mantenerSesion = true;
    if($("#in_generados_antes").val()==="true" && $("#de_justificacion").val().length < 5){
        $("#validacionJustificacion").html('Debe ingresar una justificación. (Mín: 5 , Máx: 250 car&aacute;cteres)');
        return;
    }
    $("#validacionJustificacion").html("");
   
    var params = {
        de_justificacion: $("#de_justificacion").val(),
        in_imagenes: true//$("#in_imagenes").prop("checked")
    };
    $.ajax({
        type: "GET",
        url: ctx + "/accionGenerarPadron",
        data: params,
        cache: false,
        beforeSend: function (){
            $("#avance").html('UBIGEOS ...');
        },
        success: function (data) {
            $("#avance").html('');
            mantenerSesion = false;
            $("#btnGenerarReporte").prop("disabled", true);
            if (data.ti_respuesta !== "danger") {
                mostrarMensaje("mensaje", data.ti_respuesta, data.de_mensaje);
                mostrarResultadosGeneracion();
            } else {
                mostrarMensaje("mensaje", data.ti_respuesta, data.de_mensaje);
            }
        },
        error: function (e) {
            mantenerSesion = false;
            mostrarMensaje("mensaje", 'danger', 'Ocurrió un error inesperado, vuelva a intentarlo.');
        }
    });
    timeout();
}

function timeout() {
    setTimeout(function () {
        if(mantenerSesion){
            $.ajax({
                type: "GET",
                url: ctx + "/mantenerSesion",
                success: function (data) {
                    $("#avance").html(data);
                },
                error: function () {
                    console.log("Error al mantener session");
                }
            });
            timeout();
        }
    }, 60000);//300000
}

function limpiarGeneracion(){
    $("#mensaje").addClass("hide");
    $("#tablaResultadoUbigeos").html("");
    $("#de_justificacion").val("");
    $("#caja_justificacion").hide();
    $("#tablaResultadoGeneracion").html("");
    $("#btnGenerarReporte").prop("disabled", true);
}

//**************************** DESCARGAR PADRON *****************************
function inicializarDescargarPadron() {
    cargarDepartamentos();
    inicializarProvincia();
    inicializarDistritos();
    inicializarMCP();
}

function inicializarMCP() {
    $('#co_mcp').multiselect({
        nonSelectedText: 'SELECCIONE MCP',
        onChange: function (option, checked, select) {
            var selected = [];
            $('#co_mcp option:selected').each(function () {
                selected.push($(this).val());
            });
        },
        buttonClass: 'form-control input-sm',
        buttonWidth: '100%',
        //enableFiltering: true,
        align: 'left',
        disableIfEmpty: true,
        includeSelectAllOption: true,
        selectAllText: 'TODOS',
        maxHeight: 200,
        buttonText: function(options) {
            var retStr = "";
            if (options.length === 0) {
               retStr = "SELECCIONE MCP";
            } else if(options.length <=2){
               var textArray = [];
               $.each(options,function(key,value){
                   textArray.push($.trim($(value).html()));
               });
               retStr = textArray.join(", ");
               retStr = retStr.substring(0, 30);
            } else {
               retStr = options.length+" SELECCIONADOS";
            }
            return retStr+" <b class='caret'></b>";
        }
    });
}

function inicializarDistritos() {
    var $select = $('#co_distrito');
    $select.find('option').remove();
    $('<option>').val("1000").text("SELECCIONE DISTRITO").appendTo($select);
}

function inicializarProvincia() {
    var $select = $('#co_provincia');
    $select.find('option').remove();
    $('<option>').val("1000").text("SELECCIONE PROVINCIA").appendTo($select);
}

function cargarDepartamentos() {

    $.ajax({
        type: "GET",
        url: ctx + "/obtenerDepartamentosGenerados",
        data: "codCont=" + codCont + "&codPais=" + codPais,
        async: false,
        cache: false,
        dataType: 'json',
        timeout: 30000,
        success: function (data) {
            var $select = $('#co_departamento');
            $select.find('option').remove();
            $('<option>').val("").text("SELECCIONE DEPARTAMENTO").appendTo($select);
            $.each(data, function (index, item) {
                $('<option>').val(item.co_departamento).text(item.no_departamento).appendTo($select);
            });
        },
        error: function (e) {
        }
    });
    inicializarProvincia();
}

function cargarProvincias(val) {
    $("#btnOpciones button b").text("");
    //mostrarDivClaveArchivo(false);
    if (val !== "") {
        codDep = val;

        $.ajax({
            type: "GET",
            url: ctx + "/obtenerProvinciasGeneradas",
            data: "codCont=" + codCont + "&codPais=" + codPais + "&codDep=" + codDep,
            async: false,
            cache: false,
            dataType: 'json',
            timeout: 30000,
            success: function (data) {
                inicializarProvincia();
                var $select = $('#co_provincia');
                $.each(data, function (index, item) {
                    $('<option>').val(item.co_provincia).text(item.no_provincia).appendTo($select);
                });
                inicializarDistritos();
                reiniciarMCP();
                codPro = 1000;
            },
            error: function (e) {
                mostrarMensaje("mensaje", 'danger', 'Ocurrió un error inesperado, vuelva a intentarlo.');
                document.location.href = 'PadronElectoralReniec';
            }
        });
    } else {
        inicializarProvincia();
        inicializarDistritos();
        reiniciarMCP();
    }

    $("#co_provincia").focus();
    
}

function reiniciarMCP() {
    $("#co_mcp").html("");
    $("#co_mcp").multiselect('rebuild');
    $('#co_mcp').multiselect('disable');
}

function cargarDistritos(val) {
    $("#btnOpciones button b").text("");
    //mostrarDivClaveArchivo(false);
    if (val !== "") {
        if (val === '1000') {
            inicializarDistritos();
            reiniciarMCP();
        } else {
            codPro = val;
            $.ajax({
                type: "GET",
                url: ctx + "/obtenerDistritosGenerados",
                data: "codCont=" + codCont + "&codPais=" + codPais + "&codDep=" + codDep + "&codPro=" + val,
                async: false,
                cache: false,
                dataType: 'json',
                timeout: 30000,
                success: function (data) {
                    var $select = $('#co_distrito');
                    $.each(data, function (index, item) {
                        $('<option>').val(item.co_distrito).text(item.no_distrito).appendTo($select);
                    });
                },
                error: function (e) {
                    mostrarMensaje("mensaje", 'danger', 'Ocurrió un error inesperado, vuelva a intentarlo.');
                    document.location.href = 'PadronElectoralReniec';
                }
            });
        }
        $("#co_distrito").focus();
    }
}

function cargarMCP(val) {
    $("#btnOpciones button b").text("");
    //mostrarDivClaveArchivo(false);
    if (val !== "") {
        if (val === '1000') {
            reiniciarMCP()();
        } else {
            codDis = val;
            $.ajax({
                type: "GET",
                url: ctx + "/obtenerMCPGenerados",
                data: "codCont=" + codCont + "&codPais=" + codPais + "&codDep=" + codDep + "&codPro=" + codPro + "&codDis=" + val,
                async: false,
                cache: false,
                dataType: 'json',
                timeout: 30000,
                success: function (data) {
                    var $select = $('#co_mcp');
                    $select.find('option').remove();
                    $.each(data, function (index, item) {
                        $('<option>').val(item.co_mcp).text(item.no_mcp).appendTo($select);
                    });

                    $("#co_mcp").multiselect('rebuild');
                    $('#co_mcp').multiselect('enable');
                },
                error: function (e) {
                    mostrarMensaje("mensaje", 'danger', 'Ocurrió un error inesperado, vuelva a intentarlo.');
                    document.location.href = 'PadronElectoralReniec';
                }
            });
        }
        $("#co_mcp").focus();
    }
}


function obtenerNombreDistritos(distritos) {

    var distArray = distritos.split(',');
    var lista = '';
    for (i = 0; i < distArray.length; i++) {
        lista = lista + distArray[i] + ' - ' + $("#co_distrito option[value='" + distArray[i] + "']").text() + ', ';
    }
    lista = lista.substr(0, (lista.length - 2));
    return lista;
}


function verificarDescargaArchivo()
{
    $("#mensaje").addClass("hide");

    codMCP = $("#co_mcp").val();

    if (codMCP === null) {
        mostrarMensaje("mensaje", "danger", "Debe seleccionar al menos una Municipalidad de Centro Poblado (MCP)");
        return;
    }

    $.ajax({
        type: "GET",
        url: ctx + "/verificarDescargaArchivo",
        data: {
            co_departamento: codDep,
            co_provincia: codPro,
            co_distrito: codDis,
            co_mcp: codMCP,
            in_imagenes: true//$("#in_imagenes").prop("checked")
        },
        cache: false,
        success: function (data) {
            if (data.ti_respuesta === 'success')
            {
                mostrarDivClaveArchivo($('#btnMostrarClaveArchivo'), true);
                $("#formDescargarReporte").submit();
            } else {
                if (data.de_contenido !== "") {
                    var arrayDist = data.de_contenido.split("-");

                    if (arrayDist[1] === "") {
                        mostrarMensaje("mensaje", data.ti_respuesta, "Los siguientes distritos no han sido generados: " + obtenerNombreDistritos(arrayDist[0]) + ".");

                    } else {
                        $("#co_distrito").val(arrayDist[1].split(','));
                        $("#co_distrito").multiselect("refresh");
                        mostrarMensaje("mensaje", data.ti_respuesta, "Los siguientes distritos no han sido generados: " + obtenerNombreDistritos(arrayDist[0]) + ".");

                        $("#formDescargarReporte").submit();
                    }

                } else {
                    mostrarMensaje("mensaje", data.ti_respuesta, data.de_mensaje);
                }
            }
        },
        error: function (e) {
            mostrarMensaje("mensaje", 'danger', 'Ocurrió un error inesperado, vuelva a intentarlo.');
        }
    });
}

function habilitarBoton() {
    $("#btnDescargarReporte").prop("disabled", false);
}

function obtenerClaveArchivo(){
    $.ajax({
        type: "POST",
        url: ctx + "/obtenerClaveArchivoGenerado",
        data: "codCont=" + codCont + "&codPais=" + codPais + "&codDep=" + codDep + "&codPro=" + codPro + "&codDis=" + codDis + "&codMcp=" + codMCP,
        async: false,
        cache: false,
        dataType: 'json',
        timeout: 30000,
        success: function (data) {
            mostrarDivClaveArchivo($('#divMostrarClaveArchivo'), true);
            $('#miclavearchivodescargado').text(data.clave);
        },
        error: function (e) {
            mostrarMensaje("mensaje", 'danger', 'Ocurrió un error inesperado, vuelva a intentarlo.');
            document.location.href = 'PadronElectoralReniec';
        }
    });  
}

function mostrarDivClaveArchivo($element, mostrar){
    let $divMostrarClaveArchivo = $element;
    mostrar?$divMostrarClaveArchivo.show():$divMostrarClaveArchivo.hide();
}

//**************************** CAMBIAR CLAVE *****************************
function verificarNuevaClave(val) {
    if (parseInt(val.length) > 5) {
        if ($("#clave").val() === val) {
            mostrarMensaje("mensaje", "warning", "Claves iguales" + "<br>" + " La nueva clave no puede ser igual a la anterior.");
            $("#nuevaClave1").val('');
            $("#nuevaClave2").val('');
            $("#nuevaClave2").prop("disabled", true);
            $("#btnAcceder").prop("disabled", true);
        } else {
            $("#mensaje").addClass('hide');
            $("#nuevaClave2").prop("disabled", false);
        }

        if ($("#nuevaClave2").val() !== '') {
            if ($("#nuevaClave2").val() !== val) {
                mostrarMensaje("mensaje", "warning", "Diferentes claves" + "<br>" + " Ambas claves no coinciden.");
                $("#nuevaClave1").val('');
                $("#nuevaClave2").val('');
                $("#btnAcceder").prop("disabled", true);
            } else {
                $("#mensaje").addClass('hide');
                $("#btnAcceder").prop("disabled", false);
            }
        }
    } else {
        mostrarMensaje("mensaje", "warning", "Clave muy pequeña" + "<br>" + " La clave debe contener como mínimo 6 caracteres.");
        $("#nuevaClave2").val('');
        $("#nuevaClave2").prop("disabled", true);
    }
}

function verificarClave(val) {

    if ($("#nuevaClave1").val() === val) {
        $("#mensaje").addClass('hide');
        $("#btnAcceder").prop("disabled", false);
    } else {
        mostrarMensaje("mensaje", "warning", "Diferentes claves" + "<br>" + " Ambas claves no coinciden.");
        $("#nuevaClave1").val('');
        $("#nuevaClave2").val('');
        $("#btnAcceder").prop("disabled", true);
    }
}


function cambiarClave() {

    verificarClaveActual($("#clave").val());

    $.ajax({
        type: "POST",
        url: ctx + "/accionCambiarClave",
        data: "de_clave=" + $("#nuevaClave1").val(),
        cache: false,
        success: function(data) {
            mostrarMensaje("mensaje", data.ti_respuesta, data.de_mensaje);
            $("#clave").val('');
            limpiarCampos();
        },
        error: function(e) {
            mostrarMensaje("mensaje", 'danger', 'Ocurrió un error inesperado, vuelva a intentarlo.');
        }
    });
}

function verificarClaveActual(val) {

    $.ajax({
        type: "POST",
        url: ctx + "/verificarClave",
        data: "de_clave=" + val,
        cache: false,
        success: function(data) {
            if (data.ti_respuesta === 'success') {
                $("#mensaje").addClass('hide');
                $("#nuevaClave1").prop("disabled", false);
                clave_ok = true;
            } else {
                mostrarMensaje("mensaje", data.ti_respuesta, data.de_mensaje);
                limpiarCampos();
                clave_ok = false;
            }
        },
        error: function (e) {
            mostrarMensaje("mensaje", 'danger', 'Ocurrió un error inesperado, vuelva a intentarlo.');
        }
    });
}

function limpiarCampos() {
    $("#nuevaClave1").val('');
    $("#nuevaClave1").prop("disabled", true);
    $("#nuevaClave2").val('');
    $("#nuevaClave2").prop("disabled", true);
    $("#btnAcceder").prop("disabled", true);
}