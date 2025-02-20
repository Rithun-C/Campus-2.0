// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// Campus POI database (in a real app, this would be in a database)
const campusPOIs = [
        { 
          name: "Library", 
          type: "study", 
          coords: [12.9336019,77.6923996], 
          properties: { 
            silent: true, 
            computers: true, 
            wifi: true, 
            printers: true,
            coffee: true,
            hours: "8am-10pm",
            floors: 3,
            accessibility: true
          }
        }
];

// AI query endpoint
app.post('/api/query', (req, res) => {
    const query = req.body.query.toLowerCase();
    
    // Simple keyword matching - expand this for better AI capabilities
    const results = campusPOIs.filter(poi => {
        // Implement matching logic here
        return Object.entries(poi.properties).some(([key, value]) => 
            value === true && query.includes(key)
        ) || query.includes(poi.type);
    });
    
    res.json({ results });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});