let url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL.
d3.json(url).then(function (response) {
  // Once we get a response, send the response.features object to the createFeatures function.
  const quakeCount = response.metadata.count;
  console.log(quakeCount);
  for (let i = 0; i < quakeCount; i++) {
    // You may want to call createFeatures(data.features[i]) if needed for individual features.
    console.log(i);
  }
});