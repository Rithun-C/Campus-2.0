// navigation.js - Handles routing and GPS tracking

// User's current position
let userPosition = null;
let navigationActive = false;
let currentRoute = null;

// Initialize location tracking
function initLocationTracking(map) {
    if ('geolocation' in navigator) {
        // Create marker for user location
        const userMarker = L.marker([0, 0]).addTo(map);
        window.userMarker = userMarker;
        
        // Start continuous location tracking
        navigator.geolocation.watchPosition(
            position => updateUserLocation(position, map, userMarker),
            error => console.error('Error getting location:', error),
            { enableHighAccuracy: true, maximumAge: 2000 }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Update user location marker and recalculate route if needed
function updateUserLocation(position, map, userMarker) {
    const { latitude, longitude } = position.coords;
    userPosition = [latitude, longitude];
    
    // Update marker position
    userMarker.setLatLng(userPosition);
    
    // If this is the first position update, center map
    if (!window.initialPositionSet) {
        map.setView(userPosition, 17);
        window.initialPositionSet = true;
    }
    
    // If navigation is active, check if we need to reroute
    if (navigationActive && currentRoute) {
        // Check distance from route path
        const deviation = checkRouteDeviation(userPosition, currentRoute);
        
        // If deviation is significant, recalculate route
        if (deviation > 20) { // meters
            calculateRoute(userPosition, currentRoute.destination);
        }
        
        // Update directions based on progress
        updateNavigationDirections(userPosition, currentRoute);
    }
}

// Calculate route between two points
function calculateRoute(start, end) {
    // For production: Use a routing API like OSRM, GraphHopper, or Mapbox Directions
    // For this example, we'll simulate routing with a direct line
    
    // Clear previous route if exists
    if (window.routeLayer) {
        window.campusMap.removeLayer(window.routeLayer);
    }
    
    // Draw a simple route line (replace with actual routing API results)
    const routeLine = L.polyline([start, end], {color: 'blue', weight: 5}).addTo(window.campusMap);
    window.routeLayer = routeLine;
    
    // Store current route information
    currentRoute = {
        path: [start, end], // Simplified - real routes have multiple points
        destination: end,
        startTime: new Date()
    };
    
    navigationActive = true;
    
    // Generate and display turn-by-turn directions
    generateDirections(currentRoute);
    
    return currentRoute;
}

// Navigate to a POI
function navigateToPOI(poiCoords) {
    if (!userPosition) {
        alert("Waiting for your current location...");
        return;
    }
    
    calculateRoute(userPosition, poiCoords);
}

// Generate turn-by-turn directions
function generateDirections(route) {
    // In a real app, these would be generated from routing API waypoints
    // This is a simplified example
    const directionsContainer = document.getElementById('directions');
    directionsContainer.innerHTML = `
        <h3>Directions</h3>
        <ol>
            <li>Head towards ${getCardinalDirection(route.path[0], route.path[1])}</li>
            <li>Continue for approximately ${calculateDistance(route.path[0], route.path[1])} meters</li>
            <li>You will arrive at your destination</li>
        </ol>
    `;
}

// Helper function to get cardinal direction
function getCardinalDirection(start, end) {
    const dx = end[1] - start[1];
    const dy = end[0] - start[0];
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    const directions = ['east', 'northeast', 'north', 'northwest', 
                        'west', 'southwest', 'south', 'southeast'];
    return directions[Math.round(angle / 45) % 8];
}

// Calculate approximate distance between two points (in meters)
function calculateDistance(point1, point2) {
    // Simple implementation of Haversine formula
    const R = 6371e3; // Earth radius in meters
    const φ1 = point1[0] * Math.PI/180;
    const φ2 = point2[0] * Math.PI/180;
    const Δφ = (point2[0]-point1[0]) * Math.PI/180;
    const Δλ = (point2[1]-point1[1]) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
}