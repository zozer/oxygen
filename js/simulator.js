var myFirstOpenSlider = 0


function mySidebarToggle() {
	if (document.getElementById('sidebarToggleOpen').classList.contains("d-none")) {
		//console.log("SIDEBAR IS CLOSED")
		document.getElementById('sidebarToggleOpen').classList.remove("d-none");
		document.getElementById('sidebarToggleClose').classList.add("d-none");
		
		document.getElementById('resetSimulation').classList.add("d-none");
		document.getElementById('parameters').classList.add("d-none");
		document.getElementById('advancedparameters').classList.add("d-none");
		
		
	} else {
		//console.log("SIDEBAR IS OPEN")
		document.getElementById('sidebarToggleOpen').classList.add("d-none");
		document.getElementById('sidebarToggleClose').classList.remove("d-none");
		
		document.getElementById('resetSimulation').classList.remove("d-none");
		document.getElementById('parameters').classList.remove("d-none");
		document.getElementById('advancedparameters').classList.remove("d-none");
		
		$('#slider1').slider('refresh');
		$('#slider2').slider('refresh');		  
		$('#slider3').slider('refresh');
		$('#slider4').slider('refresh');
		$('#slider5').slider('refresh');
		$('#slider6').slider('refresh');		  
		$('#slider7').slider('refresh');
		$('#slider8').slider('refresh');		  
		$('#slider9').slider('refresh');
		$('#slider10').slider('refresh');
		
		$("#slider1").slider('setValue', Slider1Val.value);
		$("#slider2").slider('setValue', Slider2Val.value);
		$("#slider3").slider('setValue', Slider3Val.value);
		$("#slider4").slider('setValue', Slider4Val.value);
		$("#slider5").slider('setValue', Slider5Val.value);
		$("#slider6").slider('setValue', Slider6Val.value);
		$("#slider7").slider('setValue', Slider7Val.value);
		$("#slider8").slider('setValue', Slider8Val.value);
		$("#slider9").slider('setValue', Slider9Val.value);
		$("#slider10").slider('setValue', Slider10Val.value);
		
	}
}

// SLIDERS
$('#slider1').slider({
	id: 'altitude',
	min: 0,
	max: 10000,
	step: 100,
	value: 5000,
	rangeHighlights: [{ "start": 0, "end": 10000, "class": "range1" },
]});          
$("#slider1").slider();
$("#slider1").on("change", function(changeEvt) {
	const obj = changeEvt.value
	$("#Slider1Val").val(obj.newValue);
	
	if (document.getElementById('Slider1Val').value != 0) {
		document.getElementById('Slider1Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider1Val').classList.remove("bg-input-changed");
	}
});
// OLD METHOD THAT DID NOT UPDATE SLIDER POSITION
/*$("#slider1").on("slide", function(slideEvt) {
	$("#Slider1Val").val(slideEvt.value);
	
	if (document.getElementById('Slider1Val').value != 0) {
		document.getElementById('Slider1Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider1Val').classList.remove("bg-input-changed");
	}
	
});*/ 
function change_slider1() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider1Val.value <= parseInt(document.getElementById("slider1").getAttribute("data-slider-min"))) {
		$("#slider1").slider('setValue', parseInt(document.getElementById("slider1").getAttribute("data-slider-min")));
		$("#Slider1Val").val(parseInt(document.getElementById("slider1").getAttribute("data-slider-min")));
	} else if (Slider1Val.value >= parseInt(document.getElementById("slider1").getAttribute("data-slider-max"))) {
		$("#slider1").slider('setValue', parseInt(document.getElementById("slider1").getAttribute("data-slider-max")));
		$("#Slider1Val").val(parseInt(document.getElementById("slider1").getAttribute("data-slider-max")));
	} else {
		$("#slider1").slider('setValue', Slider1Val.value);
	}
	
	if (document.getElementById('Slider1Val').value != 0) {
		document.getElementById('Slider1Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider1Val').classList.remove("bg-input-changed");
	}
		
}	



$('#slider2').slider({
	id: 'metabolic',
	min: 100,
	max: 550,
	step: 10,
	value: 250,
	rangeHighlights: [{ "start": 250, "end": 400, "class": "range1" },
]});          
$("#slider2").slider();
$("#slider2").on("change", function(changeEvt2) {
	const obj = changeEvt2.value
	$("#Slider2Val").val(obj.newValue);
	
	if (document.getElementById('Slider2Val').value != 250) {
		document.getElementById('Slider2Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider2Val').classList.remove("bg-input-changed");
	}
	
});
function change_slider2() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider2Val.value <= parseInt(document.getElementById("slider2").getAttribute("data-slider-min"))) {
		$("#slider2").slider('setValue', parseInt(document.getElementById("slider2").getAttribute("data-slider-min")));
		$("#Slider2Val").val(parseInt(document.getElementById("slider2").getAttribute("data-slider-min")));
	} else if (Slider2Val.value >= parseInt(document.getElementById("slider2").getAttribute("data-slider-max"))) {
		$("#slider2").slider('setValue', parseInt(document.getElementById("slider2").getAttribute("data-slider-max")));
		$("#Slider2Val").val(parseInt(document.getElementById("slider2").getAttribute("data-slider-max")));
	} else {
		$("#slider2").slider('setValue', Slider2Val.value);
	}	
	
	if (document.getElementById('Slider2Val').value != 250) {
		document.getElementById('Slider2Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider2Val').classList.remove("bg-input-changed");
	}
	
}
		


