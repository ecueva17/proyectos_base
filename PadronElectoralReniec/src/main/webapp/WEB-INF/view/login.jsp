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
        <div class="container sombraLogin">
            <div id="fancybox-bg-n" class="fancybox-bg"></div>
            <div id="fancybox-bg-ne" class="fancybox-bg"></div>
            <div id="fancybox-bg-e" class="fancybox-bg"></div>
            <div id="fancybox-bg-se" class="fancybox-bg"></div>
            <div id="fancybox-bg-s" class="fancybox-bg"></div>
            <div id="fancybox-bg-sw" class="fancybox-bg"></div>
            <div id="fancybox-bg-w" class="fancybox-bg"></div>
            <div id="fancybox-bg-nw" class="fancybox-bg"></div>

            <div class="panel panel-primary">
                <div class="panel-heading">
                    <span class="glyphicon glyphicon-user panel-title tituloLogin" aria-hidden="true"></span>
                    <span class="panel-title tituloLogin">Acceso al Sistema</span>
                </div>
                <div class="panel-body">
                    <form name="frmLogin" action="<c:url value='j_spring_security_check' />" method="POST" id="frmLogin">
                        <div class="row">
                            <label class="col-lg-4 col-sm-4">Usuario:</label>
                            <div class="col-lg-8 col-sm-8">
                                <input type="text" maxlength="8" id = "usuario" name="j_username" tabindex="1" onkeypress="return soloNumero(event)"/>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-lg-4 col-sm-4">Clave:</label>
                            <div class="col-lg-8 col-sm-8">
                                <input type="password" maxlength="15" id = "clave" name="j_password" tabindex="2" autocomplete="off"/>
                            </div>
                        </div>
                        <div class="pieLogin" style="text-align: right;" >
                            <input id="btnAcceder" type="submit" value="Acceder" class="btn btn-primary"/>
                        </div>
                        <div class="alert alert-danger hide" id="mensaje1" role="alert" ></div>
                        <c:if test="${not empty mensaje}">
                            <div class="alert alert-danger" id="mensaje" role="alert">${mensaje}</div>
                        </c:if>
                    </form>
                </div>
            </div>
        </div>
    </body>
</html>
