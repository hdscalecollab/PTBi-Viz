//--------------------------//
//    Global variables       
//--------------------------//
var map1;

var BL_stamenLite3 = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'),
	BL_stamenTerrain3 = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg');

var baseLayers = {
	"BaseMap: Terrain": BL_stamenTerrain3,
	"BaseMap: Simple": BL_stamenLite3
};

// Define the Circle marker for Points
var geojsonMarker = {
	radius: 8,
	fillColor: "#ff4b6f",
	color: "#000",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.8
};

// Set up map basics
var center = [36.660185, -119.370596];
var init_zoom = 8;
var minZoom = 7;
var maxZoom = 18;

//------------------------------------------//
//  Set up layers group and load the layers
//------------------------------------------//

// Set up layers in groups
var groups = {
	polygonGroup: new L.LayerGroup(),
	pointGroup: new L.LayerGroup(),
};

// Define the layers into groups
var groupedOverlays = {
	"Polygon": {
		"myPolygon": groups.polygonGroup,
		//"myPolygon1": groups.polygonGroup,
		//"myPolygon2": groups.polygonGroup,
	},
	"Point": {
		"myPoints": groups.pointGroup,
		//"myPoints1": groups.pointGroup,
		//"myPoints2": groups.pointGroup,
	}
};

// Read polygon geojson and add to the polygonGroup
$.getJSON("../common/layers/FresnoMSSA.geojson", function (data) {
	// Add to Map group
	layer_polygon = L.geoJson(
		data, {
			style: style_map1,
		}).addTo(groups.polygonGroup);
	
	// Send the polygon layer to the back as default
	layer_polygon.bringToBack();
	
	// Make sure the polygon layer is on in the back when layers are added/removed
	map1.on("overlayadd", function (event) {
		layer_polygon.bringToBack();
	});
})

// Read point geojson and add to the pointGroup
$.getJSON("../common/layers/FresnoPoints.geojson", function (data) {
	// Add to Map group
	layer_point = L.geoJson(
		data, {
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, geojsonMarker);
			},
			onEachFeature: onEachFeature_Points
		}).addTo(groups.pointGroup);
	
	// Make sure the point layer is on top when layers are added/removed
	map1.on("overlayadd", function (event) {
		layer_point.bringToFront();
	});
})

//--------------------------//
// Setting up the map
//--------------------------//

// Set up the basemap
map1 = L.map('map1', {
	center: center,
	zoom: init_zoom,
	minZoom: minZoom,
	maxZoom: maxZoom,
	layers: [baseLayers["BaseMap: Simple"], groups.polygonGroup, groups.pointGroup]
})
// Add groupLayer Control
L.control.groupedLayers(baseLayers, groupedOverlays, {
	collapsed: false
}).addTo(map1);
// Add map attribution Control
map1.attributionControl.addAttribution('Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors');

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

// Define the action when interact with the Point layer
function onEachFeature_Points(feature, layer) {
	// Design the PopUp for the map
	var customPopup = 'Point ID : <b>' + feature.properties.ID + '</b><hr>' +
		'Var 5 : <b>' + feature.properties.Var5 + '</b>';

	var customOptions = {
		'maxWidth': '300',
		'width': '150',
		'className': 'popupCustom'
	}

	layer.bindPopup(customPopup, customOptions)
	// Update the table when a point is click
	layer.on({
		click: updateTable_Point
	});
}


//---------------------------------------//
// Function to update and reset the table 
//---------------------------------------//

// Update the table when a point is click
function updateTable_Point(e) {
	$('#table').bootstrapTable("destroy");

	var layer = e.target;
	var properties = layer.feature.properties;
	var tableData = [{
		att: "ID",
		val: properties.ID,
    }, {
		att: "Var2",
		val: properties.Var2,
    }, {
		att: "Var3",
		val: properties.Var3
    }, {
		att: "Var4",
		val: properties.Var4
    }, {
		att: "Var5",
		val: properties.Var5
    }];
	$('#table').bootstrapTable({
		data: tableData,
		formatNoMatches: function noMatches() {
			return '';
		}
	});

	// Reset the table title
	$("#dataTable_title").fadeOut("fast", function () {
		$(this).text("Selected Point : " + properties.ID).fadeIn("fast");
	});
	// Reset the text below the table
	$("#dataTable_empty_text").text("");
}

// Create a function to reset the table
$("#table_clean").click(function () {
	cleanDataTable();
});

// Define the actions to clean/replace text
function cleanDataTable() {
	$("table").bootstrapTable('removeAll');
	$("#dataTable_title").text("Selected Point : ");
	$("#dataTable_empty_text").text("[ click on a Point to see additional data ]");
}