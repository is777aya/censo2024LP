// ---------- VARIABLES GLOBALES ----------
let ageChartInstance = null, eduChartInstance = null, servicesChartInstance = null, healthChartInstance = null, explorerChartInstance = null;
let map, macroLayer, distritoLayer;
let currentMacroGeoJSON = null;
let macroNameProperty = null;
let distritoNameProperty = null;

const macroSelect = document.getElementById('macro-select');
const distritoSelect = document.getElementById('distrito-select');
const variableSelect = document.getElementById('variable-select');
const currentLabel = document.getElementById('current-selection-label');
const kpiDem = document.getElementById('kpi-demografia');
const kpiSal = document.getElementById('kpi-salud');
const kpiEdu = document.getElementById('kpi-educacion');
const kpiEco = document.getElementById('kpi-economia');
const kpiViv = document.getElementById('kpi-vivienda');
const kpiSer = document.getElementById('kpi-servicios');

const formatNumber = n => new Intl.NumberFormat('es-BO').format(Math.round(n || 0));

// ---------- INICIALIZACIÓN ----------
function initDashboard() {
    if (typeof dashboardData === 'undefined') return alert("Error: dashboard_data.js no encontrado.");
    populateDropdowns();
    populateVariables();
    updateDashboard('ALL', 'ALL');
    setupEventListeners();
    initMap();
}

function populateDropdowns() {
    if (!dashboardData.macrodistritos?.length) return;
    const first = dashboardData.macrodistritos[0];
    let macroKey = ['macro_ante', 'Macro_Antes', 'macrodistrito', 'Macrodistrito'].find(k => first.hasOwnProperty(k));
    if (!macroKey) macroKey = Object.keys(first)[0];
    const macros = [...new Set(dashboardData.macrodistritos.map(m => m[macroKey]))].filter(Boolean);
    macros.forEach(m => { const opt = document.createElement('option'); opt.value = m; opt.textContent = m; macroSelect.appendChild(opt); });
}

function populateVariables() {
    const allVars = Object.keys(dashboardData.resumen_general);
    const exclude = ['macro_ante', 'Macro_Antes', 'distrito', 'Demografía', 'Vivienda', 'Salud', 'Educación', 'Características Económicas', 'Tenencia de Servicios'];
    allVars.filter(v => !exclude.includes(v)).sort().forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        variableSelect.appendChild(opt);
    });
}

function setupEventListeners() {
    macroSelect.addEventListener('change', e => {
        const macro = e.target.value;
        distritoSelect.innerHTML = '<option value="ALL">Todos los Distritos</option>';
        if (macro !== 'ALL') {
            dashboardData.distritos.filter(d => d.macro_ante === macro).forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.distrito;
                opt.textContent = `Distrito ${d.distrito}`;
                distritoSelect.appendChild(opt);
            });
        }
        updateDashboard(macro, 'ALL');
        highlightMacroOnMap(macro);
    });
    distritoSelect.addEventListener('change', e => {
        const macro = macroSelect.value;
        const distrito = e.target.value;
        updateDashboard(macro, distrito);
        if (distrito !== 'ALL' && distritoLayer) centerOnDistrito(distrito);
    });
    variableSelect.addEventListener('change', () => updateExplorerChart(macroSelect.value, distritoSelect.value));
}

function getSum(data, keys) { return keys.reduce((s,k) => s + (data[k]||0), 0); }

function updateDashboard(macro, distrito) {
    let data, label = 'Visión General: Todos los Macrodistritos';
    if (macro === 'ALL' && distrito === 'ALL') data = dashboardData.resumen_general;
    else if (distrito === 'ALL') { data = dashboardData.macrodistritos.find(m => m.macro_ante === macro); label = `Macrodistrito: ${macro}`; }
    else { data = dashboardData.distritos.find(d => d.macro_ante === macro && d.distrito == distrito); label = `Macrodistrito: ${macro} | Distrito: ${distrito}`; }
    currentLabel.textContent = label;
    if (!data) return;
    kpiDem.textContent = formatNumber(data['Demografía'] || 0);
    kpiSal.textContent = formatNumber(data['Salud'] || 0);
    kpiEdu.textContent = formatNumber(data['Educación'] || 0);
    kpiEco.textContent = formatNumber(data['Características Económicas'] || 0);
    kpiViv.textContent = formatNumber(data['Vivienda'] || 0);
    kpiSer.textContent = formatNumber(data['Tenencia de Servicios'] || 0);
    updateAgeChart(data);
    updateEduChart(data);
    updateServicesChart(data);
    updateHealthChart(data);
    updateExplorerChart(macro, distrito);
}

Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";