$('#slider3').slider({
	id: 'respiratory',
	min: 0,
	max: 30,
	step: 1,
	value: 12,
	rangeHighlights: [{ "start": 10, "end": 20, "class": "range1" },
]});          
$("#slider3").slider();
$("#slider3").on("change", function(changeEvt3) {
	const obj = changeEvt3.value
	$("#Slider3Val").val(obj.newValue);
	
	if (document.getElementById('Slider3Val').value != 12) {
		document.getElementById('Slider3Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider3Val').classList.remove("bg-input-changed");
	}
	
});
function change_slider3() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider3Val.value <= parseInt(document.getElementById("slider3").getAttribute("data-slider-min"))) {
		$("#slider3").slider('setValue', parseInt(document.getElementById("slider3").getAttribute("data-slider-min")));
		$("#Slider3Val").val(parseInt(document.getElementById("slider3").getAttribute("data-slider-min")));
	} else if (Slider3Val.value >= parseInt(document.getElementById("slider3").getAttribute("data-slider-max"))) {
		$("#slider3").slider('setValue', parseInt(document.getElementById("slider3").getAttribute("data-slider-max")));
		$("#Slider3Val").val(parseInt(document.getElementById("slider3").getAttribute("data-slider-max")));
	} else {
		$("#slider3").slider('setValue', Slider3Val.value);
	}
	
	if (document.getElementById('Slider3Val').value != 12) {
		document.getElementById('Slider3Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider3Val').classList.remove("bg-input-changed");
	}
		
}


$('#slider4').slider({
	id: 'tidalvolume',
	min: 200,
	max: 800,
	step: 5,
	value: 475,
	rangeHighlights: [{ "start": 450, "end": 550, "class": "range1" },
]});          
$("#slider4").slider();
$("#slider4").on("change", function(changeEvt4) {
	const obj = changeEvt4.value
	$("#Slider4Val").val(obj.newValue);
	
	if (document.getElementById('Slider4Val').value != 475) {
		document.getElementById('Slider4Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider4Val').classList.remove("bg-input-changed");
	}
	
});
function change_slider4() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider4Val.value <= parseInt(document.getElementById("slider4").getAttribute("data-slider-min"))) {
		$("#slider4").slider('setValue', parseInt(document.getElementById("slider4").getAttribute("data-slider-min")));
		$("#Slider4Val").val(parseInt(document.getElementById("slider4").getAttribute("data-slider-min")));
	} else if (Slider4Val.value >= parseInt(document.getElementById("slider4").getAttribute("data-slider-max"))) {
		$("#slider4").slider('setValue', parseInt(document.getElementById("slider4").getAttribute("data-slider-max")));
		$("#Slider4Val").val(parseInt(document.getElementById("slider4").getAttribute("data-slider-max")));
	} else {
		$("#slider4").slider('setValue', Slider4Val.value);
	}
	
	if (document.getElementById('Slider4Val').value != 475) {
		document.getElementById('Slider4Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider4Val').classList.remove("bg-input-changed");
	}
		
}



$('#slider5').slider({
	id: 'cardiacoutput',
	min: 2,
	max: 10,
	step: 0.5,
	value: 6.5,
	rangeHighlights: [{ "start": 4, "end": 8, "class": "range1" },
]});          
$("#slider5").slider();
$("#slider5").on("change", function(changeEvt5) {
	const obj = changeEvt5.value
	$("#Slider5Val").val(obj.newValue);
	
	if (document.getElementById('Slider5Val').value != 6.5) {
		document.getElementById('Slider5Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider5Val').classList.remove("bg-input-changed");
	}
	
});
function change_slider5() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider5Val.value <= parseInt(document.getElementById("slider5").getAttribute("data-slider-min"))) {
		$("#slider5").slider('setValue', parseInt(document.getElementById("slider5").getAttribute("data-slider-min")));
		$("#Slider5Val").val(parseInt(document.getElementById("slider5").getAttribute("data-slider-min")));
	} else if (Slider5Val.value >= parseInt(document.getElementById("slider5").getAttribute("data-slider-max"))) {
		$("#slider5").slider('setValue', parseInt(document.getElementById("slider5").getAttribute("data-slider-max")));
		$("#Slider5Val").val(parseInt(document.getElementById("slider5").getAttribute("data-slider-max")));
	} else {
		$("#slider5").slider('setValue', Slider5Val.value);
	}
	
	if (document.getElementById('Slider5Val').value != 6.5) {
		document.getElementById('Slider5Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider5Val').classList.remove("bg-input-changed");
	}
		
}



