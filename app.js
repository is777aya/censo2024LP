// ---------- VARIABLES GLOBALES ----------
let ageChartInstance = null, eduChartInstance = null, servicesChartInstance = null, healthChartInstance = null, activityChartInstance = null, explorerChartInstance = null;
let map, macroLayer, distritoLayer;
let currentMacroGeoJSON = null;
let macroNameProperty = null;
let distritoNameProperty = null;

// Variables para OTB y Recintos
let otbsLayer = null;
let recintosLayer = null;
let otbsData = null;
let recintosData = null;

// Estado de visibilidad de capas
let otbVisible = true;
let recintosVisible = false;

// Propiedades de campos
const otbNameProp = 'nom_otb';
const recintoNameProp = 'recinto_nombre';
let medianVoto = 0;

// DOM
const macroSelect = document.getElementById('macro-select');
const distritoSelect = document.getElementById('distrito-select');
const variableSelect = document.getElementById('variable-select');
const grupoSelect = document.getElementById('grupo-select');
const currentLabel = document.getElementById('current-selection-label');
const kpiDem = document.getElementById('kpi-demografia');
const kpiSal = document.getElementById('kpi-salud');
const kpiEdu = document.getElementById('kpi-educacion');
const kpiEco = document.getElementById('kpi-economia');
const kpiViv = document.getElementById('kpi-vivienda');
const kpiSer = document.getElementById('kpi-servicios');
const otbSelect = document.getElementById('otb-select');

const formatNumber = n => new Intl.NumberFormat('es-BO').format(Math.round(n || 0));

// ---------- GRUPOS TEMÁTICOS Y VARIABLES ----------
const gruposVariables = {
    'Vivienda': [
        'Viviendas',
        'vivienda tipo particular',
        'vivienda tipo personas presentes',
        'vivienda tipo personas ausentes',
        'vivienda tipo particular desocupada',
        'vivienda tipo colectiva',
        'vivienda tenencia propia',
        'vivienda tenencia alquilada',
        'vivienda tenencia anticretico',
        'vivienda tenencia prestada',
        'vivienda tenencia otra'
    ],
    'Demografía': [
        'Personas',
        'edad 0 a19 hombre',
        'edad 20 a 39 hombre',
        'edad 40 a 59 hombre',
        'edad 60 o mas hombre',
        'edad 0 a19 mujer',
        'edad 20 a 39 mujer',
        'edad 40 a 59 mujer',
        'edad 60 o mas mujer'
    ],
    'Educación': [
        'educacion ninguno hombre',
        'educacion primaria hombre',
        'educacion secundaria hombre',
        'educacion superior hombre',
        'educacion sinespecificar hombre',
        'educacion ninguno mujer',
        'educacion primaria mujer',
        'educacion secundaria mujer',
        'educacion superior mujer',
        'educacion sin especificar mujer'
    ],
    'Salud': [
        'salud centro publico hombre',
        'salud caja de salud hombre',
        'salud centro privado hombre',
        'salud atencion domicilio hombre',
        'salud medicina tradicional hombre',
        'salud farmacia sin receta hombre',
        'salud remedios caseros hombre',
        'salud centro publico mujer',
        'salud caja de salud mujer',
        'salud centro privado mujer',
        'salud atencion domicilio mujer',
        'salud medicina tradicional mujer',
        'salud farmacia sin receta mujer',
        'salud remedios caseros mujer',
        'salud afiliacion sus hombre',
        'salud afiliacion caja de salud hombre',
        'salud afiliacion seguro privado hombre',
        'salud afiliacion ninguno hombre',
        'salud afiliacion sin especificar hombre',
        'salud afiliacion sus mujer',
        'salud afiliacion caja de salud mujer',
        'salud afiliacion seguro privado mujer',
        'salud afiliacion ninguno mujer',
        'salud afiliacion sin especificar mujer'
    ],
    'Ciudadanía': [
        'nacimiento aqui hombre',
        'nacimiento otro municipio hombre',
        'nacimiento otro pais hombre',
        'nacimiento sin especificar hombre',
        'nacimiento aqui mujer',
        'nacimiento otro municipio mujer',
        'nacimiento otro pais mujer',
        'nacimiento sin especificar mujer'
    ],
    'Migración': [
        'residencia aqui hombre',
        'residencia otro municipio hombre',
        'residencia otro pais hombre',
        'residencia sin especificar hombre',
        'residencia aqui mujer',
        'residencia otro municipio mujer',
        'residencia otro pais mujer',
        'residencia sin especificar mujer'
    ],
    'Empleo': [
        'ocupacion empleado hombre',
        'ocupacion cuenta propia hombre',
        'ocupacion otros hombre',
        'ocupacion sin especificar hombre',
        'ocupacion empleado mujer',
        'ocupacion cuenta propia mujer',
        'ocupacion otros mujer',
        'ocupacion sin especificar mujer'
    ],
    'Características Económicas': [
        'actividad agricultura hombre',
        'actividad comercio hombre',
        'actividad manufactura hombre',
        'actividad construccion hombre',
        'actividad transporte hombre',
        'actividad alojamiento y comida hombre',
        'actividad enseñanza hombre',
        'actividad salud y asistencia hombre',
        'actividad otras hombre',
        'actividad sin especificar hombre',
        'actividad agricultura mujer',
        'actividad comercio mujer',
        'actividad manufactura mujer',
        'actividad construccion mujer',
        'actividad transporte mujer',
        'actividad alojamiento y comida mujer',
        'actividad enseñanza mujer',
        'actividad salud y asistencia mujer',
        'actividad otras mujer',
        'actividad sin especificar mujer'
    ],
    'Servicios Básicos': [
        'energia electrica servicio publico',
        'energia electrica motor propio',
        'energia electrica panel solar',
        'energia electrica otra',
        'energia electrica notiene',
        'agua cañería',
        'agua pileta pública',
        'agua carro repartidor',
        'agua pozo conbomba',
        'agua pozo sin bomba',
        'agua vertiente no protegida',
        'agua vertiente protegida',
        'agua cosecha de lluvia',
        'agua otra',
        'desague alcantarillado',
        'desague camara séptica',
        'desague pozo ciego',
        'desague superficie',
        'desague pozo de absorción',
        'desague baño ecológico',
        'desague no tiene',
        'combustible gas garrafa',
        'combustible gas cañería',
        'combustible leña',
        'combustible guano',
        'combustible electricidad',
        'combustible energía solar',
        'combustible otro',
        'combustible no cocina',
        'basura basurero público',
        'basura carro basurero',
        'basura calle',
        'basura río',
        'basura quema',
        'basura entierra',
        'basura otro',
        'tics radio',
        'tics televisor',
        'tics celular',
        'tics internet'
    ]
};

