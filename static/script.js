// Initialize the map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];
let selectedArea = null;

// Handle map clicks
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Add new marker
    const marker = L.marker([lat, lng]).addTo(map);
    markers.push(marker);
    
    // Update form fields
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);
});

document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        area: parseFloat(document.getElementById('area').value)
    };

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        // Display results
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>Biomass Prediction Results</h3>
            <div class="biomass-info">
                <div class="info-card">
                    <h4>Total Biomass</h4>
                    <p>${result.totalBiomass} tonnes</p>
                </div>
                <div class="info-card">
                    <h4>Carbon Storage</h4>
                    <p>${result.carbonStorage} tonnes CO₂</p>
                </div>
                <div class="info-card">
                    <h4>Biomass Density</h4>
                    <p>${result.biomassDensity} tonnes/ha</p>
                </div>
            </div>
        `;

        // Draw the predicted area on the map
        if (selectedArea) {
            map.removeLayer(selectedArea);
        }
        
        // Create a circle to represent the predicted area
        const radius = Math.sqrt(formData.area * 10000 / Math.PI);
        selectedArea = L.circle([formData.latitude, formData.longitude], {
            radius: radius,
            color: 'green',
            fillColor: '#3f3',
            fillOpacity: 0.3
        }).addTo(map);

    } catch (error) {
        console.error('Error:', error);
    }
});