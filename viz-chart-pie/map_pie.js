//----------------------------//
// Global Vars                //
//----------------------------//
var map1;
var chart1;
var chart2;
var countyMedianData;

// Setting up basemaps with tiles from <http://maps.stamen.com>
var BL_stamenLite = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'),
	BL_stamenTerrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg');

var baseLayers_Left = {
	"BaseMap: Terrain": BL_stamenTerrain,
	"BaseMap: Simple": BL_stamenLite
};

//----------------------------//
// The Map                    //
//----------------------------//
var center = [36.760185, -119.65];
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
var controlLayers = L.control.layers(baseLayers_Left, null, {
	collapsed: false
}).addTo(map1);
map1.attributionControl.addAttribution('Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors');

//-----------------------------------------------------//
// Adding GeoJson layer from data, load it with jQuery //
// Setting up bounding actions/events  		           //
//-----------------------------------------------------// 
$.getJSON("../common/layers/FresnoMSSA.geojson", function (data) {
	geoJsonLayer = L.geoJson(
		data, {
			// setup map visual styling 
			style: style_map1,
			// setup interactions with features
			onEachFeature: onEachFeature
		}).addTo(map1);
	controlLayers.addOverlay(geoJsonLayer, 'Fresno MSSA');

	// Create the default data from layer (County Median)	
	countyMedianData = $.grep(data.features, function (MSSA, i) {
		return MSSA.properties.SRA == 99;
	});

	// Build the charts with County median data
	init_Charts(countyMedianData[0]);
});

// Define the style of the Polygon
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

// Define the style of the Polygon when mouseover an area
function style_map1_mouseover() {
	return {
		fillColor: "red",
		weight: 1,
		opacity: 0.9,
		color: 'White',
		dashArray: '3',
		fillOpacity: 0.3
	};
}

// Define the function to connect the map and the charts
function onEachFeature(feature, layer) {
	// Design the PopUp for the map
	var customPopup = 'SRA ID : <b>' + feature.properties.SRA + '</b><hr>' +
		'SRA NAME : <b>' + feature.properties.NAME + '</b>';
	
	var customOptions = {
		'maxWidth': '300',
		'width': '150',
		'className': 'custom-popup' // to use the cutomized style in style.css
	}
	layer.bindPopup(customPopup, customOptions)

	// Connect map and chart on mouseover events
	layer.on('mouseover', function () {
		this.setStyle(style_map1_mouseover());
		updateChart(feature);
	});
	// Connect map and chart on mouseout events
	layer.on('mouseout', function () {
		this.setStyle(style_map1());
		updateChart(countyMedianData[0]);
	});
}

//-----------------------------//
// Construct the Pies
//-----------------------------//
function init_Charts(data) {
	// Build chart 1 at '#pie1' with County Median data
	chart1 = c3.generate({
		bindto: '#pie1',
		data: {
			columns: [
			['Data 1', data.properties.V1_G1],
			['Data 2', data.properties.V1_G2],
			['Data 3', data.properties.V1_G3],
			['Data 4', data.properties.V1_G4],
			['Data 5', data.properties.V1_G5],
        ],
			type: 'donut',
			onclick: function (d, i) {},
			onmouseover: function (d, i) {},
			onmouseout: function (d, i) {}
		},
		donut: {
			title: "County Median"
		}
	});

	// Build chart 2 at '#pie2' with County Median data
	chart2 = c3.generate({
		bindto: '#pie2',
		data: {
			columns: [
			['Data 1', data.properties.V2_G1],
			['Data 2', data.properties.V2_G2],
			['Data 3', data.properties.V2_G3],
			['Data 4', data.properties.V2_G4],
			['Data 5', data.properties.V2_G5]
        ],
			type: 'donut',
			onclick: function (d, i) {},
			onmouseover: function (d, i) {},
			onmouseout: function (d, i) {}
		},
		donut: {
			title: "County Median"
		}
	});
}

//----------------------------------------//
// Function to update chart with new data
//----------------------------------------//
function updateChart(feature) {
	// Update data with the mouseover area
	chart1.load({
		columns: [['Data 1', feature.properties.V1_G1],
				  ['Data 2', feature.properties.V1_G2],
				  ['Data 3', feature.properties.V1_G3],
				  ['Data 4', feature.properties.V1_G4],
				  ['Data 5', feature.properties.V1_G5]]
	});
	// Update text in donut
	d3.select('#pie1 .c3-chart-arcs-title').node().innerHTML = feature.properties.NAME;

	// Update data with the mouseover area
	chart2.load({
		columns: [['Data 1', feature.properties.V2_G1],
				  ['Data 2', feature.properties.V2_G2],
				  ['Data 3', feature.properties.V2_G3],
				  ['Data 4', feature.properties.V2_G4],
				  ['Data 5', feature.properties.V2_G5]]
	});
	// Update text in donut
	d3.select('#pie2 .c3-chart-arcs-title').node().innerHTML = feature.properties.NAME;;
}