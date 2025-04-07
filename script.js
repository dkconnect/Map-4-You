
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center of India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let geojsonLayer;
fetch('vertopal.com_Indian_States.json')
    .then(response => response.json())
    .then(data => {
        geojsonLayer = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });

const stateData = {};

function style(feature) {
    const value = stateData[feature.properties.NAME_1] || 0;
    return {
        fillColor: getColor(value),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

function getColor(value) {
    return value > 1000 ? '#800026' :
           value > 500  ? '#BD0026' :
           value > 200  ? '#E31A1C' :
           value > 100  ? '#FC4E2A' :
           value > 50   ? '#FD8D3C' :
           value > 20   ? '#FEB24C' :
           value > 10   ? '#FED976' :
                          '#FFEDA0';
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: (e) => {
            layer.setStyle({ weight: 3, color: '#666' });
            layer.bindPopup(`${feature.properties.NAME_1}: ${stateData[feature.properties.NAME_1] || 0}`).openPopup();
        },
        mouseout: (e) => {
            geojsonLayer.resetStyle(layer);
        }
    });
}

document.getElementById('data-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const state = document.getElementById('state').value;
    const value = parseInt(document.getElementById('value').value);
    stateData[state] = value;
    geojsonLayer.setStyle(style);
    document.getElementById('data-form').reset();
});
