
	var video = document.getElementsByTagName("video")[0];
	var id = parseInt(Math.random() * 10000);
	console.log('hello');

	var sync = altspace.utilities.sync.getInstance({
		appId: "paprika",
		author: "bobo"
	});


	var toggleSync = function toggleSync(on){
		if (on){
			video.onpause = function(){
				sync.child('video').set({
					id: id,
					state: 'paused',
					currentTime: video.currentTime
				});
			}

			video.onplay = function(){
				console.log('playing');
				sync.child('video').set({
					id: id,
					state: 'playing',
					currentTime: video.currentTime
				});
			}

			video.onseeked = function(){
				sync.child('video').set({
					id: id,
					state: video.paused ? 'paused' : 'playing',
					currentTime: video.currentTime
				})
			}
		} else {
			video.onpause = null;
			video.onplay = null;
			video.onseeked = null;
		}
	}
	toggleSync(true);

	var onSync = function onSync(s){
		var val = s.val();
		console.log('got update');
		if (!val){
			return;
		}
		console.log(val);
		if (val.id == id){
			return;
		}

		toggleSync(false);

		video.currentTime = val.currentTime;

		if (val.state == 'paused'){
			video.pause();
		}
		else if (val.state == 'playing'){
			video.play();
		}

		window.setTimeout(function(){
			toggleSync(true);
		}, 200);
	}

	sync.child('video').on('value', onSync);

	function dopause() {
		console.log('pause!');
	}	