$('#slider6').slider({
	id: 'hemoglobin',
	min: 0,
	max: 30,
	step: .5,
	value: 15,
	rangeHighlights: [{ "start": 12, "end": 18, "class": "range1" },
]});          
$("#slider6").slider();
$("#slider6").on("change", function(changeEvt6) {
	const obj = changeEvt6.value
	$("#Slider6Val").val(obj.newValue);
	
	if (document.getElementById('Slider6Val').value != 15) {
		document.getElementById('Slider6Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider6Val').classList.remove("bg-input-changed");
	}
	
});
function change_slider6() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider6Val.value <= parseInt(document.getElementById("slider6").getAttribute("data-slider-min"))) {
		$("#slider6").slider('setValue', parseInt(document.getElementById("slider6").getAttribute("data-slider-min")));
		$("#Slider6Val").val(parseInt(document.getElementById("slider6").getAttribute("data-slider-min")));
	} else if (Slider6Val.value >= parseInt(document.getElementById("slider6").getAttribute("data-slider-max"))) {
		$("#slider6").slider('setValue', parseInt(document.getElementById("slider6").getAttribute("data-slider-max")));
		$("#Slider6Val").val(parseInt(document.getElementById("slider6").getAttribute("data-slider-max")));
	} else {
		$("#slider6").slider('setValue', Slider6Val.value);
	}
	
	if (document.getElementById('Slider6Val').value != 15) {
		document.getElementById('Slider6Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider6Val').classList.remove("bg-input-changed");
	}
		
}


$('#slider7').slider({
	id: 'inspiredoxygen',
	min: 0,
	max: 100,
	step: 1,
	value: 21,
	rangeHighlights: [{ "start": 20, "end": 22, "class": "range1" },
]});          
$("#slider7").slider();
$("#slider7").on("change", function(changeEvt7) {
	const obj = changeEvt7.value
	$("#Slider7Val").val(obj.newValue);
	
	if (document.getElementById('Slider7Val').value != 21) {
		document.getElementById('Slider7Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider7Val').classList.remove("bg-input-changed");
	}
	
});
function change_slider7() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider7Val.value <= parseInt(document.getElementById("slider7").getAttribute("data-slider-min"))) {
		$("#slider7").slider('setValue', parseInt(document.getElementById("slider7").getAttribute("data-slider-min")));
		$("#Slider7Val").val(parseInt(document.getElementById("slider7").getAttribute("data-slider-min")));
	} else if (Slider7Val.value >= parseInt(document.getElementById("slider7").getAttribute("data-slider-max"))) {
		$("#slider7").slider('setValue', parseInt(document.getElementById("slider7").getAttribute("data-slider-max")));
		$("#Slider7Val").val(parseInt(document.getElementById("slider7").getAttribute("data-slider-max")));
	} else {
		$("#slider7").slider('setValue', Slider7Val.value);
	}
	
	if (document.getElementById('Slider7Val').value != 21) {
		document.getElementById('Slider7Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider7Val').classList.remove("bg-input-changed");
	}
		
}


$('#slider8').slider({
	id: 'respiratoryquotient',
	min: 0,
	max: 2.1,
	step: .1,
	value: 0.8,
	rangeHighlights: [{ "start": 0.7, "end": 1.2, "class": "range1" },
]});          
$("#slider8").slider();
$("#slider8").on("change", function(changeEvt8) {
	const obj = changeEvt8.value
	$("#Slider8Val").val(obj.newValue);
	
	if (document.getElementById('Slider8Val').value != 0.8) {
		document.getElementById('Slider8Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider8Val').classList.remove("bg-input-changed");
	}
	
});
function change_slider8() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider8Val.value <= parseInt(document.getElementById("slider8").getAttribute("data-slider-min"))) {
		$("#slider8").slider('setValue', parseInt(document.getElementById("slider8").getAttribute("data-slider-min")));
		$("#Slider8Val").val(parseInt(document.getElementById("slider8").getAttribute("data-slider-min")));
	} else if (Slider8Val.value >= parseFloat(document.getElementById("slider8").getAttribute("data-slider-max")).toFixed(1)) {
		$("#slider8").slider('setValue', parseFloat(document.getElementById("slider8").getAttribute("data-slider-max")).toFixed(1));
		$("#Slider8Val").val(parseFloat(document.getElementById("slider8").getAttribute("data-slider-max")).toFixed(1));
	} else {
		$("#slider8").slider('setValue', Slider8Val.value);
	}
	
	if (document.getElementById('Slider8Val').value != 0.8) {
		document.getElementById('Slider8Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider8Val').classList.remove("bg-input-changed");
	}
		
}

