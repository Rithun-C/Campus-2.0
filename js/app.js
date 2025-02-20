// app.js - Core map functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map centered on your campus coordinates
    const map = L.map('map').setView([12.9336019,77.6923996], 17);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Make map globally accessible
    window.campusMap = map;
    
    // Initialize location tracking
    initLocationTracking(map);
    
    // Initialize custom POI layer
    initCustomPOIs(map);
    
    // Initialize AI search handler
    document.getElementById('search-btn').addEventListener('click', handleAIQuery);
});

// Custom Points of Interest initialization
function initCustomPOIs(map) {
    // Example campus POIs - replace with your actual data
    const pois = [
        { name: "Library", type: "study", coords: [12.9336019,77.6923996], 
          properties: { silent: true, computers: true, hours: "8am-10pm" } },
        // Add more campus locations with relevant properties
    ];
    
    // Create a layer for POIs
    window.poiLayer = L.layerGroup().addTo(map);
    
    // Add markers for each POI
    pois.forEach(poi => {
        const marker = L.marker(poi.coords)
            .bindPopup(`<b>${poi.name}</b><br>${poi.type}<br>
                        <button onclick="navigateToPOI(${poi.coords})">Navigate Here</button>`)
            .addTo(window.poiLayer);
            
        // Store POI data for AI queries
        marker.poiData = poi;
    });
    
    // Make POIs globally accessible for querying
    window.campusPOIs = pois;
}