function updateAgeChart(data) {
    const ctx = document.getElementById('ageChart').getContext('2d');
    const grupos = ['0-19', '20-39', '40-59', '60+'];
    const hombres = [data['edad 0 a19 hombre']||0, data['edad 20 a 39 hombre']||0, data['edad 40 a 59 hombre']||0, data['edad 60 o mas hombre']||0];
    const mujeres = [data['edad 0 a19 mujer']||0, data['edad 20 a 39 mujer']||0, data['edad 40 a 59 mujer']||0, data['edad 60 o mas mujer']||0];
    const totales = hombres.map((h,i) => h + mujeres[i]);
    if (ageChartInstance) { ageChartInstance.data.datasets[0].data = totales; ageChartInstance.update(); return; }
    ageChartInstance = new Chart(ctx, {
        type: 'bar', data: { labels: grupos, datasets: [{ label: 'Población', data: totales, backgroundColor: 'rgba(59,130,246,0.6)', borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => {
            const idx = ctx.dataIndex;
            const total = totales[idx];
            const h = hombres[idx], m = mujeres[idx];
            return [`Total: ${total.toLocaleString()} personas`, `Hombres: ${h.toLocaleString()}`, `Mujeres: ${m.toLocaleString()}`];
        } } } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Número de personas' } }, x: { title: { display: true, text: 'Grupo de edad' } } } }
    });
}

function updateEduChart(data) {
    const ctx = document.getElementById('eduChart').getContext('2d');
    const niveles = ['Ninguno', 'Primaria', 'Secundaria', 'Superior'];
    const hombres = [data['educacion ninguno hombre']||0, data['educacion primaria hombre']||0, data['educacion secundaria hombre']||0, data['educacion superior hombre']||0];
    const mujeres = [data['educacion ninguno mujer']||0, data['educacion primaria mujer']||0, data['educacion secundaria mujer']||0, data['educacion superior mujer']||0];
    const totales = hombres.map((h,i) => h + mujeres[i]);
    if (eduChartInstance) { eduChartInstance.data.datasets[0].data = totales; eduChartInstance.update(); return; }
    eduChartInstance = new Chart(ctx, {
        type: 'doughnut', data: { labels: niveles, datasets: [{ data: totales, backgroundColor: ['rgba(239,68,68,0.7)','rgba(245,158,11,0.7)','rgba(16,185,129,0.7)','rgba(139,92,246,0.7)'], hoverOffset: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' }, tooltip: { callbacks: { label: (ctx) => {
            const idx = ctx.dataIndex;
            const total = totales[idx];
            const h = hombres[idx], m = mujeres[idx];
            return [`${niveles[idx]}: ${total.toLocaleString()} personas`, `Hombres: ${h.toLocaleString()}`, `Mujeres: ${m.toLocaleString()}`];
        } } } } }
    });
}

function updateServicesChart(data) {
    const ctx = document.getElementById('servicesChart').getContext('2d');
    const valores = [data['agua cañería']||0, data['agua pileta pública']||0, data['energia electrica servicio publico']||0, data['energia electrica notiene']||0];
    if (servicesChartInstance) { servicesChartInstance.data.datasets[0].data = valores; servicesChartInstance.update(); return; }
    servicesChartInstance = new Chart(ctx, {
        type: 'bar', data: { labels: ['Agua Cañería', 'Pileta Pública', 'Energía Pública', 'Sin Energía'], datasets: [{ label: 'Hogares', data: valores, backgroundColor: 'rgba(6,182,212,0.6)', borderRadius: 6 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, title: { display: true, text: 'Número de hogares' } } } }
    });
}

