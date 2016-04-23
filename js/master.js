var container;
var camera, scene, renderer,scene2, renderer2;
var controls;
var stats;
var objects = [];
var json;

var yearLength = 1000;
var opDuration = 30000;

var wpXLength = 200;
var yRamdom = 300;
var fps = 60;

var now = new Date();

var yearStart = (now.getFullYear() -2003) * yearLength;
var cameraInitPosition = yearStart + 500;

var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

var parent,parent2;

var mode = 'auto';


var start = -yearStart -1000;
var goal = yearLength * 2;
var distance = goal - start;
var duration = 30000;

var speed = distance / (duration / 1000 * 60);

var linePositionY = -20;


$(function(){
	$.getJSON("json/wp_release.json" , function(data) {
		json = data;
		init();
		animate();
	})
});
	
	
	
function init() {
	container = document.getElementById( 'container' );
	console.log(fps)
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, cameraInitPosition );
//	camera.position.x = 200;
//	camera.position.y = 200;
	camera.position.z = 500;

	scene = new THREE.Scene();
	scene2 = new THREE.Scene();

	parent = new THREE.Object3D;
	parent2 = new THREE.Object3D;
	
	scene.add( parent );
	scene2.add( parent2 );
	
	
	
	//TimeLine
	createline(
		{x:0, y:linePositionY, z:yearStart},
		{x:0, y:linePositionY, z: -yearLength / 12 * 5}
	)
	
	createPoint('l',{x:0, y:linePositionY, z: -yearLength / 12 * 5})
	

	
	//Year 
	var currentYear = now.getFullYear();
	for(var i = 2003; i < currentYear + 1; i++) {
		var src= '<h2 class="year">' + i + '</h2>';
		var element = createElement(src);
		var object = createObject(element, i);
		object.position.x = 0;
		object.position.y = 0;
		
		createPoint('m',{x:0,y:linePositionY,z:getZPosition(i)})
	}

	//WordPress release date
	var wp = $("#wp"), wc = $("#wc");
	var wpData = json.wp, wcData = json.wc
	
	for(var i = 0; i < wpData.length; i++) {
		var date = dateFix(wpData[i].date)
		var src = '<span class="date">' + date + '<span><h2>v' + wpData[i].version + ' ' +wpData[i].codename + '</h2>';
		var element = createElement(src);
		$(element).addClass="wp";
		var object = createObject(element, wpData[i].date);
		object.position.x = wpXLength  * Math.cos(60 * i / 180 * Math.PI) + wpXLength *2 ;
		object.position.y = Math.random() * yRamdom - yRamdom / 2;
		
		createPoint('s',{x:object.position.x,y:object.position.y,z:object.position.z})
		createPoint('s',{x:0,y:linePositionY,z:object.position.z})
		
	

		createline(
			{x:object.position.x - 0,y:object.position.y, z:object.position.z},
			{x:0,y:linePositionY,z:object.position.z}
		)
	}
	
	//WordCamp hold date
	for(var i = 0; i < wcData.length; i++) {
		var date = dateFix(wcData[i].date)
		var src = '<span class="date">' + date + '</span>' +'<h2>' + wcData[i].name + '</h2>'
		if ('wapuu' in wcData[i]) {
			src += '<img src="img/wapuu/'+ wcData[i].wapuu +'" alt="' + wcData[i].name +'" />'
		}
		
		var element = createElement(src);
		$(element).addClass('wc');
		
		var object = createObject(element, wcData[i].date);
		object.position.x = wpXLength  * Math.cos(60 * i / 180 * Math.PI) - wpXLength *2 ;
		object.position.y = Math.random() * yRamdom - yRamdom / 2;
		
		createPoint('s',{x:object.position.x,y:object.position.y,z:object.position.z})
		createPoint('s',{x:0,y:linePositionY,z:object.position.z})
		
		createline(
			{x:object.position.x,y:object.position.y,z:object.position.z},
			{x:0,y:linePositionY,z:object.position.z}
		)
	}
	
	//WCK Kansai 2016
	var src = '<img class="wapuu wapuu_hover" src="img/wapuu/wapuu_wck_2016_hover.png" />';
	src += '<img class="wapuu wapuu_headset" src="img/wapuu/wapuu_wck_2016_headset.png" />';
	src += '<span class="date">July/9,10/2016</span>';
	src += '<h1 class="logo"><img src="img/wck_2016_logo.svg"></h1>';
	var element = createElement(src);
	$(element).addClass('wck2016');
	var object = createObject(element, '2017');
	
	
	
	stats = new Stats();
	container.appendChild( stats.domElement );
	
	renderer = new THREE.CSS3DRenderer({antialias: true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute';
	container.appendChild( renderer.domElement );
	
	renderer2 = new THREE.WebGLRenderer();
	renderer2.setClearColor( 0xFFFFFF );
	renderer2.setPixelRatio( window.devicePixelRatio );
	renderer2.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer2.domElement );
	

	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 2;
	controls.minDistance = 0;
	controls.maxDistance = 2000;
	
	window.addEventListener( 'resize', onWindowResize, false );
	
	
	
	reset()
	render();
}



function createElement(_src) {
	var element = document.createElement( 'div' );
	$(element).addClass('element');
	$(element).html(_src);
	return element;
}

function createObject(_element, date) {
	var object = new THREE.CSS3DSprite( _element );
	object.position.z = getZPosition(date);
	parent.add( object );
	return object;
}

function createPoint(size,position) {
	var point = document.createElement( 'div' );
	$(point).addClass('point point-' + size);
	var pointObject = new THREE.CSS3DSprite( point );
	pointObject.position.x = position.x;
	pointObject.position.y = position.y;
	pointObject.position.z = position.z;
	parent.add( pointObject );
}

function createline(v1, v2) {
	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vector3(v1.x,v1.y, v1.z) ); 
	geometry.vertices.push( new THREE.Vector3(v2.x,v2.y, v2.z) ); 
	var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xcccccc} ) );
	parent2.add( line );
}


function dateFix(_date) {
	var split = _date.split('/')
	var monthNum = parseInt(split[0].replace('0','')) - 1;

	var month = monthNames[monthNum];
	var date = month + ' / ' + split[1] + ' / ' + split[2];
	return date;

}



function getZPosition(date){
	
	var currentYear = now.getFullYear() - 2003;
	var fixPosition = (currentYear - 3) / 2;
	
	date = date.toString()
	var split = date.split('/');
	var position;
	
	if(split){
		var year = parseInt(split[split.length-1]) - 2003;
		
		
		if(split.length > 1){
			var month = parseInt(split[0]) / 12;
			var dayNumber = 31;
			if(month == 4 || month == 6 || month == 9 || month == 11){
				dayNumber = 30;
			}else if(month == 2){
				if(month % 4 == 0){
					dayNumber = 29;
				}else{
					dayNumber = 28;
				}
			}
			var day = parseInt(split[1]) / dayNumber;
			var dayLength = yearLength / 12 / dayNumber;
			position = yearStart - yearLength * year - yearLength * month - dayLength;
		}else{
			position = yearStart - yearLength * year;
		}
	}

	return position;
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();
}

function animate() {
	if(mode =='auto' ){
		if(parent.position.z > goal){
			reset()
		}else{
			parent.position.z = parent.position.z +speed;
			parent2.position.z = parent2.position.z +speed;
		}
		
	}
	requestAnimationFrame( animate );
	TWEEN.update();
	controls.update();
	stats.update();
	render()
}
function render() {
	renderer.render( scene, camera );
	renderer2.render( scene2, camera );
}

function reset() {
	parent.position.z = start;
	parent2.position.z = start;
}


