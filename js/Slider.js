/**
 * [Slider plugin]
 * @param {[type]} options [description]
 * @param string id  for flower-slider's id
 */
function Slider( options, id ){
	var self = this;
	var isScroll = false;
    if( arguments.length != arguments.callee.length ){
    	throw new Error( 'params error' );
    	return;
    }
    /**
     * [defaultOpts initial the params]
     */
    var defaultOpts = {
    	pageNum: 1,
    	aniSpeed: 600,
    	resizeTime: 300,
    	slideByPage: false
    };
    var options = $.extend(defaultOpts, options);
    console.log( 'options', options );
    
	self.pages = [];
	for( var i=0;i<options.pageNum;i++){
		self.pages.push({index:i});
	}
	self.currentPage = self.pages[0];
	
	if( !jQuery ){
		throw new Error( 'please import jQuery before using this plugin' );
		return;
	}
	/**
	 * [scrollGo controls the scroll height]
	 * @param index: which pages scroll to;
	 * @param aniTime: how long animation lasts
	 */
	var scrollGo = function( index, aniTime ){
		if( isScroll || index<0 || index>self.pages.length) return;
		isScroll = true;
		$( 'html, body' ).animate({ scrollTop: index*getHeight() }, aniTime|| options.aniSpeed, function(){
			isScroll = false;
		});
		self.currentPage = self.pages[index];
		$('#'+id + ' .controller li').each(function(i){
			$(this).removeClass('active');
			if( i == self.currentPage.index ){
				$(this).addClass('active');
			};
		})
	}
	/**
	 * [getHeight get the doucment height]
	 */
	var getHeight = function(){
		return document.body.clientHeight || document.documentElement.clientHeight;
	}
	$('#'+id + ' .controller li').click(function(event){
	    scrollGo($(this).index());
	});
	$(window).resize(function(event) {
		var wHeight = document.body.clientHeight || document.documentElement.clientHeight;
		scrollGo(self.currentPage.index, options.resizeTime);
	});
	if(options.slideByPage){
		$('body').css({"overflow":"hidden"});
        $(window).scroll(function(event){
      	    var wHeight = getHeight();
      	    if( $(window).scrollTop()>self.currentPage.index*wHeight ){
      		    scrollGo(self.currentPage.index+1);
      	    }else if( $(window).scrollTop()<self.currentPage.index*wHeight ){
      		    scrollGo( self.currentPage.index-1);
      	    }
        });

        if(document.addEventListener){//W3C
		    document.addEventListener('DOMMouseScroll',function(event){
		    	console.log( 'event', event);
		    	event.wheelDeltaY > 0?scrollGo( self.currentPage.index-1):scrollGo(self.currentPage.index+1);
		    },false);
		}
		window.onmousewheel=document.onmousewheel=function(event){//IE/Opera/Chrome
			event.wheelDeltaY > 0?scrollGo( self.currentPage.index-1):scrollGo(self.currentPage.index+1);
		};
	};
	this.slide = function( index ){
		if( index != self.currentPage.index ){
			scrollGo(index);
		}
	}
}
Slider.prototype.next = function(){
	console.log( 'this', this );
	if( this.currentPage.index < this.pages.length-1 ){
		this.slide( this.currentPage.index +1 );
	}
}
Slider.prototype.prev = function(){
	if( this.currentPage.index >0 ){
		this.slide( this.currentPage.index - 1 );
	}
}
Slider.prototype.go = function( index ){
	if( index >0 && index <= this.pages.length ){
		this.slide( index );
	}
}

var slider = new Slider({
	pageNum:4,
    aniSpeed: 1000,
    slideByPage: true
}, 'flowerSlider');


