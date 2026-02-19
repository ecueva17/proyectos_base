select * from (
  select a.*, ROWNUM rnum from (
    SELECT t.nu_dni, t.gp_votacion, t.de_direccion,
    replace(t.ap_primer,' ','_') ||'_'|| replace(t.ap_segundo,' ','_') ||'_'|| replace(t.prenom_inscrito,' ','_') ap_am_nom,
    t.in_caducidad,
      RTRIM(
        CASE WHEN t.IN_FALLECIDO_SIN_ACTA_DEF = '1' THEN 'A, ' ELSE '' END ||
        CASE WHEN t.IN_DOMICILIO_NO_ACTUAL = '1' THEN 'B, ' ELSE '' END ||
        CASE WHEN t.IN_MAYOR_CON_FOTO_MENOR = '1' THEN 'C, ' ELSE '' END ||
        CASE WHEN t.IN_MAYOR_CIEN_ANIO = '1' THEN 'D, ' ELSE '' END ||
        CASE WHEN t.IN_CUMPLE_MAYOR_EDAD = '1' THEN 'E, ' ELSE '' END
      , ', ') AS de_anotacion,
    t.IN_CUMPLE_MAYOR_EDAD AS in_mayor_edad
    FROM IDOLPI.CGTM_ANI_LPI_G t
    where t.co_departamento_domicilio ='01'
    and t.co_provincia_domicilio='02'
    and t.co_distrito_domicilio='02'
    and t.co_proceso_electoral='P1502'
    and  t.co_restri = ' '
    ORDER BY t.ap_primer, t.ap_segundo, t.prenom_inscrito, t.nu_dni ASC
  ) a where ROWNUM <= 5
) where rnum > 2