// Link to get the geojson data.
var url = "../Heroku_Deployment/Starter/static/data/mapdata.geojson";

// Grabbing our GeoJSON data.
d3.json(url, function(data) {
  console.log(data)
// Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

  function createFeatures(storeData) {

    // Define a function we want to run once for each feature in the features array
    // Give the feature a popup describing the name and revenue of the store
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties["Store Name"] +
        "</h3><hr><p>Revenue: $" + feature.properties.Revenue + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the storeData object 
    // Run the onEachFeature function once for each piece of data in the array
    var stores = L.geoJSON(storeData, {
      onEachFeature: onEachFeature
    });
  
    // Send store layer to the createMap function
    createMap(stores);
  }
  
  function createMap(stores) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Stores: stores
    };
  
    // Create our map  and store layer to display on load
    var myMap = L.map("map", {
      center: [
        40.00, -7.43
      ],
      zoom: 3,
      layers: [streetmap, stores],
      fullscreenControl: true
    });
  

    // //Add MapCenterCoord that allows touch/mobile friendly navigation
    L.control.mapCenterCoord({
      latlngFormat: 'DM',
      latlngDesignators: true
    }).addTo(myMap);

    // Create a layer control, pass in our baseMaps/overlayMaps, add layer control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  



