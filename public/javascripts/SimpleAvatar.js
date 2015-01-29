define(function(){
	
	function SimpleAvatar(opts){
	
		this.speed = 1;
		this.top = 100;
		this.left = 200;
	
		var canvasContext = opts.$canvas.getContext("2d");
		var imageUrl = opts.imageUrl;
		
		var w =  opts.$canvas.width;
		var h = opts.$canvas.height;
		
		this.canvasW = w;
		this.canvasH = h;
		
		var imageObj = new Image();
		
		var draw = function() {
		    canvasContext.clearRect ( 0 , 0 , w, h);
			canvasContext.drawImage(imageObj, this.left, this.top);		
		};
		
		imageObj.src = imageUrl;
		
		this.draw = draw;
	}
	SimpleAvatar.prototype.moveUp = function(y){
		this.top -= y*this.speed;
		if (this.top < -350) {
			this.top = this.canvasH;
		}
	};
	SimpleAvatar.prototype.moveDown = function(y){
		this.top += y*this.speed;
		if (this.top > this.canvasH) {
			this.top = -350;
		}
	};
	SimpleAvatar.prototype.moveLeft = function(x){
		this.left -= x*this.speed;
		if (this.left < -180) {
			this.left = this.canvasW;
		}
	};
	SimpleAvatar.prototype.moveRight = function(x){
		this.left += x*this.speed;
		if (this.left > this.canvasW) {
			this.left = -180;
		}
	};

	return SimpleAvatar;

});