$('#slider9').slider({
	id: 'bodytemp',
	min: 34,
	max: 40,
	step: .1,
	value: 36.5,
	rangeHighlights: [{ "start": 36.1, "end": 37.2, "class": "range1" },
]});          
$("#slider9").slider();
$("#slider9").on("change", function(changeEvt9) {
	const obj = changeEvt9.value
	$("#Slider9Val").val(obj.newValue);
	
	if (document.getElementById('Slider9Val').value != 36.5) {
		document.getElementById('Slider9Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider9Val').classList.remove("bg-input-changed");
	}
	
});
function change_slider9() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider9Val.value <= parseInt(document.getElementById("slider9").getAttribute("data-slider-min"))) {
		$("#slider9").slider('setValue', parseInt(document.getElementById("slider9").getAttribute("data-slider-min")));
		$("#Slider9Val").val(parseInt(document.getElementById("slider9").getAttribute("data-slider-min")));
	} else if (Slider9Val.value >= parseInt(document.getElementById("slider9").getAttribute("data-slider-max"))) {
		$("#slider9").slider('setValue', parseInt(document.getElementById("slider9").getAttribute("data-slider-max")));
		$("#Slider9Val").val(parseInt(document.getElementById("slider9").getAttribute("data-slider-max")));
	} else {
		$("#slider9").slider('setValue', Slider9Val.value);
	}
	
	if (document.getElementById('Slider9Val').value != 36.5) {
		document.getElementById('Slider9Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider9Val').classList.remove("bg-input-changed");
	}
		
}


$('#slider10').slider({
	id: 'hematocrit',
	min: 0,
	max: 1,
	step: .01,
	value: .45,
	rangeHighlights: [{ "start": .35, "end": .50, "class": "range1" },
]});          
$("#slider10").slider();
$("#slider10").on("change", function(changeEvt10) {
	const obj = changeEvt10.value
	$("#Slider10Val").val(obj.newValue);
	
	if (document.getElementById('Slider10Val').value != .45) {
		document.getElementById('Slider10Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider10Val').classList.remove("bg-input-changed");
	}
	
});
function change_slider10() {					
	// USES input id ATTRIBUTES FOR min and max values
	if (Slider10Val.value <= parseInt(document.getElementById("slider10").getAttribute("data-slider-min"))) {
		$("#slider10").slider('setValue', parseInt(document.getElementById("slider10").getAttribute("data-slider-min")));
		$("#Slider10Val").val(parseInt(document.getElementById("slider10").getAttribute("data-slider-min")));
	} else if (Slider10Val.value >= parseInt(document.getElementById("slider10").getAttribute("data-slider-max"))) {
		$("#slider10").slider('setValue', parseInt(document.getElementById("slider10").getAttribute("data-slider-max")));
		$("#Slider10Val").val(parseInt(document.getElementById("slider10").getAttribute("data-slider-max")));
	} else {
		$("#slider10").slider('setValue', Slider10Val.value);
	}
	
	if (document.getElementById('Slider10Val').value != .45) {
		document.getElementById('Slider10Val').classList.add("bg-input-changed");
	} else {
		document.getElementById('Slider10Val').classList.remove("bg-input-changed");
	}
		
}


// UPDATE TICKS WHEN OPENING ADVANCED PARAMETERS
var myCollapsible = document.getElementById('accordionFlushExample')
myCollapsible.addEventListener('shown.bs.collapse', function () {
	// do something...
	//console.log("SHOWN")

	//if (myFirstOpenSlider == 0 ) {
		//window.dispatchEvent(new Event('resize')); // ALT METHOD THAT WORKS	  
		
		$('#slider7').slider('refresh');
		$('#slider8').slider('refresh');		  
		$('#slider9').slider('refresh');
		$('#slider10').slider('refresh');
		
		$("#slider7").slider('setValue', Slider7Val.value);
		$("#slider8").slider('setValue', Slider8Val.value);
		$("#slider9").slider('setValue', Slider9Val.value);
		$("#slider10").slider('setValue', Slider10Val.value);
		
		//myFirstOpenSlider = 1
	//}
		           
})

// A3MG NOTES 
//Slider1Val.value = Altitude = alt
//Slider2Val.value = Metabolic demand for O2 = VO2
//Slider3Val.value = Respiratory rate = RR
//Slider4Val.value = Tidal volume = VT
//Slider5Val.value = Cardiac output = CO
//Slider6Val.value = Hemoglobin = Hb
//Slider7Val.value = Inspired oxygen = fio2
//Slider8Val.value = Respiratory quotient = RQ
//Slider9Val.value = Body temperature = Temp
//Slider10Val.value = Hematocrit = Hct

