/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pe.gob.reniec.padronelectoral.dao;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;
import pe.gob.reniec.padronelectoral.entity.Usuario;
import pe.gob.reniec.padronelectoral.util.NombreDeTablasUtil;

/**
 *
 * @author Hadassa
 */
@Repository
public interface UsuarioDao {

    @Select("SELECT nu_dni, de_password, de_correo  FROM " + NombreDeTablasUtil.Usuario
            + " WHERE nu_dni=#{nu_dni} AND es_registro = '1' ")
    public Usuario consultarUsuario(@Param("nu_dni") String nu_dni) throws Exception;
    
    @Select("UPDATE " + NombreDeTablasUtil.Usuario 
            + " SET de_password = #{usuario.de_password}, "
            + "us_modi_audi = #{usuario.nu_dni},"
            + "fe_modi_audi = SYSDATE "
            + "WHERE nu_dni = #{usuario.nu_dni}")
    public void actualizarPassword(@Param("usuario") Usuario usuario) throws Exception;

    @Update("UPDATE " + NombreDeTablasUtil.Usuario +" SET in_procesando = #{in_procesando}"
            + " WHERE nu_dni=#{nu_dni} AND es_registro = '1' ")
    public void actualizarIndicadorProcesando(@Param("nu_dni") String nu_dni, @Param("in_procesando") String in_procesando) throws Exception;

    @Select("SELECT in_procesando from " + NombreDeTablasUtil.Usuario
            + " WHERE nu_dni=#{nu_dni} AND es_registro = '1' ")
    public String obtenerIndicadorProcesando(@Param("nu_dni") String nu_dni) throws Exception;

}