// Variables para control de etiquetas y selecciones
let seleccionMacro = 'ALL';
let seleccionDistrito = 'ALL';
let otbSeleccionada = null;  // Almacena el nombre normalizado de la OTB resaltada

// ---------- FUNCIÓN DE NORMALIZACIÓN ----------
function normalize(str) {
    if (!str) return '';
    let s = String(str).toLowerCase().trim();
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    s = s.replace(/\s+/g, ' ');
    s = s.replace(/[^a-z0-9 ]/g, '');
    return s;
}

function toNumber(value) {
    const num = parseFloat(value);
    return isNaN(num) ? value : num;
}

// ---------- CENTRAR EN GEOMETRÍA (CORREGIDO) ----------
function centerOnGeometry(geometry) {
    if (!geometry) return;

    if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
        let coords = geometry.type === 'Point' ? geometry.coordinates : geometry.coordinates[0];
        let lng = coords[0], lat = coords[1];
        map.setView([lat, lng], 15);
        return;
    }

    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
        let tempLayer = L.geoJSON(geometry);
        let bounds = tempLayer.getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [20, 20] });
        } else {
            let coords = geometry.type === 'Polygon' ? geometry.coordinates[0] : geometry.coordinates[0][0];
            let sumLng = 0, sumLat = 0, count = 0;
            coords.forEach(coord => {
                sumLng += coord[0];
                sumLat += coord[1];
                count++;
            });
            let lng = sumLng / count, lat = sumLat / count;
            map.setView([lat, lng], 14);
        }
        return;
    }
}

// ---------- COLOR DE RECINTOS (SIN CAMBIOS) ----------
function getQuantileColor(pct) {
    if (pct === undefined || pct === null) return '#cccccc';
    if (medianVoto === 0) return '#800080';
    if (pct <= medianVoto) {
        return '#FFD700';
    } else {
        return '#800080';
    }
}

function getQuantileRadius(pct) {
    if (pct === undefined || pct === null) return 8;
    if (medianVoto === 0) return 12;
    if (pct <= medianVoto) {
        return 2;
    } else {
        return 4;
    }
}

// ---------- FUNCIONES DE CÁLCULO DE KPIs ----------
function calcDemografia(data) {
    const edades = [
        'edad 0 a19 hombre', 'edad 0 a19 mujer',
        'edad 20 a 39 hombre', 'edad 20 a 39 mujer',
        'edad 40 a 59 hombre', 'edad 40 a 59 mujer',
        'edad 60 o mas hombre', 'edad 60 o mas mujer'
    ];
    return edades.reduce((sum, key) => sum + (data[key] || 0), 0);
}

function calcSalud(data) {
    const afiliaciones = [
        'salud afiliacion sus hombre', 'salud afiliacion sus mujer',
        'salud afiliacion caja de salud hombre', 'salud afiliacion caja de salud mujer',
        'salud afiliacion seguro privado hombre', 'salud afiliacion seguro privado mujer',
        'salud afiliacion ninguno hombre', 'salud afiliacion ninguno mujer'
    ];
    return afiliaciones.reduce((sum, key) => sum + (data[key] || 0), 0);
}

function calcEducacion(data) {
    const niveles = [
        'educacion ninguno hombre', 'educacion ninguno mujer',
        'educacion primaria hombre', 'educacion primaria mujer',
        'educacion secundaria hombre', 'educacion secundaria mujer',
        'educacion superior hombre', 'educacion superior mujer'
    ];
    return niveles.reduce((sum, key) => sum + (data[key] || 0), 0);
}

function calcVivienda(data) {
    const tenencias = [
        'vivienda tenencia propia',
        'vivienda tenencia alquilada',
        'vivienda tenencia anticretico',
        'vivienda tenencia prestada',
        'vivienda tenencia otra'
    ];
    return tenencias.reduce((sum, key) => sum + (data[key] || 0), 0);
}

function calcEconomia(data) {
    const actividades = [
        'actividad agricultura hombre', 'actividad agricultura mujer',
        'actividad comercio hombre', 'actividad comercio mujer',
        'actividad manufactura hombre', 'actividad manufactura mujer',
        'actividad construccion hombre', 'actividad construccion mujer',
        'actividad transporte hombre', 'actividad transporte mujer',
        'actividad alojamiento y comida hombre', 'actividad alojamiento y comida mujer',
        'actividad enseñanza hombre', 'actividad enseñanza mujer',
        'actividad salud y asistencia hombre', 'actividad salud y asistencia mujer',
        'actividad otras hombre', 'actividad otras mujer'
    ];
    return actividades.reduce((sum, key) => sum + (data[key] || 0), 0);
}

function calcServicios(data) {
    const servicios = [
        'agua cañería',
        'agua pileta pública',
        'energia electrica servicio publico',
        'energia electrica notiene'
    ];
    return servicios.reduce((sum, key) => sum + (data[key] || 0), 0);
}

// ---------- INICIALIZACIÓN ----------
function initDashboard() {
    if (typeof dashboardData === 'undefined') return alert("Error: dashboard_data.js no encontrado.");
    populateGrupos();
    populateVariables('Vivienda');
    populateDropdowns();
    updateDashboard('ALL', 'ALL');
    setupEventListeners();
    initMap();
    loadRecintos();
    loadOTBs();
    setupLayerControls();
}

// ---------- FILTROS DE GRUPO Y VARIABLES ----------
function populateGrupos() {
    if (!grupoSelect) return;
    const grupos = Object.keys(gruposVariables);
    grupoSelect.innerHTML = '';
    grupos.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        grupoSelect.appendChild(opt);
    });
    grupoSelect.value = grupos[0] || '';
}

function populateVariables(grupo) {
    if (!variableSelect) return;
    const vars = gruposVariables[grupo] || [];
    variableSelect.innerHTML = '';
    vars.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        variableSelect.appendChild(opt);
    });
    if (vars.length > 0) {
        variableSelect.value = vars[0];
    }
}

// ---------- FILTROS GEOGRÁFICOS ----------
function populateDropdowns() {
    if (!dashboardData.macrodistritos?.length) return;
    const first = dashboardData.macrodistritos[0];
    let macroKey = ['macro_ante', 'Macro_Antes', 'macrodistrito', 'Macrodistrito'].find(k => first.hasOwnProperty(k));
    if (!macroKey) macroKey = Object.keys(first)[0];
    const macros = [...new Set(dashboardData.macrodistritos.map(m => m[macroKey]))].filter(Boolean);
    macros.forEach(m => { const opt = document.createElement('option'); opt.value = m; opt.textContent = m; macroSelect.appendChild(opt); });
}