var atmosphere = 0
var alveoli = 0
var systemicarteries = 0
var tissues = 0
var systemicveins = 0
var oxygensaturations = 0

function updateChart() {
	
	$('#container1').highcharts().series[0].update({data: [{ y: parseFloat(atmosphere),target: 159.5 }]});
	$('#container2').highcharts().series[0].update({data: [{ y: parseFloat(alveoli),target: 122.7 }]});	
	$('#container3').highcharts().series[0].update({data: [{ y: parseFloat(systemicarteries),target: 100.3 }]});	
	$('#container4').highcharts().series[0].update({data: [{ y: parseFloat(tissues),target: 45.5 }]});	
	$('#container5').highcharts().series[0].update({data: [{ y: parseFloat(systemicveins),target: 46.3 }]});					
	
	//$('#container1').highcharts().redraw();			
}

function alertResetSimulation() {
	$("#slider1").slider('setValue', 0);
	$("#Slider1Val").val(0);
	document.getElementById('Slider1Val').classList.remove("bg-input-changed");
	
	$("#slider2").slider('setValue', 250);
	$("#Slider2Val").val(250);
	document.getElementById('Slider2Val').classList.remove("bg-input-changed");
	
	$("#slider3").slider('setValue', 12);
	$("#Slider3Val").val(12);
	document.getElementById('Slider3Val').classList.remove("bg-input-changed");
	
	$("#slider4").slider('setValue', 475);
	$("#Slider4Val").val(475);
	document.getElementById('Slider4Val').classList.remove("bg-input-changed");
	
	$("#slider5").slider('setValue', 6.5);
	$("#Slider5Val").val(6.5);
	document.getElementById('Slider5Val').classList.remove("bg-input-changed");
	
	$("#slider6").slider('setValue', 15);
	$("#Slider6Val").val(15);
	document.getElementById('Slider6Val').classList.remove("bg-input-changed");
	
	$("#slider7").slider('setValue', 21);
	$("#Slider7Val").val(21);
	document.getElementById('Slider7Val').classList.remove("bg-input-changed");
	
	$("#slider8").slider('setValue', 0.8);
	$("#Slider8Val").val(0.8);
	document.getElementById('Slider8Val').classList.remove("bg-input-changed");
	
	$("#slider9").slider('setValue', 36.5);
	$("#Slider9Val").val(36.5);
	document.getElementById('Slider9Val').classList.remove("bg-input-changed");
	
	$("#slider10").slider('setValue', .45);
	$("#Slider10Val").val(.45);
	document.getElementById('Slider10Val').classList.remove("bg-input-changed");
	
}

// BAILLIE LAB
var pythonserverscript = "https://baillielab.roslin.ed.ac.uk/cgi-bin/oxygen_delivery.py";
//A3MG var es_script = "https://baillielab.roslin.ed.ac.uk/cgi-bin/abg/shunt.py";

var gasunits = 'kPa';
var showerrors = "yes"; // send console message when submission fails

var myChart = "mmHg"

function getUrl(url) {
  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  // we'll store the parameters here
  var obj = {};
  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];
    // split our query string into its component parts
    var arr = queryString.split('&');
    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');
      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {
        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];
        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }
  return obj;
}

//set starting value for global variables
var fio2 = getUrl().f || 21;
var RR = getUrl().rr || 12;
var VT = getUrl().vt || 475;
var VD =  getUrl().vd || 110;
var RQ =  getUrl().rq || 0.8;
var alt =  getUrl().a || 0;
var Temp = getUrl().t || 36.5;
var Hb = getUrl().hb || 15;
var CO =  getUrl().co || 6.5;
var BE =  getUrl().be || 0;
var DPG = getUrl().dpg || 4.65;
var pulm_shunt = getUrl().sh || 0.03;
var tissue_shunt = getUrl().tsh || 0.05;
var Vc = getUrl().vc || 75;
var DmO2 = getUrl().dm || 300;
var sigma = getUrl().sigma || 0;
var VO2 = getUrl().vo || 250;
//view
var currentgraph = getUrl().currentgraph || 'c'; // "c", "s", "t", "v", "a"
var advm = getUrl().advm || 'n';  //"n" - normal, "a" - advanced
var nums = getUrl().nums || 0; // 0 or 1

