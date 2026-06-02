import pandas as pd
import json
import os
import sys

# ============================================================
# CONFIGURACIÓN
# ============================================================
CSV_FILE = r'C:\Users\Isra\Documents\DOC_ISRAEL 2025\07_PROYECTO CENSO 2024\MAPAS\14_mnz_indicadores_Distrito_Vertical.csv'
JS_FILE = r'C:\Users\Isra\Documents\DOC_ISRAEL 2025\07_PROYECTO CENSO 2024\MAPAS\dashboard_2\dashboard_data.js'

# ============================================================
# MAPEO DE INDICADORES (igual)
# ============================================================
mapeo = {
    'Personas': 'Demografía',
    'Viviendas': 'Vivienda',
    'salud centro publico hombre': 'Salud',
    'salud caja de salud hombre': 'Salud',
    'salud centro privado hombre': 'Salud',
    'salud atencion domicilio hombre': 'Salud',
    'salud medicina tradicional hombre': 'Salud',
    'salud farmacia sin receta hombre': 'Salud',
    'salud remedios caseros hombre': 'Salud',
    'salud centro publico mujer': 'Salud',
    'salud caja de salud mujer': 'Salud',
    'salud centro privado mujer': 'Salud',
    'salud atencion domicilio mujer': 'Salud',
    'salud medicina tradicional mujer': 'Salud',
    'salud farmacia sin receta mujer': 'Salud',
    'salud remedios caseros mujer': 'Salud',
    'salud afiliacion sus hombre': 'Salud',
    'salud afiliacion caja de salud hombre': 'Salud',
    'salud afiliacion seguro privado hombre': 'Salud',
    'salud afiliacion ninguno hombre': 'Salud',
    'salud afiliacion sin especificar hombre': 'Salud',
    'salud afiliacion sus mujer': 'Salud',
    'salud afiliacion caja de salud mujer': 'Salud',
    'salud afiliacion seguro privado mujer': 'Salud',
    'salud afiliacion ninguno mujer': 'Salud',
    'salud afiliacion sin especificar mujer': 'Salud',
    'educacion ninguno hombre': 'Educación',
    'educacion primaria hombre': 'Educación',
    'educacion secundaria hombre': 'Educación',
    'educacion superior hombre': 'Educación',
    'educacion sinespecificar hombre': 'Educación',
    'educacion ninguno mujer': 'Educación',
    'educacion primaria mujer': 'Educación',
    'educacion secundaria mujer': 'Educación',
    'educacion superior mujer': 'Educación',
    'educacion sin especificar mujer': 'Educación',
    'ocupacion empleado hombre': 'Características Económicas',
    'ocupacion cuenta propia hombre': 'Características Económicas',
    'ocupacion otros hombre': 'Características Económicas',
    'ocupacion sin especificar hombre': 'Características Económicas',
    'ocupacion empleado mujer': 'Características Económicas',
    'ocupacion cuenta propia mujer': 'Características Económicas',
    'ocupacion otros mujer': 'Características Económicas',
    'ocupacion sin especificar mujer': 'Características Económicas',
    'actividad agricultura hombre': 'Características Económicas',
    'actividad comercio hombre': 'Características Económicas',
    'actividad manufactura hombre': 'Características Económicas',
    'actividad construccion hombre': 'Características Económicas',
    'actividad transporte hombre': 'Características Económicas',
    'actividad alojamiento y comida hombre': 'Características Económicas',
    'actividad enseñanza hombre': 'Características Económicas',
    'actividad salud y asistencia hombre': 'Características Económicas',
    'actividad otras hombre': 'Características Económicas',
    'actividad sin especificar hombre': 'Características Económicas',
    'actividad agricultura mujer': 'Características Económicas',
    'actividad comercio mujer': 'Características Económicas',
    'actividad manufactura mujer': 'Características Económicas',
    'actividad construccion mujer': 'Características Económicas',
    'actividad transporte mujer': 'Características Económicas',
    'actividad alojamiento y comida mujer': 'Características Económicas',
    'actividad enseñanza mujer': 'Características Económicas',
    'actividad salud y asistencia mujer': 'Características Económicas',
    'actividad otras mujer': 'Características Económicas',
    'actividad sin especificar mujer': 'Características Económicas',
    'energia electrica servicio publico': 'Tenencia de Servicios',
    'energia electrica motor propio': 'Tenencia de Servicios',
    'energia electrica panel solar': 'Tenencia de Servicios',
    'energia electrica otra': 'Tenencia de Servicios',
    'energia electrica notiene': 'Tenencia de Servicios',
    'agua cañería': 'Tenencia de Servicios',
    'agua pileta pública': 'Tenencia de Servicios',
    'agua carro repartidor': 'Tenencia de Servicios',
    'agua pozo conbomba': 'Tenencia de Servicios',
    'agua pozo sin bomba': 'Tenencia de Servicios',
    'agua vertiente no protegida': 'Tenencia de Servicios',
    'agua vertiente protegida': 'Tenencia de Servicios',
    'agua cosecha de lluvia': 'Tenencia de Servicios',
    'agua otra': 'Tenencia de Servicios',
    'desague alcantarillado': 'Tenencia de Servicios',
    'desague camara séptica': 'Tenencia de Servicios',
    'desague pozo ciego': 'Tenencia de Servicios',
    'desague superficie': 'Tenencia de Servicios',
    'desague pozo de absorción': 'Tenencia de Servicios',
    'desague baño ecológico': 'Tenencia de Servicios',
    'desague no tiene': 'Tenencia de Servicios',
    'combustible gas garrafa': 'Tenencia de Servicios',
    'combustible gas cañería': 'Tenencia de Servicios',
    'combustible leña': 'Tenencia de Servicios',
    'combustible guano': 'Tenencia de Servicios',
    'combustible electricidad': 'Tenencia de Servicios',
    'combustible energía solar': 'Tenencia de Servicios',
    'combustible otro': 'Tenencia de Servicios',
    'combustible no cocina': 'Tenencia de Servicios',
    'basura basurero público': 'Tenencia de Servicios',
    'basura carro basurero': 'Tenencia de Servicios',
    'basura calle': 'Tenencia de Servicios',
    'basura río': 'Tenencia de Servicios',
    'basura quema': 'Tenencia de Servicios',
    'basura entierra': 'Tenencia de Servicios',
    'basura otro': 'Tenencia de Servicios',
    'tics radio': 'Tenencia de Servicios',
    'tics televisor': 'Tenencia de Servicios',
    'tics celular': 'Tenencia de Servicios',
    'tics internet': 'Tenencia de Servicios',
}

