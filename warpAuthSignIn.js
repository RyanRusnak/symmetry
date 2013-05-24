(function ( $ ) {
  $.fn.warpAuthSignIn = function( options ) {
 
    // This is the easiest way to have default options.
    var settings = $.extend({
      "color": "#556B2F",  // These are the defaults
    }, options );

	//=====================================Render Divs=======================================//
	$(this).html('e-mail<input id="email_" type="text"/>'+
    '<div id="container_">'+
	'<div id="instructions_">Please draw draw a line that you can remember and repeat</div>'+
      '<canvas id="imageView_" width="400" height="200" style="border:2px solid">'+
        '<p>Unfortunately, your browser is currently unsupported by our web' +
        'application.</p>'+
      '</canvas>'+
	'<button id="clear_">Clear</button>'+
	'<button id="save_">Save</button>'+
    '</div>');

	// Keep everything in anonymous function, called on window load.
	if(window.addEventListener) {
	window.addEventListener('load', function () {
	  var canvas, context, tool;
	  var firstWarp= [];
	
	//=====================================CLick Handlers=======================================//
	$('#clear_').click(function(){
		context.clearRect(0, 0, canvas.width, canvas.height);
	});
	$('#save_').click(function(){
		context.clearRect(0, 0, canvas.width, canvas.height);
		email = $('#email_').val();
		
		// $.get("http://localhost:3000/users/123",{user:{name:name, log_warp:JSON.stringify(firstWarp),
		// 			access_token:'7d87dafbb859af4bf3dc28e341e410d0'}}, 			
		// 		function(data){
		// 			console.log(data)
		// 		})
		// 		.fail(function() { alert("error"); });
		
		$.ajax({
			url: 'http://symmetry.herokuapp.com/users/123',
			type: 'GET',
			data:{email:email, log_warp:JSON.stringify(firstWarp)},
			headers: {
				"Authorization": "Token token=<YOUR TOKEN>"
			},
			success:function(data){
		    	console.log(data);
		  },
			failure:function(){
		    	alert('failed');
		  }
		});
	});
	
	//=====================================Canvas Init=======================================//
	  function init () {
	    // Find the canvas element.
	    canvas = document.getElementById('imageView_');
	    if (!canvas) {
	      alert('Error: I cannot find the canvas element!');
	      return;
	    }

	    if (!canvas.getContext) {
	      alert('Error: no canvas.getContext!');
	      return;
	    }

	    // Get the 2D canvas context.
	    context = canvas.getContext('2d');
	    if (!context) {
	      alert('Error: failed to getContext!');
	      return;
	    }

	    // Pencil tool instance.
	    tool = new tool_pencil();

	    // Attach the mousedown, mousemove and mouseup event listeners.
	    canvas.addEventListener('mousedown', ev_canvas, false);
	    canvas.addEventListener('mousemove', ev_canvas, false);
	    canvas.addEventListener('mouseup',   ev_canvas, false);
		// Attach the touchstart, touchmove and touchend event listeners.
		canvas.addEventListener('touchstart', ev_canvas, false);
		canvas.addEventListener('touchmove', ev_canvas, false);
		canvas.addEventListener('touchend',   ev_canvas, false);
	  }

		//=====================================Drawing======================================//
	  // This painting tool works like a drawing pencil which tracks the mouse movements.
	  function tool_pencil () {
	    var tool = this;
	    this.started = false;

		// This is called when you start holding down the mouse button or touching 
		// the screen. This starts the pencil drawing.
		this.start_pencil = function (ev) {
			context.beginPath();
			context.moveTo(ev._x, ev._y);
			tool.started = true;
		};
		this.mousedown = this.start_pencil;
		this.touchstart = this.start_pencil;

		// This function is called every time you move the mouse or touch the screen. 
		// Obviously, it only draws if the tool.started state is set to true (when 
		// you are holding down the mouse button).
		// var counter = 0;
		this.move_pencil = function (ev) {
			if (tool.started) {
				context.lineTo(ev._x, ev._y);
				firstWarp.push(ev._y);
				context.stroke();
			}
		};
		this.mousemove = this.move_pencil;
		this.touchmove = this.move_pencil;

		// This is called when you release the mouse button or stop touching the screen.
		this.stop_pencil = function (ev) {
			if (tool.started) {
				tool.move_pencil(ev);
				tool.started = false;
			}
		};
		this.mouseup = this.stop_pencil;
		this.touchend = this.stop_pencil;
	  }

	  // The general-purpose event handler. This function just determines the mouse 
	  // position relative to the canvas element.
	  function ev_canvas (ev) {
	    if (ev.layerX || ev.layerX == 0) { // Firefox
	      ev._x = ev.layerX;
	      ev._y = ev.layerY;
	    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
	      ev._x = ev.offsetX;
	      ev._y = ev.offsetY;
	    }

	    // Call the event handler of the tool.
	    var func = tool[ev.type];
	    if (func) {
	      func(ev);
	    }
	  }

	  init();

	}, false); }
  };
}( jQuery ));