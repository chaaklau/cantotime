var jp_pronounce;

(function () {
  function audio_url(jp, a) {
    var ext;
    var a = a || (new Audio());
    if (a.canPlayType('audio/mpeg')) {
     ext = ".mp3";
    } else {
     ext = ".ogg";
    }
    var url = "https://words.hk/static/jyutping/" + jp + ext;
    return url;
  }
  var audio_cache = {};
  var real_audio = null;

  var is_safari = navigator.userAgent.match(/safari/i);
  var is_mobile = navigator.userAgent.match(/mobile/i);

  jp_pronounce = function(jp) {
    if (!audio_cache[jp]) {
      audio_cache[jp] = [];
    }
    if (audio_cache[jp].length === 0) {
      // TODO: Deal with audio-with-the-whole-phrase later.
      var syllables = jp.split(" ");
      for (var i = 0; i < syllables.length; i++) {
	var audio = new Audio(audio_url(syllables[i]));
	audio_cache[jp].push(audio);
      }
    }

    if (real_audio == null) {
      real_audio = new Audio();
      real_audio.is_playing = false;
      // This is a horrible mess to work around mobile Safari limitations.  See eg. http://www.ibm.com/developerworks/library/wa-ioshtml5/
      real_audio.addEventListener('ended', function () {
	var obj = this;
	window.setTimeout(function () {
	  if (obj.current_idx < audio_cache[jp].length - 1) {
	    obj.current_idx++;
	    obj.src = audio_cache[jp][obj.current_idx].src;
	    obj.play();
	  } else {
	    obj.current_idx = 0;
	    real_audio = null;
	    audio_cache = {};
	  }
	}, 0);
      });
    }

    if (!real_audio.is_playing) {
      real_audio.current_idx = 0;
      real_audio.src = audio_cache[jp][0].src;
      real_audio.play();
      real_audio.is_playing = true;
    }
  };
})();
