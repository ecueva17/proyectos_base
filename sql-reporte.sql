SELECT t.nu_dni, t.gp_votacion, t.de_direccion,
replace(t.ap_primer,' ','_') ||'_'|| replace(t.ap_segundo,' ','_') ||'_'|| replace(t.prenom_inscrito,' ','_') ap_am_nom,
  RTRIM(
    CASE WHEN t.IN_FALLECIDO_SIN_ACTA_DEF = '1' THEN 'A, ' ELSE '' END ||
    CASE WHEN t.IN_DOMICILIO_NO_ACTUAL = '1' THEN 'B, ' ELSE '' END ||
    CASE WHEN t.IN_CUMPLE_MAYOR_EDAD = '1' THEN 'C, ' ELSE '' END
  , ', ') AS de_anotacion,
(select DE_DOM
from getr_dominios
where no_dom = 'CO_DISCAPACIDAD'
AND CO_DOMINIO = t.CO_DISCAPACIDAD) as DE_discapacidad
FROM IDOLPI.CGTM_ANI_LPI_MCP t
where t.CO_DEPARTAMEN_DOMICILIO_RENIEC =$P{CO_DEPARTAMENTO}
and t.CO_PROVINCIA_DOMICILIO_RENIEC=$P{CO_PROVINCIA}
and t.CO_DISTRITO_DOMICILIO_RENIEC=$P{CO_DISTRITO}
and t.CO_MUNI_CENTRO_POBLADO=$P{CO_MUNI_CP}
and t.co_proceso_electoral=$P{CO_PROCESO}
and  t.co_restri = ' '
ORDER BY t.ap_primer, t.ap_segundo, t.prenom_inscrito ASC