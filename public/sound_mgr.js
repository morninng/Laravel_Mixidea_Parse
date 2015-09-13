
function SoundMgr(){

	var self = this;
	self.poi_sound = null;
	self.hearhear_sound = null;
	self.booboo_sound = null;
}



SoundMgr.prototype.play_sound_poi = function(){
  var self = this;
  self.poi_sound.start(0);

  self.poi_sound = self.context.createBufferSource();
  self.poi_sound.buffer = self.poi_persisted_sound_buffer;
  self.poi_sound.connect(self.context.destination);
}

SoundMgr.prototype.play_sound_heahear = function(){
  var self = this;
  self.hearhear_sound.start(0);

  self.hearhear_sound = self.context.createBufferSource();
  self.hearhear_sound.buffer = self.hearhear_persisted_sound_buffer;
  self.hearhear_sound.connect(self.context.destination);
}


SoundMgr.prototype.play_sound_booboo = function(){
  var self = this;
  self.booboo_sound.start(0);

  self.booboo_sound = self.context.createBufferSource();
  self.booboo_sound.buffer = self.booboo_persisted_sound_buffer;
  self.booboo_sound.connect(self.context.destination);
}

SoundMgr.prototype.play_sound_poi_finish = function(){
  var self = this;
  self.poi_finish_sound.start(0);

  self.poi_finish_sound = self.context.createBufferSource();
  self.poi_finish_sound.buffer = self.poi_finish_persisted_sound_buffer;
  self.poi_finish_sound.connect(self.context.destination);
}

SoundMgr.prototype.play_sound_taken = function(){
  var self = this;
  self.taken_sound.start(0);

  self.taken_sound = self.context.createBufferSource();
  self.taken_sound.buffer = self.taken_persisted_sound_buffer;
  self.taken_sound.connect(self.context.destination);
}

SoundMgr.prototype.init = function(){

  var self = this;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  self.context = new AudioContext();

  self.bufferLoader = new BufferLoader(
  	self.context,
    ['https://s3.amazonaws.com/mixidea/poi3.wav',
     'https://s3.amazonaws.com/mixidea/hearhear.wav',
     'https://s3.amazonaws.com/mixidea/booboo.wav',
     'https://s3.amazonaws.com/mixidea/taken.wav',
     'https://s3.amazonaws.com/mixidea/poi_finish.wav'
     ],
    self.finishedLoading
  );
  self.bufferLoader.load();
}

SoundMgr.prototype.finishedLoading = function(bufferList) {

  var self = this;

  self.poi_sound = self.context.createBufferSource();
  self.hearhear_sound = self.context.createBufferSource();
  self.booboo_sound = self.context.createBufferSource();
  self.taken_sound = self.context.createBufferSource();
  self.poi_finish_sound = self.context.createBufferSource();

  self.poi_sound.buffer = bufferList[0];
  self.poi_persisted_sound_buffer = bufferList[0];
  self.hearhear_sound.buffer = bufferList[1];
  self.hearhear_persisted_sound_buffer = bufferList[1];
  self.booboo_sound.buffer = bufferList[2];
  self.booboo_persisted_sound_buffer = bufferList[2];
  self.taken_sound.buffer = bufferList[3];
  self.taken_persisted_sound_buffer = bufferList[3];
  self.poi_finish_sound.buffer = bufferList[4];
  self.poi_finish_persisted_sound_buffer = bufferList[4];

  self.poi_sound.connect(self.context.destination);
  self.hearhear_sound.connect(self.context.destination);
  self.booboo_sound.connect(self.context.destination);
  self.taken_sound.connect(self.context.destination);
  self.poi_finish_sound.connect(self.context.destination);

}




function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload.call(appmgr.sound_mgr, loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}