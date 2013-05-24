(function ( $ ) {
  $.fn.warpAuthSignUp = function( options ) {
 
    // This is the easiest way to have default options.
    var settings = $.extend({
      "color": "#556B2F",  // These are the defaults
    }, options );

	//=====================================Render Divs=======================================//
	$(this).html('email<input id="email" type="text"/>'+
    '<div id="container">'+
	'<div id="instructions">Please draw draw a line that you can remember and repeat</div>'+
      '<canvas id="imageView" width="400" height="200" style="border:2px solid">'+
        '<p>Unfortunately, your browser is currently unsupported by our web' +
        'application.</p>'+
      '</canvas>'+
	'<button id="clear">Clear</button>'+
	'<button id="save">Save</button>'+
    '</div>');

	// Keep everything in anonymous function, called on window load.
	if(window.addEventListener) {
	window.addEventListener('load', function () {
	  var canvas, context, tool;
	  var firstWarp= [];
	  var secondWarp=[];
	  var warpCount=0;
	
	//=====================================Click Handlers=======================================//
	$('#clear').click(function(){
		context.clearRect(0, 0, canvas.width, canvas.height);
	});
	$('#save').click(function(){
		$('#instructions').html('Please repeat that line as close as possible');
		context.clearRect(0, 0, canvas.width, canvas.height);
		warpCount++;
		email = $('#email').val();
		
		if (warpCount>1){
			$.ajax({
				url: 'http://symmetry.herokuapp.com/users',
				type: 'POST',
				data:{user:{email:email, warp_one:JSON.stringify(firstWarp), 
					warp_two:JSON.stringify(secondWarp)}},
				headers: {
					"Authorization": "Token token=<TOUR TOKEN>"
				},
				success:function(data){
			    	console.log(data);
			  },
				failure:function(){
			    	alert('failed');
			  }
			});
		}
	});
	
	//=====================================Canvas Init=======================================//
	  function init () {
	    // Find the canvas element.
	    canvas = document.getElementById('imageView');
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
	  // This painting tool works like a drawing pencil which tracks the mouse 
	  // movements.
	  function tool_pencil () {
	    var tool = this;
	    this.started = false;

	    // This is called when you start holding down the mouse button or touching the 
		// screen. This starts the pencil drawing.
	    this.start_pencil = function (ev) {
	        context.beginPath();
	        context.moveTo(ev._x, ev._y);
	        tool.started = true;
	    };
		this.mousedown = this.start_pencil;
		this.touchstart = this.start_pencil;
	    
		// This function is called every time you move the mouse or move your finger
		// on the screen. Obviously, it only draws if the tool.started state is set 
		// to true (when you are holding down the mouse button or touching the screen).
		// var counter = 0;
	    this.move_pencil = function (ev) {

	      if (tool.started) {
	        context.lineTo(ev._x, ev._y);
			if (warpCount==0){
				firstWarp.push(ev._y);
			}else if (warpCount==1){
				secondWarp.push(ev._y);
			}
			
			// console.log(counter);
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

 
    // Greenify the collection based on the settings variable
    // return this.css({
    //   "color": settings.color,
    //    "background-color": 'red'
    // });
 
  };
}( jQuery ));