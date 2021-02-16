//use a variable to call in the json
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl, function (data) {
  //Use the function to make the size of the magnitude visible/ larger 
  function radiusSize(Magnitude) {
    if (Magnitude === 0) {
      return 1;
    }
    return Magnitude * 4;
  };
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.5,
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: radiusSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  //Create a function to choose the color for the fill 
  function chooseColor(depth) {
    switch (true) {
      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  //pull coordinates using latlng  for the markers 
  var earthquakes = L.geoJSON(data, {
    pointToLayer: function (data, latlng) {
      // console.log(latlng)
      return L.circleMarker(latlng);
    },



    style: styleInfo,
    //use on the eachfeature to go grab place,time and maginitude for the popup bubble for the markers 
    onEachFeature: function (feature, layer) {


      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "Magnitude: " + feature.properties.mag + "</p>" + "Depth: " + feature.geometry.coordinates[2] + "</p>");

    }
  });
  //Create tile layers/ maps

  var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });



  var baseMaps = {
    "Gray Map": graymap,
    "Satellite View": satellitemap,
    "Outdoor View": outdoors
  };


  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create the map and assign it a variable 
  var myMap = L.map("map", {
    center: [
      40.52, 34.34
    ],
    zoom: 3,
    layers: [graymap, satellitemap, outdoors, earthquakes]
  });

  //Filter/ control layers 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  // Function use to assign colors for legend 
  function legendColor(depth) {
    switch (true) {
      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  //Create the legend
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),

      categories = [10, 30, 50, 70, 90,],
      labels = ['-10-10', '-10-30', '30-50', '50-70', '70-90'];



    for (var i = 0; i < categories.length; i++) {
      div.innerHTML +=

        '<i style="background:' + legendColor(categories[i] + 1) + '"></i> ' +
        (categories[i] + categories[i + 1] ? ' ' + labels[i + 1] + '<br>' : ' 90 +');
    }


    return div;
  };
  //Add To map
  legend.addTo(myMap);

});