// SETS THE VALUES BASED ON GLOBALS OR URL VALUES
// TEMP TURN OFF FOR NOW
/*
document.ajax.fio2.value = fio2;
document.ajax.RR.value = RR;
document.ajax.VT.value = VT;
//document.ajax.VD.value = VD;
document.ajax.RQ.value = RQ;
document.ajax.alt.value = alt;
document.ajax.Temp.value = Temp;
document.ajax.Hb.value = Hb;
document.ajax.CO.value = CO;
//document.ajax.BE.value = BE;
//document.ajax.DPG.value = DPG;
//document.ajax.pulm_shunt.value = pulm_shunt;
//document.ajax.tissue_shunt.value = tissue_shunt;
//document.ajax.Vc.value = Vc;
//document.ajax.DmO2.value = DmO2;
document.ajax.VO2.value = VO2;
*/

//document.ajax.alt.value = alt;
$("#Slider1Val").val(alt);
$("#slider1").slider();
change_slider1()

//console.log(Slider2Val.value)

var inputboxes={'RR':RR, 'VT':VT, 'VD':VD, 'fio2':fio2, 'alt':alt, 'CO':CO, 'pulm_shunt':pulm_shunt, 'Vc':Vc, 'DmO2':DmO2, 'sigma':sigma, 'Hb':Hb, 'BE':BE, 'DPG':DPG, 'Hct':0.35, 'VO2':VO2, 'Temp':Temp, 'tissue_shunt':tissue_shunt, 'RQ':RQ};
var returned_numbers=[21.26 , 19.96 , 13.6823308318 , 13.6823450548 , 13.0792809165 , 6.27708528477 , 6.38081851231 , 13.1 , 5.3 , 7.4 , 39.77 , 24.4 , 97.3];

function createInstance(){
        var req = null;
        if (window.XMLHttpRequest)
        {req = new XMLHttpRequest();}
        else if (window.ActiveXObject) {
        try { req = new ActiveXObject("Msxml2.XMLHTTP");}
        catch (e) { try { req = new ActiveXObject("Microsoft.XMLHTTP");}
        catch (e) { alert("XHR not created");}}}
        return req;
    };

function working(data){
        //var element = document.getElementById('working');
        //element.innerHTML = data;
        //console.log(data)
    }

