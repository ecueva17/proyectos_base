/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pe.gob.reniec.padronelectoral.service;

import java.util.ArrayList;
import java.util.List;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import pe.gob.reniec.padronelectoral.dao.UsuarioDao;
import pe.gob.reniec.padronelectoral.entity.Usuario;

/**
 *
 * @author Hadassa
 */
@Service
public class UsuarioService implements AuthenticationProvider {

    static Logger logger = LogManager.getLogger(UsuarioService.class.getName());

    @Autowired
    UsuarioDao usuarioDao;

    public void setUsuarioDao(UsuarioDao usuarioDao) {
        this.usuarioDao = usuarioDao;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        
        UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) authentication;
        UsernamePasswordAuthenticationToken result = null;
        
        String username = (String) auth.getPrincipal();
        Md5PasswordEncoder encoder = new Md5PasswordEncoder();
        String clave = encoder.encodePassword((String) auth.getCredentials(), "");
        
        try {
            Usuario usuario = usuarioDao.consultarUsuario(username);

            if (usuario != null) {
                List<GrantedAuthority> authList = new ArrayList<GrantedAuthority>();
                authList.add(new SimpleGrantedAuthority("ROLE_USER"));
                if (usuario.getDe_password().equalsIgnoreCase(clave)) {
                    result = new UsernamePasswordAuthenticationToken(username, clave, authList);
                }
            } else {
                logger.error("Sistema: El usuario " + username + " no se encuentra registrado.");
            }

        } catch (Exception e) {
            logger.error("Sistema: ", e);
        }

        return result;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
    
    public Usuario consultarUsuario(String nu_dni) {

        Usuario result = null;

        try {
            result = usuarioDao.consultarUsuario(nu_dni);
        } catch (Exception e) {
            logger.error("Sistema: ", e);
        }
        return result;

    }

    public boolean actualizarPassword(String nu_dni, String de_password) {

        boolean correcto = false;
        Usuario usuario = new Usuario(nu_dni, de_password);
        try {
            usuarioDao.actualizarPassword(usuario);
            correcto = true;
        } catch (Exception e) {
            logger.error("Sistema: ", e);
        }
        return correcto;
    }
    
    public void actualizarIndicadorProcesando(String nu_dni, String in_procesando) throws Exception{
        usuarioDao.actualizarIndicadorProcesando(nu_dni, in_procesando);
    }
    public String obtenerIndicadorProcesando(String nu_dni) throws Exception{
        return usuarioDao.obtenerIndicadorProcesando(nu_dni);
    }

}