# ============================================================
# FUNCIÓN PARA DETECTAR COLUMNAS FIJAS
# ============================================================
def detectar_columnas_fijas(df):
    posibles_fijas = ['municipio', 'codigo', 'tipo', 'macro_ante', 'distrito', 'cod_macro']
    fijas = []
    for col in df.columns:
        if any(p in col.lower() for p in posibles_fijas):
            fijas.append(col)
    # Si no se detectaron, tomar las primeras 6 columnas (asumiendo orden)
    if len(fijas) == 0:
        fijas = list(df.columns[:6])
    return fijas

# ============================================================
# LECTURA DEL CSV CON SEPARADOR TABULACIÓN
# ============================================================
print("📂 Leyendo archivo CSV (separador tabulación)...")
if not os.path.exists(CSV_FILE):
    print(f"❌ El archivo {CSV_FILE} no existe.")
    sys.exit(1)

# Intentar primero con tabulador, luego con punto y coma, luego con coma
separadores = ['\t', ';', ',']
df = None
sep_usado = None
for sep in separadores:
    try:
        df = pd.read_csv(CSV_FILE, encoding='utf-8', sep=sep, low_memory=False)
        if len(df.columns) > 1:
            sep_usado = sep
            print(f"✅ Leído correctamente con separador: '{sep}'")
            break
    except:
        continue

if df is None:
    print("❌ No se pudo leer el CSV con ningún separador.")
    sys.exit(1)

# Mostrar primeras filas y columnas
print(f"\n📋 Primeras 3 filas del CSV:")
print(df.head(3))
print(f"\n📋 Columnas encontradas ({len(df.columns)}):")
for i, col in enumerate(df.columns):
    print(f"   {i+1}. '{col}'")

# Detectar columnas fijas
COLUMNAS_FIJAS = detectar_columnas_fijas(df)
print(f"\n🔍 Columnas fijas identificadas: {COLUMNAS_FIJAS}")