function submitForm(mode){
    if (mode=="initiate"){working("Loading model...")}
    else {working("Calculating...")}
    //shade displayed values grey
    // enter code here...
	
	// CODE TO UPDATE CALCULATE BUTTON
	$("#calculate").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;Calculating...');
	$("#calculate").removeClass('btn-explore');
	$("#calculate").addClass('btn-secondary');
	setTimeout(function() { $("#calculate").prop( "disabled", true ); }, 100);
	//new code

	fio2 = Number(Slider7Val.value);
    RR = Number(Slider3Val.value);
    if (RR == 0) {
    	RR = .001
    }
    
    var VT = Number(Slider4Val.value);
    var alt = Number(Slider1Val.value);
    var CO = Number(Slider5Val.value);
    var Hb = Number(Slider6Val.value);
    var VO2 = Number(Slider2Val.value);
    var Temp = Number(Slider9Val.value);
    var RQ = Number(Slider8Val.value);
    if (RQ == 0) {
    	RQ = .001
    }
    var Hct = Number(Slider10Val.value);
	var Qecmo = 0 //A3MG
    var ecmosites = ['venacava'];
    
    var VT_unit = "ml"
    var alt_unit = "m"
    var Temp_unit = "deg C"
    var Hb_unit = "g/dl"
    var CO_unit = "l/min"
    var VD_unit = "ml"
    var DPG_unit = "mmol/l"
    var Vc_unit = "ml"
	
	var data = {
		advm : advm,
		fio2 : fio2,
		RR : RR,
		VT : VT,
		VT_unit : VT_unit,
		VD : VD,
		VD_unit : "ml",
		RQ : RQ,
		alt : alt,
		alt_unit : alt_unit,
		Temp : Temp,
		Temp_unit : Temp_unit,
		Hb : Hb,
		Hb_unit : Hb_unit,
		Hct : Hct,
		BE : BE,
		DPG : DPG,
		DPG_unit : "mmol/l",
		pulm_shunt : pulm_shunt,
		tissue_shunt : tissue_shunt,
		Vc : Vc,
		Vc_unit : "ml",
		DmO2 : DmO2,
		sigma : sigma,
		VO2 : VO2,
		CO : CO,
		CO_unit : CO_unit,
		Qecmo : Qecmo,
		ecmosites : ecmosites
	}
	var results = calculate(data);
   
	atmosphere = (results["PatmosO2"]*7.50062).toFixed(1)
	alveoli = (results["PAO2"]*7.50062).toFixed(1)
	systemicarteries = (results["PaO2"]*7.50062).toFixed(1)	
	tissues = (results["PtO2"]*7.50062).toFixed(1)
	systemicveins = (results["PvO2"]*7.50062).toFixed(1)
	oxygensaturations = (results["SaO2"]*100).toFixed(1)
	
	if (RR <= .01) {
		oxygensaturations = 0
	}
	
	// CODE TO DISPLAY O2 SATURATION
	//document.getElementById("oxygensaturationpill").style.marginLeft = "calc("+oxygensaturations+"% - "+(oxygensaturations/100)*70+"px);"
	//document.getElementById("oxygensaturationpill").style.marginLeft = "calc(50% - 70px);"
	//style="margin-left: calc(97.5% - 70px);"
	oxygensaturationpill.style.marginLeft = "calc("+oxygensaturations+"% - "+parseInt((oxygensaturations/100)*70)+"px)"
	 
	 
					
	document.getElementById("oxygensaturationpercent").innerHTML = oxygensaturations+'%'
	
	//console.log(atmosphere+", "+alveoli+", "+systemicarteries+", "+tissues+", "+systemicveins+", "+oxygensaturations)
	working("Done");
					
	updateChart()  
	
	// CODE TO END CALCULATING FEEDBACK FOR CALCULATE BUTTON
	$("#calculate").html("Calculation Complete");
	$("#calculationComplete_notification").attr("aria-hidden","false");
	document.getElementById("calculationComplete_notification").innerHTML = "Calculation complete. The simulator outputs have been updated.";

	setTimeout(function() { $("#calculate").html('Calculate');
							$("#calculate").removeClass('btn-secondary');
							$("#calculate").addClass('btn-explore');
							$("#calculate").prop( "disabled", false ); }, 2000);
							
	setTimeout(function() { document.getElementById("calculationComplete_notification").innerHTML = ""; }, 7000);
	setTimeout(function() { $("#calculationComplete_notification").attr("aria-hidden","true"); }, 7150);
	return;
	
	
    var req =  createInstance();
    //var advm = document.getElementById('versionbox').checked;
    var advm = false
	
	// A3MG NOTES 
	// Slider1Val.value = Altitude = alt
	// Slider2Val.value = Metabolic demand for O2 = VO2
	// Slider3Val.value = Respiratory rate = RR
	// Slider4Val.value = Tidal volume = VT
	// Slider5Val.value = Cardiac output = CO
	// Slider6Val.value = Hemoglobin = Hb
	// Slider7Val.value = Inspired oxygen = fio2
	// Slider8Val.value = Respiratory quotient = RQ
	// Slider9Val.value = Body temperature = Temp
	// Slider10Val.value = Hematocrit = Hct
		    
    fio2 = Number(Slider7Val.value);
    RR = Number(Slider3Val.value);
    if (RR == 0) {
    	RR = .001
    }
    
    VT = Number(Slider4Val.value);
    //A3MG VD = Number(document.ajax.VD.value);
    alt = Number(Slider1Val.value);
    CO = Number(Slider5Val.value);
    //A3MG pulm_shunt = Number(document.ajax.pulm_shunt.value);
    //A3MG DmO2 = Number(document.ajax.DmO2.value);
    //A3MG Vc = Number(document.ajax.Vc.value);
    Hb = Number(Slider6Val.value);
    //A3MG BE = Number(document.ajax.BE.value);
    //A3MG DPG = Number(document.ajax.DPG.value);
    VO2 = Number(Slider2Val.value);
    Temp = Number(Slider9Val.value);
    //A3MG tissue_shunt = Number(document.ajax.tissue_shunt.value);
    RQ = Number(Slider8Val.value);
    if (RQ == 0) {
    	RQ = .001
    }
    Hct = Number(Slider10Val.value);
    //sigma = Number(document.ajax.sigma.value);
    
    VT_unit = "ml"
    alt_unit = "m"
    Temp_unit = "deg C"
    Hb_unit = "g/dl"
    CO_unit = "l/min"
    
    VD_unit = "ml"
    DPG_unit = "mmol/l"
    Vc_unit = "ml"
    
    //A3MG VT_unit = document.ajax.VT_unit.value;
    //A3MG VD_unit = document.ajax.VD_unit.value;
    //A3MG alt_unit = document.ajax.alt_unit.value;
    //A3MG Temp_unit = document.ajax.Temp_unit.value;
    //A3MG Hb_unit = document.ajax.Hb_unit.value;
    //A3MG DPG_unit = document.ajax.DPG_unit.value;
    //A3MG CO_unit = document.ajax.CO_unit.value;
    //A3MG Vc_unit = document.ajax.Vc_unit.value;
	
    //A3MG Qecmo = Number(document.ajax.qecmo.value);
    Qecmo = 0 //A3MG
    vv_ecmo = 'venacava' //A3MG
    // A3MG
    //vv_ecmo = ''
    //if (document.getElementById('venacava').checked){vv_ecmo = 'venacava'};
    va_ecmo = ''
    //if (document.getElementById('aorta').checked){va_ecmo = 'aorta'};
    ecmosites = vv_ecmo + '|' + va_ecmo;

    directlink = document.URL.split('?')[0] + "?f="+fio2+"&rr="+RR+"&vt="+VT+"&vd="+VD+"&a="+alt+"&co="+CO+"&sh="+pulm_shunt+"&dm="+DmO2+"&vc="+Vc+"&hb="+Hb+"&be="+BE+"&dpg="+DPG+"&vo="+VO2+"&t="+Temp+"&tsh="+tissue_shunt+"&rq="+RQ+"&currentgraph="+currentgraph+"&advm="+advm+"&nums="+nums+"&sigma"+sigma
	
	var data =  "&advm="+advm+
                "&fio2="+fio2+
                "&RR="+RR+
                "&VT="+VT+
                "&VT_unit="+VT_unit+
                "&VD="+VD+
                "&VD_unit=ml"+
                "&RQ="+RQ+
                "&alt="+alt+
                "&alt_unit="+alt_unit+
                "&Temp="+Temp+
                "&Temp_unit="+Temp_unit+
                "&Hb="+Hb+
                "&Hb_unit="+Hb_unit+
                "&Hct="+Hct+
                "&BE="+BE+
                "&DPG="+DPG+
                "&DPG_unit=mmol/l"+
                "&pulm_shunt="+pulm_shunt+
                "&tissue_shunt="+tissue_shunt+
                "&Vc="+Vc+
                "&Vc_unit=ml"+
                "&DmO2="+DmO2+
                "&sigma="+sigma+
                "&VO2="+VO2+
                "&CO="+CO+
                "&CO_unit="+CO_unit+
                "&Qecmo="+Qecmo+
                "&ecmosites="+ecmosites
                ;
	
    req.onreadystatechange = function(){
        if(req.readyState == 4){
            if(req.status == 200){
                output=req.responseText;
                //console.log("output:", output) // THIS SHOWS THE OUTPUT IN THE JAVASCRIPT CONSOLE
                output = output.split(':::')[1]
                returned_numbers = output.split("|");

                results = {}
                for (index in returned_numbers){
                    s = returned_numbers[index].split(":")
                    results[s[0].replace(/\s/g, '')] = parseFloat(s[1])
                }
               
               	atmosphere = parseFloat(results["PatmosO2"]*7.50062).toFixed(1)
				alveoli = parseFloat(results["PAO2"]*7.50062).toFixed(1)
				systemicarteries = parseFloat(results["PaO2"]*7.50062).toFixed(1)
				tissues = parseFloat(results["PtO2"]*7.50062).toFixed(1)
				systemicveins = parseFloat(results["PvO2"]*7.50062).toFixed(1)
				oxygensaturations = parseFloat(results["SaO2"]*100).toFixed(1)
				
				if (RR <= .01) {
					oxygensaturations = 0
				}
				
				// CODE TO DISPLAY O2 SATURATION
				//document.getElementById("oxygensaturationpill").style.marginLeft = "calc("+oxygensaturations+"% - "+(oxygensaturations/100)*70+"px);"
				//document.getElementById("oxygensaturationpill").style.marginLeft = "calc(50% - 70px);"
				//style="margin-left: calc(97.5% - 70px);"
				//console.log("calc("+oxygensaturations+"% - "+parseInt((oxygensaturations/100)*70)+"px)") 
				oxygensaturationpill.style.marginLeft = "calc("+oxygensaturations+"% - "+parseInt((oxygensaturations/100)*70)+"px)"
				 
				 
                                
                document.getElementById("oxygensaturationpercent").innerHTML = oxygensaturations+'%'
                
                //console.log(atmosphere+", "+alveoli+", "+systemicarteries+", "+tissues+", "+systemicveins+", "+oxygensaturations)
                working("Done");
                                
                updateChart()  
                
                // CODE TO END CALCULATING FEEDBACK FOR CALCULATE BUTTON
                $("#calculate").html("Calculation Complete");
                $("#calculationComplete_notification").attr("aria-hidden","false");
                document.getElementById("calculationComplete_notification").innerHTML = "Calculation complete. The simulator outputs have been updated.";
       
                setTimeout(function() { $("#calculate").html('Calculate');
										$("#calculate").removeClass('btn-secondary');
										$("#calculate").addClass('btn-explore');
										$("#calculate").prop( "disabled", false ); }, 2000);
										
				setTimeout(function() { document.getElementById("calculationComplete_notification").innerHTML = ""; }, 7000);
				setTimeout(function() { $("#calculationComplete_notification").attr("aria-hidden","true"); }, 7150);
                						
                }
                                
            else
                {
                if (showerrors == "yes")
                    {
                    console.log("Error at script submission: returned status code " + req.status + " " + req.statusText +" "+ data);
                    }
                }
            }
        }
    req.open("POST", pythonserverscript, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send(data);
    }






