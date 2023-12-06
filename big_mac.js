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


//compare prices of two locations 
function compareIt(firstLocationPrice, voronoiLayer) {
    console.log("IN FUNCTION pricey price: " + firstLocationPrice);
	voronoiLayer.on('click',function(e){
		var polyClick = e.layer;
		var polyId = polyClick.feature.properties.id;
		var dolla = polyClick.feature.properties.big_mac;
		console.log("second mclocation: "+dolla)
		
		alert("First location: "+firstLocationPrice+"<br>Second location: "+dolla)
	})
}


//fetch point data
fetch('https://raw.githubusercontent.com/pelaaaa/geog_371_lab_3/main/oregon.geojson')
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
		//push point ids to a list that will be referenced later
        json.features.forEach(function (feature) {
            markerIds.push(feature.id);
        });
        console.log("markerIds: " + markerIds);
    });

//fetch voronoi layer
fetch('https://raw.githubusercontent.com/pelaaaa/geog_371_lab_3/main/mcvoronoi.geojson')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
		//make voronoi transparent
        var voronoiLayer = L.geoJson(data, {
            style: {
                fillColor: 'transparent',
                fillOpacity: 0.1,
                stroke: true,
                color: 'transparent'
            }
        }).addTo(map);

		//click voronoi to get id
        voronoiLayer.on('click', function (e) {
            var clickedPolygon = e.layer;
            var polygonId = clickedPolygon.feature.properties.id;
			var money = clickedPolygon.feature.properties.big_mac;
			console.log('big mac price: '+money);
			
			//match voronoi id with point id
            var matchedPointId = markerIds.find(function (id) {
                return id === polygonId;
            });

			//add matched point to map
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
									//popup :)
                                    marker.bindPopup("I love me some Maccy D's!!!!!" + 
									"<br>Big Mac price: " + money + "<br>" +
									"<button onclick='compareIt(\"" + money + "\", voronoiLayer)'>Compaaaaaare iiiit</button>"); 
                                    return marker;
                                }
                            }).addTo(map);
                        }
                    });
            }
        });
    });