function updateHealthChart(data) {
    const ctx = document.getElementById('healthChart').getContext('2d');
    const categorias = ['SUS', 'Caja de Salud', 'Seguro Privado', 'Ninguna cobertura'];
    const hombres = [data['salud afiliacion sus hombre']||0, data['salud afiliacion caja de salud hombre']||0, data['salud afiliacion seguro privado hombre']||0, data['salud afiliacion ninguno hombre']||0];
    const mujeres = [data['salud afiliacion sus mujer']||0, data['salud afiliacion caja de salud mujer']||0, data['salud afiliacion seguro privado mujer']||0, data['salud afiliacion ninguno mujer']||0];
    const totales = hombres.map((h,i) => h + mujeres[i]);
    if (healthChartInstance) { healthChartInstance.data.datasets[0].data = totales; healthChartInstance.update(); return; }
    healthChartInstance = new Chart(ctx, {
        type: 'bar', data: { labels: categorias, datasets: [{ label: 'Personas', data: totales, backgroundColor: ['rgba(34,197,94,0.7)','rgba(59,130,246,0.7)','rgba(168,85,247,0.7)','rgba(239,68,68,0.7)'], borderRadius: 6 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => {
            const idx = ctx.dataIndex;
            const total = totales[idx];
            const h = hombres[idx], m = mujeres[idx];
            return [`Total: ${total.toLocaleString()} personas`, `Hombres: ${h.toLocaleString()}`, `Mujeres: ${m.toLocaleString()}`];
        } } } }, scales: { x: { beginAtZero: true, title: { display: true, text: 'Personas' } } } }
    });
}