function setupEventListeners() {
    macroSelect.addEventListener('change', e => {
        const macro = e.target.value;
        seleccionMacro = macro;
        seleccionDistrito = 'ALL';
        otbSeleccionada = null;  // Resetear resaltado OTB
        distritoSelect.innerHTML = '<option value="ALL">Todos los Distritos</option>';
        if (macro !== 'ALL') {
            dashboardData.distritos.filter(d => d.macro_ante === macro).forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.distrito;
                opt.textContent = `Distrito ${d.distrito}`;
                distritoSelect.appendChild(opt);
            });
        }
        otbSelect.value = 'ALL';
        resetOTBHighlight();
        updateDashboard(macro, 'ALL');
        highlightMacroOnMap(macro);
        rebuildSpatialLayers(macro, 'ALL');
        actualizarEtiquetas();
    });

    distritoSelect.addEventListener('change', e => {
        const macro = macroSelect.value;
        const distrito = e.target.value;
        seleccionDistrito = distrito;
        otbSeleccionada = null;
        otbSelect.value = 'ALL';
        resetOTBHighlight();
        updateDashboard(macro, distrito);
        if (distrito !== 'ALL' && distritoLayer) centerOnDistrito(distrito);
        rebuildSpatialLayers(macro, distrito);
        actualizarEtiquetas();
    });

    grupoSelect.addEventListener('change', () => {
        const grupo = grupoSelect.value;
        populateVariables(grupo);
        const macro = macroSelect.value;
        const distrito = distritoSelect.value;
        updateExplorerChart(macro, distrito);
    });

    variableSelect.addEventListener('change', () => {
        const macro = macroSelect.value;
        const distrito = distritoSelect.value;
        updateExplorerChart(macro, distrito);
    });

    otbSelect.addEventListener('change', () => {
        const selected = otbSelect.value;
        rebuildSpatialLayers(macroSelect.value, distritoSelect.value);
        if (selected !== 'ALL') {
            highlightOTB(selected);
        } else {
            resetOTBHighlight();
        }
        actualizarEtiquetas();
    });
}

// ---------- DASHBOARD Y GRÁFICOS ----------
function getSum(data, keys) { return keys.reduce((s,k) => s + (data[k]||0), 0); }

function updateDashboard(macro, distrito) {
    let data, label = 'Visión General: Todos los Macrodistritos';
    if (macro === 'ALL' && distrito === 'ALL') {
        data = dashboardData.resumen_general;
        label = 'Visión General: Todos los Macrodistritos';
    } else if (distrito === 'ALL') {
        data = dashboardData.macrodistritos.find(m => m.macro_ante === macro);
        label = `Macrodistrito: ${macro}`;
    } else {
        data = dashboardData.distritos.find(d => 
            d.macro_ante === macro && Number(d.distrito) === Number(distrito)
        );
        label = `Macrodistrito: ${macro} | Distrito: ${distrito}`;
    }
    currentLabel.textContent = label;
    if (!data) {
        console.warn('No se encontraron datos para el filtro', macro, distrito);
        return;
    }

    kpiDem.textContent = formatNumber(calcDemografia(data));
    kpiSal.textContent = formatNumber(calcSalud(data));
    kpiEdu.textContent = formatNumber(calcEducacion(data));
    kpiViv.textContent = formatNumber(calcVivienda(data));
    kpiEco.textContent = formatNumber(calcEconomia(data));
    kpiSer.textContent = formatNumber(calcServicios(data));

    updateAgeChart(data);
    updateEduChart(data);
    updateServicesChart(data);
    updateHealthChart(data);
    updateActivityChart(data);
    updateExplorerChart(macro, distrito);
}

Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";

// ---------- GRÁFICOS ----------
function updateAgeChart(data) {
    const ctx = document.getElementById('ageChart').getContext('2d');
    if (ageChartInstance) {
        ageChartInstance.destroy();
        ageChartInstance = null;
    }
    const grupos = ['0-19', '20-39', '40-59', '60+'];
    const hombres = [data['edad 0 a19 hombre'] || 0, data['edad 20 a 39 hombre'] || 0, data['edad 40 a 59 hombre'] || 0, data['edad 60 o mas hombre'] || 0];
    const mujeres = [data['edad 0 a19 mujer'] || 0, data['edad 20 a 39 mujer'] || 0, data['edad 40 a 59 mujer'] || 0, data['edad 60 o mas mujer'] || 0];
    const totales = hombres.map((h, i) => h + mujeres[i]);

    ageChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: grupos,
            datasets: [{ label: 'Población', data: totales, backgroundColor: 'rgba(59,130,246,0.6)', borderRadius: 6 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const chart = ctx.chart;
                            const idx = ctx.dataIndex;
                            const total = chart.ageData.totales[idx] || 0;
                            const h = chart.ageData.hombres[idx] || 0;
                            const m = chart.ageData.mujeres[idx] || 0;
                            return [`Total: ${total.toLocaleString()} personas`, `Hombres: ${h.toLocaleString()}`, `Mujeres: ${m.toLocaleString()}`];
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Número de personas' } },
                x: { title: { display: true, text: 'Grupo de edad' } }
            }
        }
    });
    ageChartInstance.ageData = { hombres, mujeres, totales };
}

function updateEduChart(data) {
    const ctx = document.getElementById('eduChart').getContext('2d');
    if (eduChartInstance) {
        eduChartInstance.destroy();
        eduChartInstance = null;
    }
    const niveles = ['Ninguno', 'Primaria', 'Secundaria', 'Superior'];
    const hombres = [data['educacion ninguno hombre'] || 0, data['educacion primaria hombre'] || 0, data['educacion secundaria hombre'] || 0, data['educacion superior hombre'] || 0];
    const mujeres = [data['educacion ninguno mujer'] || 0, data['educacion primaria mujer'] || 0, data['educacion secundaria mujer'] || 0, data['educacion superior mujer'] || 0];
    const totales = hombres.map((h, i) => h + mujeres[i]);

    eduChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: niveles,
            datasets: [{ data: totales, backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)', 'rgba(16,185,129,0.7)', 'rgba(139,92,246,0.7)'], hoverOffset: 4 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'right' },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const chart = ctx.chart;
                            const idx = ctx.dataIndex;
                            const total = chart.eduData.totales[idx] || 0;
                            const h = chart.eduData.hombres[idx] || 0;
                            const m = chart.eduData.mujeres[idx] || 0;
                            return [`${niveles[idx]}: ${total.toLocaleString()} personas`, `Hombres: ${h.toLocaleString()}`, `Mujeres: ${m.toLocaleString()}`];
                        }
                    }
                }
            }
        }
    });
    eduChartInstance.eduData = { hombres, mujeres, totales };
}

