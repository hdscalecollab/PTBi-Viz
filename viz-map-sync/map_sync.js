//----------------------------//
////    Global Vars         ////
//----------------------------//
var map1;
var map2;

// Setting up basemaps with tiles from <http://maps.stamen.com>
var BL_stamenLite = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'),
	BL_stamenTerrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg'),
	BL_stamenLite_1 = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'),
	BL_stamenTerrain_1 = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg');

// Grouping basemaps for the leaflet control
// The basemaps are grouped separately for each map
var baseLayers_Left = {
	"BaseMap: Terrain": BL_stamenTerrain,
	"BaseMap: Simple": BL_stamenLite
};

var baseLayers_Right = {
	"BaseMap: Simple": BL_stamenLite_1,
	"BaseMap: Terrain": BL_stamenTerrain_1
};


//----------------------------//
//        The Map             //
//----------------------------//

var center = [36.760185, -119.770596];
var init_zoom = 8;
var minZoom = 7;
var maxZoom = 18;

//---------------------------------------//
// Setting up basemaps and tile layers
//---------------------------------------//

map1 = L.map("map1", {
	center: center,
	zoom: init_zoom,
	minZoom: minZoom,
	maxZoom: maxZoom,
	layers: [BL_stamenTerrain, BL_stamenLite]
})
var controlLayers_left = L.control.layers(baseLayers_Left, null, {
	collapsed: false
}).addTo(map1);
map1.attributionControl.setPrefix("\u00A0");

map2 = L.map("map2", {
	center: center,
	zoom: init_zoom,
	minZoom: minZoom,
	maxZoom: maxZoom,
	layers: [BL_stamenLite_1, BL_stamenTerrain_1]
})
var controlLayers_right = L.control.layers(baseLayers_Right, null, {
	collapsed: false
}).addTo(map2);
map2.attributionControl.addAttribution('Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors');

//----------------------------------------------------//
// Adding GeoJson layer from data, load it with jQuery
// Setting up bounding actions/events
//----------------------------------------------------// 
$.getJSON("../common/layers/FresnoMSSA.geojson", function (data) {
	console.log("Loading Layers")
	// Add to Map 1 (left)
	geoJsonLayer1 = L.geoJson(
		data, {
			// setup map visual styling 
			style: style_map1,
			// setup interactions with features
			onEachFeature: onEachFeature
		}).addTo(map1);
	controlLayers_left.addOverlay(geoJsonLayer1, 'Fresno MSSA');

	// Add to Map 2 (right)
	geoJsonLayer2 = L.geoJson(
		data, {
			style: style_map2,
			onEachFeature: onEachFeature
		}).addTo(map2);
	controlLayers_right.addOverlay(geoJsonLayer2, 'Fresno MSSA');
});

/// Sync the Maps ///    
map1.sync(map2);
map2.sync(map1);


//----------------------------//
//// Function for the Maps  ////
//----------------------------//
function onEachFeature(feature, layer) {
	layer.bindPopup('<h4>MSSA name is: </h4>' + feature.properties.NAME);
}

function style_map1(feature) {
	return {
		fillColor: "blue",
		weight: 1,
		opacity: 0.9,
		color: 'White',
		dashArray: '3',
		fillOpacity: 0.3
	};
}

function style_map2(feature) {
	return {
		fillColor: "orange",
		weight: 1,
		opacity: 0.9,
		color: 'White',
		dashArray: '3',
		fillOpacity: 0.4
	};
}