function updateExplorerChart(macro, distrito) {
    const selected = variableSelect.value;
    if (!selected) return;
    let labels = [], values = [];
    if (macro === 'ALL') { labels = dashboardData.macrodistritos.map(m => m.macro_ante); values = dashboardData.macrodistritos.map(m => m[selected]||0); }
    else if (distrito === 'ALL') { const filt = dashboardData.distritos.filter(d => d.macro_ante === macro); labels = filt.map(d => `Distrito ${d.distrito}`); values = filt.map(d => d[selected]||0); }
    else { const d = dashboardData.distritos.find(d => d.macro_ante === macro && d.distrito == distrito); labels = [`Distrito ${distrito}`]; values = [d ? d[selected] : 0]; }
    if (explorerChartInstance) { explorerChartInstance.data.labels = labels; explorerChartInstance.data.datasets[0].data = values; explorerChartInstance.update(); return; }
    explorerChartInstance = new Chart(document.getElementById('explorerChart'), { type: 'bar', data: { labels, datasets: [{ label: selected, data: values, backgroundColor: 'rgba(139,92,246,0.6)', borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
}

// ---------- MAPA INTERACTIVO ----------
function initMap() {
    map = L.map('map').setView([-16.5, -68.15], 11);
    // Fondo satelital (ESRI)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
        minZoom: 10
    }).addTo(map);

    // Cargar macrodistritos
    fetch('macrodistritos.geojson')
        .then(response => response.json())
        .then(data => {
            currentMacroGeoJSON = data;
            if (data.features.length) {
                const props = data.features[0].properties;
                macroNameProperty = Object.keys(props).find(k => k.toLowerCase().includes('macro') || k.toLowerCase().includes('nombre') || k === 'Macro_Antes');
                if (!macroNameProperty) macroNameProperty = Object.keys(props)[0];
                console.log('Propiedad macrodistrito:', macroNameProperty);
            }
            macroLayer = L.geoJSON(data, {
                style: { color: '#3b82f6', weight: 2, fillOpacity: 0.2 },
                onEachFeature: (feature, layer) => {
                    const nombre = feature.properties[macroNameProperty] || 'Macrodistrito';
                    layer.bindPopup(`<strong>${nombre}</strong>`);
                    layer.bindTooltip(nombre, { permanent: true, direction: 'center', className: 'macrodistrito-label' });
                }
            }).addTo(map);
        })
        .catch(err => console.error('Error cargando macrodistritos:', err));

    // Cargar distritos
    fetch('distritos.geojson')
        .then(response => response.json())
        .then(data => {
            if (data.features.length) {
                const props = data.features[0].properties;
                distritoNameProperty = Object.keys(props).find(k => k.toLowerCase().includes('distrito') || k.toLowerCase().includes('nombre') || k === 'Distrito');
                if (!distritoNameProperty) distritoNameProperty = Object.keys(props)[0];
                console.log('Propiedad distrito:', distritoNameProperty);
            }
            distritoLayer = L.geoJSON(data, {
                style: { color: '#10b981', weight: 1, fillOpacity: 0.1, dashArray: '3' },
                onEachFeature: (feature, layer) => {
                    let nombre = feature.properties[distritoNameProperty] || 'Distrito';
                    nombre = nombre.toString();
                    layer.bindPopup(`<strong>Distrito ${nombre}</strong>`);
                    layer.bindTooltip(`Distrito ${nombre}`, { permanent: true, direction: 'center', className: 'distrito-label' });
                    layer.on('click', () => {
                        const macroActual = macroSelect.value;
                        if (macroActual !== 'ALL') {
                            // Resetear estilos de todos los distritos y macrodistritos
                            distritoLayer.eachLayer(l => {
                                l.setStyle({ color: '#10b981', weight: 1, fillOpacity: 0.1, dashArray: '3' });
                                l.closePopup();
                            });
                            if (macroLayer) {
                                macroLayer.eachLayer(l => l.setStyle({ color: '#3b82f6', weight: 2, fillOpacity: 0.2 }));
                            }
                            // Resaltar este distrito en azul
                            layer.setStyle({ color: '#3b82f6', weight: 4, fillOpacity: 0.3 });
                            layer.bringToFront();
                            layer.openPopup();
                            // Actualizar selector de distrito
                            const option = Array.from(distritoSelect.options).find(opt => opt.text.includes(nombre));
                            if (option) {
                                distritoSelect.value = option.value;
                                updateDashboard(macroActual, option.value);
                            }
                        } else {
                            alert('Primero selecciona un macrodistrito en el filtro lateral');
                        }
                    });
                }
            }).addTo(map);
        })
        .catch(err => console.error('Error cargando distritos:', err));
}

function highlightMacroOnMap(macroName) {
    if (!macroLayer || !currentMacroGeoJSON || !macroNameProperty) return;
    if (macroName === 'ALL') {
        map.setView([-16.5, -68.15], 11);
        macroLayer.eachLayer(l => l.setStyle({ color: '#3b82f6', weight: 2, fillOpacity: 0.2 }));
        if (distritoLayer) distritoLayer.eachLayer(l => l.setStyle({ color: '#10b981', weight: 1, fillOpacity: 0.1, dashArray: '3' }));
        return;
    }
    const feature = currentMacroGeoJSON.features.find(f => f.properties[macroNameProperty] && f.properties[macroNameProperty].toString() === macroName);
    if (feature) {
        const bounds = L.geoJSON(feature).getBounds();
        map.fitBounds(bounds);
        macroLayer.eachLayer(layer => {
            const layerName = layer.feature.properties[macroNameProperty]?.toString();
            if (layerName === macroName) {
                layer.setStyle({ color: '#ef4444', weight: 4, fillOpacity: 0.4 }); // ROJO
                layer.bringToFront();
            } else {
                layer.setStyle({ color: '#3b82f6', weight: 2, fillOpacity: 0.2 });
            }
        });
        if (distritoLayer) distritoLayer.eachLayer(l => l.setStyle({ color: '#10b981', weight: 1, fillOpacity: 0.1, dashArray: '3' }));
    } else {
        console.warn(`Macrodistrito "${macroName}" no encontrado en el GeoJSON`);
    }
}

function centerOnDistrito(distritoNombre) {
    if (!distritoLayer) return;
    let foundLayer = null;
    distritoLayer.eachLayer(layer => {
        layer.setStyle({ color: '#10b981', weight: 1, fillOpacity: 0.1, dashArray: '3' });
        if (layer._popup) layer.closePopup();
        const nombre = layer.feature.properties[distritoNameProperty]?.toString();
        if (nombre === distritoNombre) foundLayer = layer;
    });
    if (foundLayer) {
        map.fitBounds(foundLayer.getBounds());
        foundLayer.setStyle({ color: '#3b82f6', weight: 4, fillOpacity: 0.3 }); // AZUL
        foundLayer.bringToFront();
        foundLayer.openPopup();
        if (macroLayer) macroLayer.eachLayer(l => l.setStyle({ color: '#3b82f6', weight: 2, fillOpacity: 0.2 }));
    } else {
        console.warn(`Distrito ${distritoNombre} no encontrado en el mapa`);
    }
}

window.addEventListener('resize', () => { if (map) map.invalidateSize(); });

initDashboard();