function updateServicesChart(data) {
    const ctx = document.getElementById('servicesChart').getContext('2d');
    if (servicesChartInstance) {
        servicesChartInstance.destroy();
        servicesChartInstance = null;
    }
    const valores = [data['agua cañería'] || 0, data['agua pileta pública'] || 0, data['energia electrica servicio publico'] || 0, data['energia electrica notiene'] || 0];

    servicesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Agua Cañería', 'Pileta Pública', 'Energía Pública', 'Sin Energía'],
            datasets: [{ label: 'Hogares', data: valores, backgroundColor: 'rgba(6,182,212,0.6)', borderRadius: 6 }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => `${ctx.raw || 0} hogares` } }
            },
            scales: {
                x: { beginAtZero: true, title: { display: true, text: 'Número de hogares' } }
            }
        }
    });
}

function updateHealthChart(data) {
    const ctx = document.getElementById('healthChart').getContext('2d');
    if (healthChartInstance) {
        healthChartInstance.destroy();
        healthChartInstance = null;
    }
    const categorias = ['SUS', 'Caja de Salud', 'Seguro Privado', 'Ninguna cobertura'];
    const hombres = [data['salud afiliacion sus hombre'] || 0, data['salud afiliacion caja de salud hombre'] || 0, data['salud afiliacion seguro privado hombre'] || 0, data['salud afiliacion ninguno hombre'] || 0];
    const mujeres = [data['salud afiliacion sus mujer'] || 0, data['salud afiliacion caja de salud mujer'] || 0, data['salud afiliacion seguro privado mujer'] || 0, data['salud afiliacion ninguno mujer'] || 0];
    const totales = hombres.map((h, i) => h + mujeres[i]);

    healthChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categorias,
            datasets: [{ label: 'Personas', data: totales, backgroundColor: ['rgba(34,197,94,0.7)', 'rgba(59,130,246,0.7)', 'rgba(168,85,247,0.7)', 'rgba(239,68,68,0.7)'], borderRadius: 6 }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const chart = ctx.chart;
                            const idx = ctx.dataIndex;
                            const total = chart.healthData.totales[idx] || 0;
                            const h = chart.healthData.hombres[idx] || 0;
                            const m = chart.healthData.mujeres[idx] || 0;
                            return [`Total: ${total.toLocaleString()} personas`, `Hombres: ${h.toLocaleString()}`, `Mujeres: ${m.toLocaleString()}`];
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true, title: { display: true, text: 'Personas' } }
            }
        }
    });
    healthChartInstance.healthData = { hombres, mujeres, totales };
}

