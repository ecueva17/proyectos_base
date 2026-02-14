/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package pe.gob.reniec.padronelectoral.controllers;

import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author ydelatorre
 */
@Controller
public class AutorizacionController {
    static Logger logger = LogManager.getLogger(AutorizacionController.class.getName());
    
    @RequestMapping(value = {"/login"}, method = RequestMethod.GET)
    public String login(ModelMap model) {
        return "login";
    }
 
    @RequestMapping(value = "/accessdenied", method = RequestMethod.GET)
    public String loginerror(ModelMap model) {
        model.addAttribute("error", "true");
        model.addAttribute("mensaje", "Usuario y/o Password ingresados son incorrectos");
        return "login";
    }
 
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(ModelMap model, HttpServletRequest request) {
        request.getSession().removeAttribute("coubigeoactual");
        request.getSession().removeAttribute("noubigeoactual");
        
        return "login";
    }
}
