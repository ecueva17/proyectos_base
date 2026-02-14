<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <c:set var="ctx" value="${pageContext.request.contextPath}" scope="request" />

        <link href="<c:url value="/resources/css/bootstrap.min.css" />" rel="stylesheet">
        <link href="<c:url value="/resources/css/bootstrap-multiselect.css" />" rel="stylesheet">
        <link href="<c:url value="/resources/css/jquery.fancybox-1.3.4.css" />" rel="stylesheet"  />

        <script src="<c:url value="/resources/js/jquery.1.10.2.min.js"/>"></script>        
        <script src="<c:url value="/resources/js/bootstrap.min.js"/>"></script>
        <script src="<c:url value="/resources/js/bootstrap-multiselect.js"/>"></script>
        <script src="<c:url value="/resources/js/utiles.js"/>"></script>

        <title>Padron Electoral</title>
        <link href="<c:url value="/resources/css/index.css" />" rel="stylesheet">
    </head>
    <body>
        <div class="container sombra paginas">

            <div id="fancybox-bg-n" class="fancybox-bg"></div>
            <div id="fancybox-bg-ne" class="fancybox-bg"></div>
            <div id="fancybox-bg-e" class="fancybox-bg"></div>
            <div id="fancybox-bg-se" class="fancybox-bg"></div>
            <div id="fancybox-bg-s" class="fancybox-bg"></div>
            <div id="fancybox-bg-sw" class="fancybox-bg"></div>
            <div id="fancybox-bg-w" class="fancybox-bg"></div>
            <div id="fancybox-bg-nw" class="fancybox-bg"></div>

            <div class="contenedor">
                <div id="cabecera">
                    <div class="row datosCabecera">
                        <div class="col-lg-3 col-md-3 col-xs-3"></div>
                        <div class="col-lg-3 col-md-3 col-xs-3" id="titulo_interno">Padron Electoral RENIEC - MCP</div>
                        <div class="col-lg-2 col-md-2 col-xs-2"><strong>Fecha:</strong><br/>${fechaActual}</div>
                        <div class="col-lg-3 col-md-3 col-xs-3">
                                    <strong>${rol}:&nbsp;</strong><br/>${usuario}
                        </div>
                        <div class="col-lg-1 col-sm-1 col-xs-1">
                            <a href="<c:url value="${pageContext.request.contextPath}/j_spring_security_logout" />" id="main_links">
                                <strong>Salir</strong>
                                <img src="<c:url value="/resources/images/icon_exit.png" />" alt="Salir del Sistema" name="exit" width="40" height="40" align="absmiddle" border="0"/>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="clear"></div>
                <div class="linea"></div>

                <div class="row">                    
                    <div class="menu col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <ul class="nav nav-pills nav-stacked">
                            <c:forEach items="${listaMenu}" var="menu">
                                <li id="${menu.co_padre}_${menu.co_modulo}" role="presentation"
                                    <c:if test="${menu.co_padre == 0}">class="menuPadre"</c:if>
                                    <c:if test="${menu.co_padre != 0}">class="menuHijo"</c:if>                                        
                                    >
                                    <a href="javascript:void(0)" onclick="navegar('${menu.co_padre}_${menu.co_modulo}', '${menu.de_url}', 'contenido', 'GET');">${menu.de_modulo}</a>
                                </li>
                            </c:forEach>
                        </ul>
                    </div>

                    <div class="cuerpo col-lg-9 col-md-9 col-sm-6 col-xs-6">
                        <div class="alert hide" id="mensaje" role="alert"></div>
                        <div id="contenido" name ="contenido"></div>
                    </div>
                </div>

                <div class="clear"></div>
                <div class="pie">
                    <p>Registro Nacional de Identificaci&oacute;n y Estado Civil - 2015 Derechos Reservados.</p>
                </div>
            </div>
        </div>

        <div id="load-panel">
            <img  src="<c:url value="/resources/images/ajax-loader.gif" />" id="image-loading"><br>
            <p id="mensaje-loading">PROCESANDO <span id="avance">...</span></p>
        </div>

        <script type="text/javascript">
            var ctx = "${ctx}";
        </script>

    </body>

</html>