function updateActivityChart(data) {
    const ctx = document.getElementById('activityChart').getContext('2d');
    if (activityChartInstance) {
        activityChartInstance.destroy();
        activityChartInstance = null;
    }

    const actividades = [
        'Agricultura', 'Comercio', 'Manufactura', 'Construcción',
        'Transporte', 'Alojamiento y comida', 'Enseñanza', 'Salud y asistencia', 'Otras actividades'
    ];

    const hombres = [
        data['actividad agricultura hombre'] || 0,
        data['actividad comercio hombre'] || 0,
        data['actividad manufactura hombre'] || 0,
        data['actividad construccion hombre'] || 0,
        data['actividad transporte hombre'] || 0,
        data['actividad alojamiento y comida hombre'] || 0,
        data['actividad enseñanza hombre'] || 0,
        data['actividad salud y asistencia hombre'] || 0,
        data['actividad otras hombre'] || 0
    ];

    const mujeres = [
        data['actividad agricultura mujer'] || 0,
        data['actividad comercio mujer'] || 0,
        data['actividad manufactura mujer'] || 0,
        data['actividad construccion mujer'] || 0,
        data['actividad transporte mujer'] || 0,
        data['actividad alojamiento y comida mujer'] || 0,
        data['actividad enseñanza mujer'] || 0,
        data['actividad salud y asistencia mujer'] || 0,
        data['actividad otras mujer'] || 0
    ];

    const totales = hombres.map((h, i) => h + mujeres[i]);

    activityChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: actividades,
            datasets: [{
                label: 'Personas',
                data: totales,
                backgroundColor: 'rgba(245,158,11,0.7)',
                borderColor: 'rgba(245,158,11,1)',
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const chart = ctx.chart;
                            const idx = ctx.dataIndex;
                            const total = chart.activityTotales[idx] || 0;
                            const h = chart.activityHombres[idx] || 0;
                            const m = chart.activityMujeres[idx] || 0;
                            return [
                                `Total: ${total.toLocaleString()} personas`,
                                `Hombres: ${h.toLocaleString()}`,
                                `Mujeres: ${m.toLocaleString()}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Número de personas' }
                },
                y: {
                    title: { display: true, text: 'Rama de actividad' }
                }
            }
        }
    });

    activityChartInstance.activityTotales = totales;
    activityChartInstance.activityHombres = hombres;
    activityChartInstance.activityMujeres = mujeres;
}

// ---------- EXPLORADOR DE VARIABLES ----------
function updateExplorerChart(macro, distrito) {
    const selected = variableSelect.value;
    if (!selected) return;

    const calcMap = {
        'Personas': calcDemografia,
        'Viviendas': calcVivienda,
        'Demografía': calcDemografia,
        'Salud': calcSalud,
        'Educación': calcEducacion,
        'Características Económicas': calcEconomia,
        'Tenencia de Servicios': calcServicios,
        'Vivienda': calcVivienda
    };
    const useCalc = calcMap[selected];

    let labels = [], values = [];

    if (macro === 'ALL') {
        labels = dashboardData.macrodistritos.map(m => m.macro_ante);
        values = dashboardData.macrodistritos.map(m => {
            if (useCalc) return useCalc(m);
            return m[selected] || 0;
        });
    } else if (distrito === 'ALL') {
        const filt = dashboardData.distritos.filter(d => d.macro_ante === macro);
        labels = filt.map(d => `Distrito ${d.distrito}`);
        values = filt.map(d => {
            if (useCalc) return useCalc(d);
            return d[selected] || 0;
        });
        if (!useCalc) {
            filt.forEach(d => {
                if (!(selected in d)) {
                    console.warn(`La variable "${selected}" no existe en el distrito ${d.distrito}`);
                }
            });
        }
    } else {
        const d = dashboardData.distritos.find(d => d.macro_ante === macro && Number(d.distrito) === Number(distrito));
        labels = [`Distrito ${distrito}`];
        if (d) {
            if (useCalc) {
                values = [useCalc(d)];
            } else {
                values = [d[selected] || 0];
                if (!(selected in d)) {
                    console.warn(`La variable "${selected}" no existe en el distrito ${distrito}`);
                }
            }
        } else {
            values = [0];
        }
    }

    if (explorerChartInstance) {
        explorerChartInstance.destroy();
        explorerChartInstance = null;
    }
    const ctx = document.getElementById('explorerChart').getContext('2d');
    explorerChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: selected, data: values, backgroundColor: 'rgba(139,92,246,0.6)', borderRadius: 6 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ---------- ACTUALIZAR ETIQUETAS Y ESTILOS SEGÚN FILTRO (CON RESALTADO DE OTB) ----------
function actualizarEtiquetas() {
    if (!map || !macroLayer || !distritoLayer) return;
    const zoom = map.getZoom();

    // 1. Macrodistritos
    const mostrarMacro = (zoom <= 10 && seleccionDistrito === 'ALL');
    macroLayer.eachLayer(layer => {
        const tooltip = layer._tooltip;
        if (tooltip) {
            if (mostrarMacro) {
                layer.openTooltip();
                const nombre = layer.feature?.properties[macroNameProperty];
                if (seleccionMacro !== 'ALL' && nombre && normalize(nombre) === normalize(seleccionMacro)) {
                    tooltip._container.style.color = '#fbbf24';
                } else {
                    tooltip._container.style.color = '#f97316';
                }
            } else {
                layer.closeTooltip();
            }
        }
    });

    // 2. Distritos
    const mostrarDistrito = (zoom >= 11 && zoom <= 13) || (seleccionDistrito !== 'ALL' && zoom >= 11);
    distritoLayer.eachLayer(layer => {
        const tooltip = layer._tooltip;
        if (tooltip) {
            if (mostrarDistrito) {
                layer.openTooltip();
                const nombre = layer.feature?.properties[distritoNameProperty];
                if (seleccionDistrito !== 'ALL' && nombre && normalize(nombre) === normalize(seleccionDistrito)) {
                    tooltip._container.style.color = '#ffffff';
                } else {
                    tooltip._container.style.color = '#06b6d4';
                }
            } else {
                layer.closeTooltip();
            }
        }
    });

    // 3. OTB: ajustar estilo según filtro y resaltado persistente
    if (otbsLayer && otbVisible) {
        const macroFiltrado = seleccionMacro !== 'ALL';
        const distritoFiltrado = seleccionDistrito !== 'ALL';
        const hayFiltro = macroFiltrado || distritoFiltrado;
        const opacity = document.getElementById('opacity-otb').value / 100;

        otbsLayer.eachLayer(layer => {
            const nombreOTB = layer.feature?.properties[otbNameProp];
            const nombreNorm = nombreOTB ? normalize(nombreOTB) : '';

            // Verificar si esta OTB es la seleccionada (comparación normalizada)
            const esSeleccionada = (otbSeleccionada !== null && nombreNorm === otbSeleccionada);

            if (esSeleccionada) {
                // 🔥 RESALTADO FIJO: amarillo con mayor opacidad y grosor
                layer.setStyle({
                    color: '#fbbf24',
                    weight: 4,
                    fillColor: '#fbbf24',
                    fillOpacity: 0.3 * opacity,
                    opacity: 0.95 * opacity,
                    dashArray: null
                });
                layer.bringToFront();
                return; // Saltar el resto
            }

            // Si no está seleccionada, aplicar filtro de atenuación o normal
            const otbMacro = layer.feature?.properties.macro_ante;
            const otbDistrito = layer.feature?.properties.distrito;

            let pertenece = true;
            if (macroFiltrado && otbMacro) {
                pertenece = pertenece && normalize(otbMacro) === normalize(seleccionMacro);
            }
            if (distritoFiltrado && otbDistrito !== undefined) {
                pertenece = pertenece && Number(otbDistrito) === Number(seleccionDistrito);
            }

            if (hayFiltro && !pertenece) {
                // Atenuado: gris
                layer.setStyle({
                    color: '#64748b',
                    fillColor: '#64748b',
                    fillOpacity: 0.05 * opacity,
                    opacity: 0.4 * opacity
                });
            } else {
                // Normal: magenta
                layer.setStyle({
                    color: '#ec4899',
                    fillColor: '#ec4899',
                    fillOpacity: 0.15 * opacity,
                    opacity: 0.85 * opacity
                });
            }
        });
    }
}

// ---------- MAPA ----------
function initMap() {
    map = L.map('map').setView([-16.5206, -68.0701], 12);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
        minZoom: 10
    }).addTo(map);

    map.createPane('recintosPane');
    map.getPane('recintosPane').style.zIndex = 1000;

    map.on('zoomend', actualizarEtiquetas);
    map.on('moveend', actualizarEtiquetas);

    // Macrodistritos
    fetch('macrodistritos.geojson')
        .then(response => response.json())
        .then(data => {
            currentMacroGeoJSON = data;
            if (data.features.length) {
                const props = data.features[0].properties;
                macroNameProperty = Object.keys(props).find(k => 
                    k.toLowerCase().includes('macro') || 
                    k.toLowerCase().includes('nombre') || 
                    k === 'Macro_Antes'
                );
                if (!macroNameProperty) macroNameProperty = Object.keys(props)[0];
                console.log('✅ Propiedad macrodistrito:', macroNameProperty);
            }
            macroLayer = L.geoJSON(data, {
                style: { color: '#f97316', weight: 2, fillOpacity: 0.15 },
                onEachFeature: (feature, layer) => {
                    const nombre = feature.properties[macroNameProperty] || 'Macrodistrito';
                    layer.bindPopup(`<strong>${nombre}</strong>`);
                    layer.bindTooltip(nombre, {
                        permanent: true,
                        direction: 'auto',
                        className: 'etiqueta-macrodistrito',
                        offset: [0, 0],
                        opacity: 0.95
                    });
                }
            }).addTo(map);

            highlightMacroOnMap(macroSelect.value);
            actualizarEtiquetas();
        })
        .catch(err => console.error('❌ Error cargando macrodistritos:', err));

    // Distritos
    fetch('distritos.geojson')
        .then(response => response.json())
        .then(data => {
            if (data.features.length) {
                const props = data.features[0].properties;
                distritoNameProperty = Object.keys(props).find(k => 
                    k.toLowerCase().includes('distrito') || 
                    k.toLowerCase().includes('nombre') || 
                    k === 'Distrito'
                );
                if (!distritoNameProperty) distritoNameProperty = Object.keys(props)[0];
                console.log('✅ Propiedad distrito:', distritoNameProperty);
            }
            distritoLayer = L.geoJSON(data, {
                style: { color: '#06b6d4', weight: 1.5, fillOpacity: 0.1, dashArray: '4' },
                onEachFeature: (feature, layer) => {
                    let nombre = feature.properties[distritoNameProperty] || 'Distrito';
                    nombre = nombre.toString();
                    layer.bindPopup(`<strong>Distrito ${nombre}</strong>`);
                    layer.bindTooltip(`Distrito ${nombre}`, {
                        permanent: true,
                        direction: 'auto',
                        className: 'etiqueta-distrito',
                        offset: [0, 0],
                        opacity: 0.95
                    });
                    layer.on('click', () => {
                        const macroActual = macroSelect.value;
                        if (macroActual !== 'ALL') {
                            distritoLayer.eachLayer(l => { l.setStyle({ color: '#06b6d4', weight: 1.5, fillOpacity: 0.1, dashArray: '4' }); l.closePopup(); });
                            if (macroLayer) macroLayer.eachLayer(l => l.setStyle({ color: '#f97316', weight: 2, fillOpacity: 0.15 }));
                            layer.setStyle({ color: '#ffffff', weight: 4, fillOpacity: 0.2, dashArray: null });
                            layer.bringToFront();
                            layer.openPopup();
                            const option = Array.from(distritoSelect.options).find(opt => opt.text.includes(nombre));
                            if (option) { distritoSelect.value = option.value; updateDashboard(macroActual, option.value); }
                        } else alert('Primero selecciona un macrodistrito en el filtro lateral');
                    });
                }
            }).addTo(map);
            actualizarEtiquetas();
        })
        .catch(err => console.error('❌ Error cargando distritos:', err));
}

// ---------- HIGHLIGHT MACRO ----------
let macroRetryCount = 0;
const MAX_MACRO_RETRIES = 10;

function highlightMacroOnMap(macroName) {
    if (!macroLayer || !currentMacroGeoJSON || !macroNameProperty) {
        if (macroRetryCount < MAX_MACRO_RETRIES) {
            macroRetryCount++;
            console.log(`⏳ Esperando datos del mapa... Reintento ${macroRetryCount} en 500ms`);
            setTimeout(() => highlightMacroOnMap(macroName), 500);
        } else {
            console.warn('❌ No se pudieron cargar los datos del mapa después de varios intentos');
        }
        return;
    }
    macroRetryCount = 0;

    const macroNorm = normalize(macroName);
    const macroTrim = macroName.trim();

    if (macroName === 'ALL') {
        map.setView([-16.5, -68.15], 11);
        macroLayer.eachLayer(l => l.setStyle({ color: '#f97316', weight: 2, fillOpacity: 0.15 }));
        if (distritoLayer) distritoLayer.eachLayer(l => l.setStyle({ color: '#06b6d4', weight: 1.5, fillOpacity: 0.1, dashArray: '4' }));
        actualizarEtiquetas();
        return;
    }

    let targetLayer = null;
    let foundFeature = null;

    macroLayer.eachLayer(layer => {
        const layerName = layer.feature?.properties[macroNameProperty];
        if (layerName && layerName.toString().trim() === macroTrim) {
            targetLayer = layer;
            foundFeature = layer.feature;
        }
    });

    if (!targetLayer) {
        macroLayer.eachLayer(layer => {
            const layerName = layer.feature?.properties[macroNameProperty];
            if (layerName) {
                const layerNorm = normalize(layerName.toString());
                if (layerNorm === macroNorm) {
                    targetLayer = layer;
                    foundFeature = layer.feature;
                }
            }
        });
    }

    if (!targetLayer) {
        macroLayer.eachLayer(layer => {
            const layerName = layer.feature?.properties[macroNameProperty];
            if (layerName) {
                const layerNorm = normalize(layerName.toString());
                if (layerNorm.includes(macroNorm) || macroNorm.includes(layerNorm)) {
                    targetLayer = layer;
                    foundFeature = layer.feature;
                }
            }
        });
    }

    if (!targetLayer) {
        const searchLower = macroName.toLowerCase().trim();
        macroLayer.eachLayer(layer => {
            const layerName = layer.feature?.properties[macroNameProperty];
            if (layerName && layerName.toString().toLowerCase().trim() === searchLower) {
                targetLayer = layer;
                foundFeature = layer.feature;
            }
        });
    }

    if (targetLayer && foundFeature) {
        let bounds = targetLayer.getBounds();
        if (!bounds.isValid()) {
            const tempLayer = L.geoJSON(foundFeature);
            bounds = tempLayer.getBounds();
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [5, 5] });
        } else {
            console.warn('⚠️ Los bounds del macrodistrito no son válidos, usando vista general');
            map.setView([-16.5, -68.15], 11);
        }

        macroLayer.eachLayer(layer => {
            if (layer === targetLayer) {
                layer.setStyle({ color: '#fbbf24', weight: 4, fillOpacity: 0.3, dashArray: null });
                layer.bringToFront();
            } else {
                layer.setStyle({ color: '#f97316', weight: 2, fillOpacity: 0.15 });
            }
        });

        if (distritoLayer) {
            distritoLayer.eachLayer(l => l.setStyle({ color: '#06b6d4', weight: 1.5, fillOpacity: 0.1, dashArray: '4' }));
        }
        actualizarEtiquetas();
    } else {
        console.warn(`❌ Macrodistrito "${macroName}" no encontrado en el GeoJSON.`);
        map.setView([-16.5, -68.15], 11);
        actualizarEtiquetas();
    }
}

function centerOnDistrito(distritoNombre) {
    if (!distritoLayer) return;
    let foundLayer = null;
    distritoLayer.eachLayer(layer => {
        layer.setStyle({ color: '#06b6d4', weight: 1.5, fillOpacity: 0.1, dashArray: '4' });
        if (layer._popup) layer.closePopup();
        const nombre = layer.feature.properties[distritoNameProperty]?.toString();
        if (nombre === distritoNombre) foundLayer = layer;
    });
    if (foundLayer) {
        map.fitBounds(foundLayer.getBounds(), { padding: [5, 5] });
        foundLayer.setStyle({ color: '#ffffff', weight: 4, fillOpacity: 0.2, dashArray: null });
        foundLayer.bringToFront();
        foundLayer.openPopup();
        if (macroLayer) macroLayer.eachLayer(l => l.setStyle({ color: '#f97316', weight: 2, fillOpacity: 0.15 }));
        actualizarEtiquetas();
    } else console.warn(`Distrito ${distritoNombre} no encontrado en el mapa`);
}

// ---------- CONTROLES DE CAPA ----------
function setupLayerControls() {
    const toggleOTB = document.getElementById('toggle-otb');
    const opacityOTB = document.getElementById('opacity-otb');
    const opacityOTBVal = document.getElementById('opacity-otb-val');

    toggleOTB.addEventListener('change', function() {
        otbVisible = this.checked;
        updateLayerVisibility();
        actualizarEtiquetas();
    });

    opacityOTB.addEventListener('input', function() {
        const val = this.value;
        opacityOTBVal.innerText = `${val}%`;
        if (otbsLayer && otbVisible) {
            const opacity = val / 100;
            otbsLayer.eachLayer(layer => {
                layer.setStyle({ fillOpacity: 0.15 * opacity, opacity: 0.85 * opacity });
            });
            actualizarEtiquetas();
        }
    });

    const toggleRecintos = document.getElementById('toggle-recintos');
    const opacityRecintos = document.getElementById('opacity-recintos');
    const opacityRecintosVal = document.getElementById('opacity-recintos-val');

    toggleRecintos.addEventListener('change', function() {
        recintosVisible = this.checked;
        updateLayerVisibility();
        if (recintosVisible && recintosLayer) {
            const val = opacityRecintos.value;
            recintosLayer.setStyle({ fillOpacity: val / 100, opacity: val / 100 * 0.8 });
        }
        actualizarEtiquetas();
    });

    opacityRecintos.addEventListener('input', function() {
        const val = this.value;
        opacityRecintosVal.innerText = `${val}%`;
        if (recintosLayer && recintosVisible) {
            recintosLayer.setStyle({ fillOpacity: val / 100, opacity: val / 100 * 0.8 });
        }
    });
}

function updateLayerVisibility() {
    if (otbsLayer) {
        if (otbVisible && !map.hasLayer(otbsLayer)) {
            map.addLayer(otbsLayer);
        } else if (!otbVisible && map.hasLayer(otbsLayer)) {
            map.removeLayer(otbsLayer);
        }
    }
    if (recintosLayer) {
        if (recintosVisible && !map.hasLayer(recintosLayer)) {
            map.addLayer(recintosLayer);
            recintosLayer.bringToFront();
        } else if (!recintosVisible && map.hasLayer(recintosLayer)) {
            map.removeLayer(recintosLayer);
        }
    }
    actualizarEtiquetas();
}

// ---------- RECINTOS Y OTB ----------
function loadRecintos() {
    fetch('recintos.geojson')
        .then(response => response.json())
        .then(data => {
            data.features.forEach(f => {
                if (f.properties.distrito !== undefined && f.properties.distrito !== null) {
                    f.properties.distrito = toNumber(f.properties.distrito);
                }
            });
            recintosData = data;
            console.log('Recintos cargados:', recintosData.features.length);

            const votos = data.features.map(f => f.properties.ganador_recinto_pct).filter(v => v !== undefined && v !== null);
            if (votos.length > 0) {
                const sorted = [...votos].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                medianVoto = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
                console.log(`Mediana de votos IH: ${(medianVoto * 100).toFixed(1)}%`);
            }

            recintosVisible = false;
            document.getElementById('toggle-recintos').checked = false;
            buildRecintosLayer(macroSelect.value, distritoSelect.value);
        })
        .catch(err => console.error('Error cargando recintos:', err));
}

function loadOTBs() {
    fetch('otbs.geojson')
        .then(response => response.json())
        .then(data => {
            data.features.forEach(f => {
                if (f.properties.distrito !== undefined && f.properties.distrito !== null) {
                    f.properties.distrito = toNumber(f.properties.distrito);
                }
            });
            otbsData = data;
            console.log('OTB cargadas:', otbsData.features.length);
            updateSelector(otbSelect, otbsData.features, otbNameProp);
            buildOTBLayer(macroSelect.value, distritoSelect.value);
            otbVisible = true;
            document.getElementById('toggle-otb').checked = true;
            updateLayerVisibility();
        })
        .catch(err => console.error('Error cargando OTB:', err));
}

// ---------- RECINTOS: SIN CAMBIOS ----------
function buildRecintosLayer(macro, distrito) {
    if (recintosLayer) {
        map.removeLayer(recintosLayer);
        recintosLayer = null;
    }
    if (!recintosData) return;

    let features = recintosData.features;
    const macroNorm = normalize(macro);
    const distritoNum = distrito !== 'ALL' ? toNumber(distrito) : null;

    if (macro !== 'ALL') {
        features = features.filter(f => normalize(f.properties.macro_ante) === macroNorm);
    }
    if (distrito !== 'ALL') {
        features = features.filter(f => f.properties.distrito === distritoNum);
    }

    const otbSelected = otbSelect.value;
    if (otbSelected !== 'ALL' && otbsData) {
        const otbFeature = otbsData.features.find(f => normalize(f.properties[otbNameProp]) === normalize(otbSelected));
        if (otbFeature) {
            const otbMacro = otbFeature.properties.macro_ante;
            const otbDistrito = toNumber(otbFeature.properties.distrito);
            if (otbMacro) {
                features = features.filter(f => normalize(f.properties.macro_ante) === normalize(otbMacro));
            }
            if (otbDistrito && otbDistrito !== 'ALL') {
                features = features.filter(f => f.properties.distrito === otbDistrito);
            }
        }
    }

    if (features.length === 0) {
        console.log('No hay recintos para el filtro actual');
        return;
    }

    recintosLayer = L.geoJSON(features, {
        pointToLayer: (feature, latlng) => {
            let coords = feature.geometry.coordinates;
            let lng, lat;
            if (feature.geometry.type === 'MultiPoint') {
                lng = coords[0][0];
                lat = coords[0][1];
            } else {
                lng = coords[0];
                lat = coords[1];
            }
            const pct = feature.properties.ganador_recinto_pct || 0;
            const radius = getQuantileRadius(pct);
            const color = getQuantileColor(pct);
            const opacity = document.getElementById('opacity-recintos').value / 100;

            return L.circleMarker([lat, lng], {
                pane: 'recintosPane',
                radius: radius,
                fillColor: color,
                color: '#fff',
                weight: 1,
                opacity: 0.8 * opacity,
                fillOpacity: 0.9 * opacity
            });
        },
        onEachFeature: (feature, layer) => {
            const nombre = feature.properties[recintoNameProp] || 'Recinto';
            const macro = feature.properties.macro_ante || 'N/D';
            const dist = feature.properties.distrito || 'N/D';
            const ganador = feature.properties.alcalde_partido_ganador_mun || 'N/D';
            const pct = feature.properties.ganador_recinto_pct || 0;
            layer.bindPopup(`
                <strong>${nombre}</strong><br>
                Macro: ${macro}<br>
                Distrito: ${dist}<br>
                Votos IH: ${(pct*100).toFixed(1)}%<br>
                Partido ganador: ${ganador}
            `);
            layer.bindTooltip(nombre, {
                permanent: false,
                direction: 'top',
                className: 'etiqueta-recinto',
                sticky: true,
                offset: [0, -8]
            });
            layer.on('mouseover', function() {
                if (otbsLayer) {
                    otbsLayer.eachLayer(function(l) {
                        l.closeTooltip();
                    });
                }
            });
        }
    });

    if (recintosVisible) {
        map.addLayer(recintosLayer);
        recintosLayer.bringToFront();
    }
    console.log('Recintos construidos:', features.length);
}

// ---------- OTB (CON RESALTADO PERSISTENTE) ----------
function buildOTBLayer(macro, distrito) {
    if (otbsLayer) {
        map.removeLayer(otbsLayer);
        otbsLayer = null;
    }
    if (!otbsData) return;

    let features = otbsData.features;
    const macroNorm = normalize(macro);
    const distritoNum = distrito !== 'ALL' ? toNumber(distrito) : null;

    if (macro !== 'ALL') {
        features = features.filter(f => normalize(f.properties.macro_ante) === macroNorm);
    }
    if (distrito !== 'ALL') {
        features = features.filter(f => f.properties.distrito === distritoNum);
    }

    updateSelector(otbSelect, features, otbNameProp);

    if (features.length === 0) {
        console.log('No hay OTB para el filtro actual');
        return;
    }

    const opacity = document.getElementById('opacity-otb').value / 100;

    otbsLayer = L.geoJSON(features, {
        style: { color: '#ec4899', weight: 1.5, fillOpacity: 0.15 * opacity, opacity: 0.85 * opacity },
        onEachFeature: (feature, layer) => {
            const nombre = feature.properties[otbNameProp] || 'OTB';
            const macro = feature.properties.macro_ante || 'N/D';
            const dist = feature.properties.distrito || 'N/D';
            const categoria = feature.properties.categoria || 'N/D';

            layer.bindPopup(`
                <strong>${nombre}</strong><br>
                Macro: ${macro}<br>
                Distrito: ${dist}<br>
                Categoría: ${categoria}
            `);

            layer.bindTooltip(nombre, {
                permanent: false,
                sticky: true,
                direction: 'auto',
                className: 'etiqueta-otb',
                offset: [0, -10],
                opacity: 0.9
            });

            layer.on('click', () => {
                // Al hacer clic, se selecciona la OTB
                const nombreNorm = normalize(nombre);
                otbSeleccionada = nombreNorm;
                otbSelect.value = nombre;

                // Aplicar estilo de resaltado directamente
                layer.setStyle({
                    color: '#fbbf24',
                    weight: 4,
                    fillColor: '#fbbf24',
                    fillOpacity: 0.3 * opacity,
                    opacity: 0.95 * opacity,
                    dashArray: null
                });
                layer.bringToFront();
                layer.openPopup();
                map.fitBounds(layer.getBounds());

                // Restaurar estilo de otras OTB (actualizarEtiquetas se encargará del resto)
                actualizarEtiquetas();
            });
        }
    });

    if (otbVisible) {
        map.addLayer(otbsLayer);
    }
    console.log('OTB construidas:', features.length);
    actualizarEtiquetas();
}

function rebuildSpatialLayers(macro, distrito) {
    buildRecintosLayer(macro, distrito);
    buildOTBLayer(macro, distrito);
    if (recintosLayer && recintosVisible) {
        recintosLayer.bringToFront();
    }
    if (otbsLayer && otbVisible) {
        otbsLayer.bringToBack();
    }
    if (distritoLayer) distritoLayer.bringToBack();
    if (macroLayer) macroLayer.bringToBack();
    actualizarEtiquetas();
}

function updateSelector(selectElement, features, nameProperty) {
    if (!selectElement) return;
    const currentValue = selectElement.value;
    const names = features.map(f => f.properties[nameProperty]).filter(Boolean);
    const unique = [...new Set(names)].sort();
    selectElement.innerHTML = '<option value="ALL">Todas</option>';
    unique.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n;
        opt.textContent = n;
        selectElement.appendChild(opt);
    });
    if (currentValue !== 'ALL' && unique.includes(currentValue)) {
        selectElement.value = currentValue;
    } else {
        selectElement.value = 'ALL';
    }
}

// ---------- RESALTADO DESDE SELECTORES ----------
function highlightOTB(nombre) {
    if (!otbsData) return;
    const nomNorm = normalize(nombre);
    const feature = otbsData.features.find(f => normalize(f.properties[otbNameProp]) === nomNorm);
    if (!feature) {
        console.warn(`OTB no encontrada en datos: ${nombre}`);
        return;
    }

    // Guardar selección
    otbSeleccionada = nomNorm;
    centerOnGeometry(feature.geometry);

    if (otbsLayer) {
        // Primero restaurar todas a su estado normal (actualizarEtiquetas luego ajustará)
        const opacity = document.getElementById('opacity-otb').value / 100;
        otbsLayer.eachLayer(layer => {
            const name = layer.feature?.properties[otbNameProp];
            if (name && normalize(name) === nomNorm) {
                // Aplicar resaltado inmediato
                layer.setStyle({
                    color: '#fbbf24',
                    weight: 4,
                    fillColor: '#fbbf24',
                    fillOpacity: 0.3 * opacity,
                    opacity: 0.95 * opacity,
                    dashArray: null
                });
                layer.bringToFront();
                layer.openPopup();
            } else {
                // Restaurar a estado normal (magenta) - actualizarEtiquetas lo ajustará
                layer.setStyle({
                    color: '#ec4899',
                    fillOpacity: 0.15 * opacity,
                    opacity: 0.85 * opacity
                });
                layer.closePopup();
                layer.closeTooltip();
            }
        });
        actualizarEtiquetas();
    }
}

function resetOTBHighlight() {
    otbSeleccionada = null;
    if (!otbsLayer) return;
    const opacity = document.getElementById('opacity-otb').value / 100;
    otbsLayer.eachLayer(layer => {
        layer.setStyle({
            color: '#ec4899',
            fillOpacity: 0.15 * opacity,
            opacity: 0.85 * opacity
        });
        layer.closePopup();
        layer.closeTooltip();
    });
    actualizarEtiquetas();
}

// ---------- REDIMENSIONAMIENTO ----------
window.addEventListener('resize', () => { if (map) map.invalidateSize(); });

// ---------- INICIO ----------
initDashboard();