# El resto son indicadores
col_indicadores = [c for c in df.columns if c not in COLUMNAS_FIJAS]
print(f"📊 Indicadores detectados: {len(col_indicadores)}")

# Convertir indicadores a numérico
for col in col_indicadores:
    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

# ============================================================
# MELT (HORIZONTAL → VERTICAL)
# ============================================================
print("\n🔄 Convirtiendo a formato vertical...")
df_long = pd.melt(df, id_vars=COLUMNAS_FIJAS, value_vars=col_indicadores,
                  var_name='Indicador', value_name='Valor')
df_long['Indicador'] = df_long['Indicador'].str.replace('_', ' ', regex=False).str.strip()
df_long = df_long[df_long['Valor'] != 0]

# ============================================================
# ASIGNAR GRUPOS
# ============================================================
print("🏷️ Asignando grupos...")
df_long['Grupo'] = df_long['Indicador'].map(mapeo).fillna('Otros')

grupos_kpi = ['Demografía', 'Vivienda', 'Salud', 'Educación', 
              'Características Económicas', 'Tenencia de Servicios']
df_kpi = df_long[df_long['Grupo'].isin(grupos_kpi)]

# Resumen general
resumen_grupos = df_kpi.groupby('Grupo')['Valor'].sum().to_dict()

# Columnas para macro y distrito
macro_col = None
distrito_col = None
for col in COLUMNAS_FIJAS:
    if 'macro_ante' in col.lower():
        macro_col = col
    if 'distrito' in col.lower():
        distrito_col = col

if macro_col is None:
    macro_col = COLUMNAS_FIJAS[4] if len(COLUMNAS_FIJAS) > 4 else COLUMNAS_FIJAS[0]
if distrito_col is None:
    distrito_col = COLUMNAS_FIJAS[5] if len(COLUMNAS_FIJAS) > 5 else COLUMNAS_FIJAS[1]

print(f"Usando macro_col='{macro_col}', distrito_col='{distrito_col}'")

# Por macrodistrito
macro_kpi = df_kpi.groupby([macro_col, 'Grupo'])['Valor'].sum().unstack(fill_value=0).reset_index()
distrito_kpi = df_kpi.groupby([macro_col, distrito_col, 'Grupo'])['Valor'].sum().unstack(fill_value=0).reset_index()

macro_detalle = df_long.groupby([macro_col, 'Indicador'])['Valor'].sum().unstack(fill_value=0).reset_index()
distrito_detalle = df_long.groupby([macro_col, distrito_col, 'Indicador'])['Valor'].sum().unstack(fill_value=0).reset_index()
resumen_indicadores = df_long.groupby('Indicador')['Valor'].sum().to_dict()

# Combinar
macro_final = []
for _, row in macro_kpi.iterrows():
    macro_name = row[macro_col]
    detalles = macro_detalle[macro_detalle[macro_col] == macro_name].iloc[0].to_dict()
    macro_final.append({**row.to_dict(), **detalles})

distrito_final = []
for _, row in distrito_kpi.iterrows():
    macro_name = row[macro_col]
    dist = row[distrito_col]
    detalles = distrito_detalle[(distrito_detalle[macro_col] == macro_name) & 
                                (distrito_detalle[distrito_col] == dist)].iloc[0].to_dict()
    distrito_final.append({**row.to_dict(), **detalles})

combined_resumen = {**resumen_grupos, **resumen_indicadores}
for g in grupos_kpi:
    if g not in combined_resumen:
        combined_resumen[g] = 0

# ============================================================
# GENERAR dashboard_data.js
# ============================================================
salida = {
    "resumen_general": combined_resumen,
    "macrodistritos": macro_final,
    "distritos": distrito_final
}

with open(JS_FILE, 'w', encoding='utf-8') as f:
    f.write("const dashboardData = " + json.dumps(salida, ensure_ascii=False, separators=(',', ':')) + ";")

print(f"\n✅ {JS_FILE} generado.")
print("\n📊 KPIs calculados (totales generales):")
for g in grupos_kpi:
    print(f"   {g} ............. {resumen_grupos.get(g,0):,.0f}")
print("\n🎉 Proceso completado. Ahora abre index.html.")