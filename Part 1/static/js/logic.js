// Declare the myMap variable in the global scope so it can be accessed by multiple functions
let myMap;
let timeStamp;
let quakeDepth;

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL.
d3.json(url).then(function (data) {
  // Once we get a response, send the response.features object to the createFeatures function.
  createFeatures(data.features);
  timeStamp = data.metadata.generated;
  console.log(`Last updated: ${new Date(timeStamp)}`);
});

function markerSize(quakeMagnitude) {
  return Math.sqrt(quakeMagnitude) * 20;
}

function markerColor(quakeDepth) {
  let color = "";
  if (quakeDepth > 90.00) {
    color = "red";
  } else if (quakeDepth >= 70.00 && quakeDepth <= 90.00) {
    color = "orange";
  } else if (quakeDepth >= 50.00 && quakeDepth < 70.00) {
    color = "goldenrod";
  } else if (quakeDepth >= 30.00 && quakeDepth < 50.00) {
    color = "yellow";
  } else if (quakeDepth >= 10.00 && quakeDepth < 30.00) {
    color = 'palegreen';
  } else if (quakeDepth >= -10.00 && quakeDepth < 10.00) {
    color = "greenyellow";
  } else {
    color = "black";
  }
  return color;
}

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  function onEachFeature(feature) {
    const latitude = feature.geometry.coordinates[1];
    const longitude = feature.geometry.coordinates[0];
    const depth = feature.geometry.coordinates[2];
    const magnitude = feature.properties.mag;

    if (isNaN(latitude) || isNaN(longitude) || isNaN(depth)) {
      console.error(`Invalid coordinates for feature: ${JSON.stringify(feature)}`);
      return;
    }
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Depth: ${depth}`);

    let circleMarker = L.circleMarker([latitude, longitude], {
      weight: 0.75,
      fillOpacity: 0.25,
      color: "black",
      fillColor: markerColor(depth), // Pass the depth value to markerColor
      radius: markerSize(magnitude)
    });
  
    circleMarker.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  
    // Add the circle marker to the earthquakes layer
    circleMarker.addTo(earthquakes);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.layerGroup(); // Create a layer group for the circle markers

  L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send the earthquakes layer to the createMap function.
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  let baseMaps =  street

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a legend control
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    // Add your legend HTML content to the div
    div.innerHTML = `
    <i style="background: lawngreen"></i><span>-10-9</span><br>
    <i style="background: yellowgreen"></i><span>10-29</span><br>
    <i style="background: gold"></i><span>30-49</span><br>
    <i style="background: orange"></i><span>50-69</span><br>
    <i style="background: darkorange"></i><span>70-0</span><br>
    <i style="background: red"></i><span>90+</span><br>
    `;
    return div;
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Add the legend to the map
  legend.addTo(myMap);

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
