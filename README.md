This is the first iteration of the Symmetry Signal Processing API. Go to symmetry.herokuapp.com to request an API token to start building apps using Symmetry. The below examples showcase the ability to sign up and login users using Symmetry


AJAX post to create a user account using your token.


$.ajax({
				url: 'http://symmetry.herokuapp.com/users',
				type: 'POST',
				data:{user:{email:email, warp_one:JSON.stringify(firstWarp), 
					warp_two:JSON.stringify(secondWarp)}},
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

AJAX get to login a user

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