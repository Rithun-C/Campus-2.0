// ai-integration.js - Handles natural language queries about the campus

// Process AI query from the search bar
function handleAIQuery() {
    const queryInput = document.getElementById('ai-query');
    const query = queryInput.value.toLowerCase().trim();
    
    if (!query) return;
    
    // Process query and find matching locations
    const results = processNaturalLanguageQuery(query);
    
    if (results.length > 0) {
        // Display results and offer navigation
        displayQueryResults(results);
    } else {
        alert("Sorry, I couldn't find anything matching your query.");
    }
}

// Process natural language query against POI database
function processNaturalLanguageQuery(query) {
    // For production: Use a proper NLP service or library
    // This is a simplified keyword matching implementation
    
    const keywords = {
        "silent": poi => poi.properties.silent === true,
        "quiet": poi => poi.properties.silent === true,
        "study": poi => poi.type === "study",
        "food": poi => poi.properties.food === true,
        "eat": poi => poi.properties.food === true,
        "computer": poi => poi.properties.computers === true,
        "social": poi => poi.type === "social" || poi.properties.events === true
    };
    
    // Extract relevant keywords from query
    const matchedKeywords = Object.keys(keywords).filter(key => query.includes(key));
    
    if (matchedKeywords.length === 0) return [];
    
    // Find POIs that match all extracted keywords
    return window.campusPOIs.filter(poi => 
        matchedKeywords.every(keyword => keywords[keyword](poi))
    );
}

// Display query results to user
function displayQueryResults(results) {
    // Clear any previous results
    if (window.resultMarkers) {
        window.resultMarkers.forEach(marker => window.campusMap.removeLayer(marker));
    }
    window.resultMarkers = [];
    
    // Display results on map with distinctive markers
    results.forEach(poi => {
        const marker = L.marker(poi.coords, {
            icon: L.divIcon({
                className: 'result-marker',
                html: `<div class="pulse-marker">${poi.name.charAt(0)}</div>`,
                iconSize: [30, 30]
            })
        }).addTo(window.campusMap);
        
        marker.bindPopup(`
            <h3>${poi.name}</h3>
            <p>Type: ${poi.type}</p>
            <p>Hours: ${poi.properties.hours || 'Not specified'}</p>
            <button onclick="navigateToPOI([${poi.coords}])">Navigate Here</button>
        `).openPopup();
        
        window.resultMarkers.push(marker);
    });
    
    // Fit map to show all results
    if (results.length > 1) {
        const group = new L.featureGroup(window.resultMarkers);
        window.campusMap.fitBounds(group.getBounds().pad(0.2));
    } else {
        window.campusMap.setView(results[0].coords, 18);
    }
    
    // Also display in directions panel
    const directionsPanel = document.getElementById('directions');
    directionsPanel.innerHTML = `
        <h3>Found ${results.length} matching location${results.length > 1 ? 's' : ''}</h3>
        <ul class="results-list">
            ${results.map(poi => `
                <li>
                    <strong>${poi.name}</strong>
                    <button onclick="navigateToPOI([${poi.coords}])">Navigate</button>
                </li>
            `).join('')}
        </ul>
    `;
}