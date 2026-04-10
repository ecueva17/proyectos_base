package com.tuempresa.config;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger; // O la librería de logs que uses

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = Logger.getLogger(GlobalExceptionHandler.class);

    // 1. Manejo de excepciones genéricas (Error 500)
    @ExceptionHandler(Exception.class)
    public ModelAndView handleAllExceptions(HttpServletRequest request, Exception ex) {
        // Logueamos el error real para el desarrollador (en el servidor)
        logger.error("Excepción detectada en: " + request.getRequestURL(), ex);

        ModelAndView model = new ModelAndView();
        model.setViewName("error/generic_error"); // Nombre de tu JSP: error/generic_error.jsp
        model.addObject("message", "Se ha producido un error interno. Por favor, intente más tarde.");
        
        // IMPORTANTE: No pasar 'ex.getMessage()' ni el stack trace al modelo
        return model;
    }

    // 2. Manejo de excepciones específicas (Ejemplo: Errores de BD)
    @ExceptionHandler(java.sql.SQLException.class)
    public ModelAndView handleDatabaseError(HttpServletRequest request, Exception ex) {
        logger.error("Error de base de datos en: " + request.getRequestURL(), ex);
        
        ModelAndView model = new ModelAndView("error/db_error");
        model.addObject("message", "Error de comunicación con la base de datos.");
        return model;
    }
}
