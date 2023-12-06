var map = L.map('map', {
    center: [44.15, -120.5542],
    zoom: 7
});

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var markerIds = [];
var currentMarker = null;
var voronoiLayer;


function calculatePriceDifference(money1, money2) {
    var price1 = parseFloat(money1);
    var price2 = parseFloat(money2);
    
    if (!isNaN(price1) && !isNaN(price2)) {
        var difference = price1 - price2;
        return difference.toFixed(2); // Round to two decimal places
    } else {
        return "Invalid price data";
    }
}


function compareItBB(firstLocationPrice) {
    console.log("IN FUNCTION pricey pricey price: " + firstLocationPrice);

    // Perform the logic to retrieve data and handle the click event for the second location
    fetch('https://raw.githubusercontent.com/pelaaaa/geog_371_lab_3/main/mcvoronoi.geojson')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var voronoiLayer = L.geoJson(data, {
                style: {
                    fillColor: 'transparent',
                    fillOpacity: 0.1,
                    stroke: true,
                    color: 'transparent'
                }
            }).addTo(map);

            // Add an event listener to get the second location price
            voronoiLayer.on('click', function (e) {
                var clickedPolygon = e.layer;
                var polygonId = clickedPolygon.feature.properties.id;
                var money = clickedPolygon.feature.properties.big_mac;
                console.log('big mac price in function: ' + money);

                var matchedPointId = markerIds.find(function (id) {
                    return id === polygonId;
                });

                if (matchedPointId) {
                    fetch('https://raw.githubusercontent.com/pelaaaa/geog_371_lab_3/main/oregon.geojson')
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (pointsData) {
                            var matchedPoint = pointsData.features.find(function (feature) {
                                return feature.id === matchedPointId;
                            });

                            if (matchedPoint) {
                                if (currentMarker) {
                                    map.removeLayer(currentMarker);
                                }

                                // Once you have the second location details, calculate the price difference
                                var secondLocationPrice = money; // Change this to the actual price of the second location
                                var priceDifference = calculatePriceDifference(firstLocationPrice, secondLocationPrice);
                                alert("Price Difference: " + priceDifference);
                                
                                // Remove the click event listener after comparison
                                map.off('click', secondLocationHandler);
                                map.closePopup();
                            }
                        });
                }
            });
        });
}


fetch('https://raw.githubusercontent.com/pelaaaa/geog_371_lab_3/main/oregon.geojson')
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        json.features.forEach(function (feature) {
            markerIds.push(feature.id);
        });
        console.log("markerIds: " + markerIds);
    });

fetch('https://raw.githubusercontent.com/pelaaaa/geog_371_lab_3/main/mcvoronoi.geojson')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var voronoiLayer = L.geoJson(data, {
            style: {
                fillColor: 'transparent',
                fillOpacity: 0.1,
                stroke: true,
                color: 'transparent'
            }
        }).addTo(map);

        voronoiLayer.on('click', function (e) {
            var clickedPolygon = e.layer;
            var polygonId = clickedPolygon.feature.properties.id;
			var money = clickedPolygon.feature.properties.big_mac;
			console.log('big mac price: '+money);

            var matchedPointId = markerIds.find(function (id) {
                return id === polygonId;
            });

            if (matchedPointId) {
                fetch('https://raw.githubusercontent.com/pelaaaa/geog_371_lab_3/main/oregon.geojson')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (pointsData) {
                        var matchedPoint = pointsData.features.find(function (feature) {
                            return feature.id === matchedPointId;
                        });

                        if (matchedPoint) {
                            if (currentMarker) {
                                map.removeLayer(currentMarker);
                            }

                            currentMarker = L.geoJson(matchedPoint, {
                                pointToLayer: function (feature, latlng) {
                                    var marker = L.marker(latlng);
                                    marker.bindPopup("I love me some Maccy D's!!!!!" + 
									"<br>Big Mac price: " + money + "<br>" +
									"<button onclick='compareItBB(\"" + money + "\")'>Compaaaaaare iiiit</button>"); 
                                    return marker;
                                }
                            }).addTo(map);
                        }
                    });
            }
        });
    });
