/**
 * [Slider plugin]
 * @author Flower
 * @date  2016/4/29
 */
function Slider( options, id ){
	var self = this;
	var isScroll = false;
    if( arguments.length != arguments.callee.length ){
    	throw new Error( 'params error' );
    	return;
    }
    function getVendorPrefix() {
	  // 使用body是为了避免在还需要传入元素
	  var body = document.body || document.documentElement,
	    style = body.style,
	    vendor = ['webkit', 'khtml', 'moz', 'ms', 'o'],
	    i = 0;
	 
	  while (i < vendor.length) {
	    // 此处进行判断是否有对应的内核前缀
	    if (typeof style[vendor[i] + 'Transition'] === 'string') {
	      return vendor[i];
	    }
	    i++;
	  }
	}
	/**
	 * [getHeight get the doucment height]
	 */
	var getHeight = function(){
		return document.body.clientHeight || document.documentElement.clientHeight;
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
	self.pages = [];
	for( var i=0;i<options.pageNum;i++){
		self.pages.push({index:i});
	}
	var _currentIndex = Math.round( $(window).scrollTop()/getHeight()||0 );

	self.currentPage = self.pages[_currentIndex];
	$('#'+id + ' .controller li').eq(_currentIndex).addClass('active');
	
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
		if( isScroll || index<0 || (index+1)>self.pages.length || (index+1)>options.pageNum ) return;
		isScroll = true;
		(getVendorPrefix()=='webkit'?$( 'body' ):$('html')).animate({ scrollTop: index*getHeight() }, aniTime|| options.aniSpeed, function(){
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




