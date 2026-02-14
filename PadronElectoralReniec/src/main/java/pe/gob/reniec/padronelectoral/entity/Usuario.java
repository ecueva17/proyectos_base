/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pe.gob.reniec.padronelectoral.entity;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author hcruz
 */
@XmlRootElement
public class Usuario extends Auditoria implements Serializable {

    private String nu_dni;
    private String de_password;
    private String de_correo;
    private String in_procesando;

    public Usuario(String nu_dni, String de_password, String de_correo, String co_usuario) {
        this.nu_dni = nu_dni;
        this.de_password = de_password;
        this.de_correo = de_correo;
        this.es_registro = "1";
        this.us_crea_audi = co_usuario;
        this.us_modi_audi = co_usuario;
    }

    public Usuario(String nu_dni, String de_password) {
        this.nu_dni = nu_dni;
        this.de_password = de_password;
    }

    public Usuario() {
    }

    public String getNu_dni() {
        return nu_dni;
    }

    public void setNu_dni(String nu_dni) {
        this.nu_dni = nu_dni;
    }

    public String getDe_password() {
        return de_password;
    }

    public void setDe_password(String de_password) {
        this.de_password = de_password;
    }

    public String getDe_correo() {
        return de_correo;
    }

    public void setDe_correo(String de_correo) {
        this.de_correo = de_correo;
    }

    public String getIn_procesando() {
        return in_procesando;
    }

    public void setIn_procesando(String in_procesando) {
        this.in_procesando = in_procesando;
    }

}
