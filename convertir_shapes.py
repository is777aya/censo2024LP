import geopandas as gpd

# Rutas de entrada (ajústalas según tu estructura)
shp_macros = r"C:/Users/Isra/Documents/DOC_ISRAEL 2025/07_PROYECTO CENSO 2024/MAPAS/10_macroDistrito_2020.shp"
shp_distritos = r"C:/Users/Isra/Documents/DOC_ISRAEL 2025/07_PROYECTO CENSO 2024/MAPAS/11_distritosMunicipales_2021.shp"

# Leer shapefiles
gdf_macros = gpd.read_file(shp_macros)
gdf_distritos = gpd.read_file(shp_distritos)

# Convertir a WGS84 (lat/lon) si es necesario
if gdf_macros.crs and gdf_macros.crs.is_projected:
    print("Macrodistritos: convirtiendo a WGS84...")
    gdf_macros = gdf_macros.to_crs("EPSG:4326")
if gdf_distritos.crs and gdf_distritos.crs.is_projected:
    print("Distritos: convirtiendo a WGS84...")
    gdf_distritos = gdf_distritos.to_crs("EPSG:4326")

# Mostrar nombres de columnas para verificar
print("Columnas macrodistritos:", gdf_macros.columns.tolist())
print("Columnas distritos:", gdf_distritos.columns.tolist())

# Renombrar columna de nombre del macrodistrito a 'macro_ante' (si no existe, usa la primera columna de texto)
macro_name_col = None
for col in gdf_macros.columns:
    if 'macro' in col.lower() or 'nombre' in col.lower() or col.lower() == 'distrito':
        macro_name_col = col
        break
if macro_name_col and macro_name_col != 'macro_ante':
    gdf_macros = gdf_macros.rename(columns={macro_name_col: 'macro_ante'})

distrito_name_col = None
for col in gdf_distritos.columns:
    if 'distrito' in col.lower() or 'nombre' in col.lower():
        distrito_name_col = col
        break
if distrito_name_col and distrito_name_col != 'distrito':
    gdf_distritos = gdf_distritos.rename(columns={distrito_name_col: 'distrito'})

# Guardar como GeoJSON
gdf_macros.to_file("macrodistritos.geojson", driver="GeoJSON")
gdf_distritos.to_file("distritos.geojson", driver="GeoJSON")

print("✅ GeoJSON generados correctamente en la carpeta actual.")