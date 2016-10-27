

/* 
	v380 Tablet
	Main code
	161010
*/

$(document).ready(function () {
	
	// alert('width : ' + document.body.clientWidth + '\n'+'height : ' + document.body.clientHeight)
	// console.log('width : ' + document.body.clientWidth);  
	// console.log('height : ' + document.body.clientHeight);  
	
	// console.log('func0 length - ', func0.length-0);
	
	/* Init Event */
	var device_num = device_check();
	
	// Device num 1:android, 2:ios, 3:other PC
	var CLICK_EV = (device_num > 2) ? 'click' : 'touchstart';
	var MOUSEMOVE_EV = (device_num > 2) ? 'mousemove' : 'touchmove';
	var MOUSEUP_EV = (device_num > 2) ? 'mouseup' : 'touchend';
	// console.log("CLICK_EV", CLICK_EV);
	// console.log("MOUSEMOVE_EV", MOUSEMOVE_EV);
	// console.log("MOUSEUP_EV", MOUSEUP_EV);
	
	var global_address = create_addr_data();
	// console.dir(global_address);
	
	/* End Init Event */
	
	/* Get Canvas Start ================================ */
	// Get Canvas, Init Canvas
	var video_canvas = $("#video_signal").get(0);
	var video_ctx = video_canvas.getContext("2d");

	var image_canvas = $("#video_image").get(0);
	var image_ctx = image_canvas.getContext("2d");

	var canvas = $("#canvas_image").get(0);
	var cavas_ctx = canvas.getContext("2d");
	
	draw_text_center(video_ctx, video_canvas, "Un-Linked");		// Draw text
	/* Get Canvas End ================================ */

	/* Start Drag false ev */
	$(document).bind("contextmenu", function(e) {return false;});
	$(document).bind('selectstart', function() 	{return false;}); 
	$(document).bind('dragstart', 	function()	{return false;});  
	/* End Drag false ev */
	
	/* 
	// page move
	setTimeout( function () {
		$.mobile.changePage( "#page_status_err", { transition: "none", changeHash: false });
	}, 5000);
	
	// pageshow event
	$(document).on("pageshow","#page_status_err", function() { // When entering page_status_err
		// alert("page_mode_change is now shown");	
		$('#err_title').text();	// change title
	});
	*/
	
	// validate menu : Init input tag 
	$( '.validate_inputs' ).datepicker({
		dateFormat: "dd-mm-yy",
		changeMonth: true,
		changeYear: true,
		onClose: function() {
			
		},
		width: 250
	}).change(function() {
		
	});
	
	$('.image_btns').on('click', function() {
		console.log(this.name);
	});
	
	// 
	$('.canvas_menu_btns').on('click', function() {
		switch( this.name ) {
			
			case 'canvas_image':
								$.mobile.changePage("#page_image");
								break;
								
		}
	});
	
	// 
	$('.sens_adv_set').on('click', function() {
		$.mobile.changePage("#page_canvas");	// Change page
	});
	
	/* 
	// Page Event Init
	$(document).on("pagebeforecreate",function(event){
		alert("pagebeforecreate event fired!");
	}); 
	
	$(document).on("pagecreate",function(event){
		alert("pagecreate event fired!");
	});
	*/
	/* 
	// Page Event Show and Hide
	$(document).on("pageshow","#page_mode_change", function() { // When entering page_mode_change
		alert("page_mode_change is now shown");	
	});
	
	$(document).on("pagehide","#page_mode_change",function(){ // When leaving page_mode_change
		alert("page_mode_change is now hidden");
	});
	*/
	
});

function device_check() {
	// 1=Android, 2=ios, 3=pc
	var device_flag = 0;

	if( /Android/i.test(navigator.userAgent)) {
		// Android
		// alert('Android device');
		// console.log('Android device');
		device_flag = 1;
	} 
	else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
		// iOS 아이폰, 아이패드, 아이팟
		// alert('ios device');
		// console.log('ios device');
		device_flag = 2;
	} 
	else {
		// 그 외 디바이스
		// alert('PC device');
		// console.log('PC device');
		device_flag = 3;
	}
	
	return device_flag;
}	

/* Create Address Data */
function create_addr_data() {
	
	var addr = {};
	
	// 0x300
	for( var i=0; i<=768; i++ ) {
		addr['0x' + dec2hex(i)] = 0;
	}
	
	// create & return addr object
	return addr;
}

/* Init Address Data */
function init_addr_data() {
	
}

// Canvas Draw Func
function draw_text_center(ctx, canvas, text) {

	ctx.font = "15px Consolas";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(text, canvas.width/2, canvas.height/2);
	
}

function page_init() {

}
