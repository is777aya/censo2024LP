En este proyecto hemos construido un dashboard estratégico completo para el municipio de La Paz, que cumple con los siguientes objetivos:

KPIs precisos y sin duplicación

Demografía (solo Personas), Vivienda (solo Viviendas).

Salud, Educación, Características Económicas y Tenencia de Servicios sumando sus indicadores correspondientes.

Gráficos interactivos y detallados

Distribución por edades (barras, con tooltips que muestran total, hombres y mujeres).

Nivel educativo (dona, con desglose por sexo).

Servicios básicos (agua y energía).

Cobertura de salud (afiliación SUS, Caja de Salud, Seguro Privado, ninguno).

Explorador de variables (compara cualquier indicador a nivel de macrodistrito o distrito).

Mapa interactivo

Fondo satelital (ESRI).

Límites de macrodistritos y distritos a partir de shapefiles oficiales.

Etiquetas permanentes sobre cada distrito para fácil identificación.

Sincronización bidireccional: los filtros del panel lateral centran y resaltan el mapa, y hacer clic en un distrito actualiza los filtros y los gráficos.

Datos robustos y actualizables

Conversión automática del Excel original a formato vertical (Parquet y JSON).

Generación de dashboard_data.js con un script Python que evita duplicaciones y mantiene la integridad de los totales.
