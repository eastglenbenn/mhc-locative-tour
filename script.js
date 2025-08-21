// Center the map over the campus
const map = L.map('map').setView([50.0175, -110.6854], 18);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Campus locations: Library + S-Wing
const campusLocations = [
  {
    name: "Vera Bracken Library",
    lat: 50.017308766020136,
    lon: -110.68585235309236,
    description: "The Vera Bracken Library — study space, printing, and academic support."
  },
  {
    name: "S-Wing",
    lat: 50.01728800422969,
    lon: -110.68513617457609,
    description: "You can find your instructors and advisors for Education, Social Sciences, and Humanities here."
  }
];

// Proximity radius in meters
const proximityRadius = 30;

// Display markers and circles
campusLocations.forEach(loc => {
  L.marker([loc.lat, loc.lon])
    .addTo(map)
    .bindPopup(`<strong>${loc.name}</strong><br>${loc.description}`);

  L.circle([loc.lat, loc.lon], {
    radius: proximityRadius,
    color: 'blue',
    fillOpacity: 0.05
  }).addTo(map);
});

// Track user and check proximity
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (pos) => {
      const userLat = pos.coords.latitude;
      const userLon = pos.coords.longitude;

      // Optional user marker
      L.circleMarker([userLat, userLon], {
        radius: 6,
        color: 'green',
        fillColor: '#0f0',
        fillOpacity: 0.9
      }).addTo(map).bindPopup("You're here").openPopup();

      // Trigger popups when within range
      campusLocations.forEach(loc => {
        const distance = map.distance([userLat, userLon], [loc.lat, loc.lon]);
        if (distance <= proximityRadius) {
          L.popup()
            .setLatLng([loc.lat, loc.lon])
            .setContent(`<strong>${loc.name}</strong><br>${loc.description}`)
            .openOn(map);
        }
      });
    },
    (err) => console.warn("Geolocation error:", err),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );
} else {
  alert("Geolocation is not supported by your browser.");
}
