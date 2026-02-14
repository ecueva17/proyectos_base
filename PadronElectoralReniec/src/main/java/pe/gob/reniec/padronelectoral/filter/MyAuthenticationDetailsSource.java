/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pe.gob.reniec.padronelectoral.filter;

import java.io.Serializable;
import javax.servlet.http.HttpServletRequest;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

/**
 *
 * @author eibanez
 */
public class MyAuthenticationDetailsSource extends WebAuthenticationDetailsSource implements Serializable{

    @Override
    public WebAuthenticationDetails buildDetails(HttpServletRequest context) {
        return new MyAuthenticationDetails(context);
    }

    @SuppressWarnings("serial")
    public class MyAuthenticationDetails extends WebAuthenticationDetails {

        private final String in_logueo;

        public MyAuthenticationDetails(HttpServletRequest request) {
            super(request);
            this.in_logueo = request.getParameter("in_logueo");
        }

        public String getIn_Logueo() {
            return in_logueo;
        }
    }
}
