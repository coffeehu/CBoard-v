const domUtils = {
	width:function(el){
		if(this.isWindow(el)){
			return window.document.documentElement.clientWidth;
		}
		return this.getWidthOrHeight(el,'width','content');
	},
	inWidth:function(el){
		return this.getWidthOrHeight(el,'width','padding');
	},
	outWidth:function(el,margin){
		var extra = margin?'margin':'border';
		return this.getWidthOrHeight(el,'width',extra);
	},
	height:function(el){
		if(this.isWindow(el)){
			return window.document.documentElement.clientHeight;
		}
		return this.getWidthOrHeight(el,'height','content');
	},
	inHeight:function(el){
		return this.getWidthOrHeight(el,'height','padding');
	},
	outHeight:function(el,margin){
		var extra = margin?'margin':'border';
		return this.getWidthOrHeight(el,'height',extra);
	},
	getWidthOrHeight:function(el,type,extra){
		var isHide = false;
		var _display, _visibility;
		if(el.style.display === 'none') { //不可见
			isHide = true;
			_display = el.style.display, 
			_visibility = el.style.visibility;
			el.style.display = 'block';
			el.style.visibility = 'hidden';
		}

		var styles = this.getStyle(el),
			val = this.curCSS(el,type,styles),
			isBorderBox = this.curCSS(el,'boxSizing',styles) === 'border-box';

		if(val === 'auto'){
			val = el['offset'+type[0].toUpperCase()+type.slice(1)];
		}

		val = parseFloat(val)||0;
		
		var finalVal = ( val + this.argumentWidthOrHeight(el,type,extra,isBorderBox,styles) );

		if(isHide){
			el.style.display = _display;
			el.style.visibility = _visibility;
		}

		return finalVal;
	},
	getStyle:function(el){
		var view = el.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( el );
	},
	curCSS:function(el,type,styles){
		var val;
		if(styles){
			val = styles.getPropertyValue(type) || styles[type];
		}
		return val;
	},
	//当为 borderBox 时，width 宽度为 content+padding+border
	argumentWidthOrHeight:function(el,type,extra,isBorderBox,styles){
		var val = 0, that = this;
		var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
		var i;

		if(extra === (isBorderBox?'border':'content') ){ // 此时不需要进行padding、border、margin的加减，所以不参与循环
			i = 4;
		}else{
			i = ( type==='width' ? 1 : 0 );			
		}

		for(;i<4;i=i+2){

			if(extra === 'margin'){
				val += parseFloat( that.curCSS(el, 'margin'+cssExpand[i], styles) );
			}

			// 当为 border-box 时，减去
			if(isBorderBox){
				// padding 和 content 时都会减去 border
				if(extra !== 'margin'){
					val -= parseFloat( that.curCSS(el, 'border'+cssExpand[i]+'Width', styles) );
				}

				if(extra === 'content'){
					val -= parseFloat( that.curCSS(el, 'padding'+cssExpand[i], styles) );
				}
			}else{
				if(extra !== 'content'){
					val += parseFloat( that.curCSS(el, 'padding'+cssExpand[i], styles) );
				}
				if(extra === 'border'|| extra === 'margin'){
					val += parseFloat( that.curCSS(el, 'border'+cssExpand[i]+'Width', styles) );
				}
			}

		}
		return val;
	},
	isWindow:function( obj ) {
		return obj != null && obj === obj.window;
	},
	css:function(el,name,value){
		// 取值
		if(typeof name === 'string' && value === undefined){
			var styles = this.getStyle(el);
			var val = this.curCSS(el,name,styles);
			return val;
		}

		// 赋值		
		var type = typeof name,
		i;
		if(type === 'string'){
			this.style(el,name,value);
		}else if(type === 'object'){
			for(i in name){
				this.style(el,i,name[i]);
			}
		}
	},
	style:function(el,name,value){
		var type = typeof value,
			style = el.style;
		if ( value !== undefined ) {

			if(type === 'number'){
				value += this.cssNumber[name]?'':'px';
			}

			style[ name ] = value;
		}
	},
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},
	remove:function(el){
		var p = el.parentNode;
		if(p){
			el.parentNode.removeChild( el );
		}
		return el;
	},
	hasClass:function(el,value){
		var className = ' '+value+' ';
		var curValue = el.getAttribute && el.getAttribute('class') || '';
		var cur = ' '+this.stripAndCollapse(curValue)+' ';

		if(cur.indexOf(className) > -1){
			return true;
		}
		return false;
	},
	addClass:function(el, value){
		var classes = this.classesToArray(value),
		curValue,cur,j,clazz,finalValue;

		if(classes.length>0){
			curValue = el.getAttribute && el.getAttribute('class') || '';
			cur = ' '+this.stripAndCollapse(curValue)+' ';

			if(cur){
				var j=0;
				while( (clazz = classes[j++]) ){
					if ( cur.indexOf( ' ' + clazz + ' ' ) < 0 ) {
						cur += clazz + ' ';
					}
				}

				finalValue = this.stripAndCollapse(cur);
				if(curValue !== finalValue){
					el.setAttribute('class',finalValue);
				}
			}
		}
	},
	removeClass:function(el, value){
		var classes = this.classesToArray(value),
		curValue,cur,j,clazz,finalValue;

		if(classes.length>0){
			curValue = el.getAttribute && el.getAttribute('class') || '';
			cur = ' '+this.stripAndCollapse(curValue)+' ';

			if(cur){
				var j=0;
				while( (clazz = classes[j++]) ){
					if ( cur.indexOf( ' ' + clazz + ' ' ) > -1 ) {
						cur = cur.replace(' '+clazz+' ' ,' ');
					}
				}

				finalValue = this.stripAndCollapse(cur);
				if(curValue !== finalValue){
					el.setAttribute('class',finalValue);
				}
			}
		}
	},
	stripAndCollapse:function(value){
		var htmlwhite = ( /[^\s]+/g );
		var arr = value.match(htmlwhite)||[];
		return arr.join(' ');
	},
	classesToArray:function(value){
		if ( Array.isArray( value ) ) {
			return value;
		}
		if ( typeof value === "string" ) {
			var htmlwhite = ( /[^\s]+/g );
			return value.match( htmlwhite ) || [];
		}
		return [];
	},
	extend:function(){
		var target  = arguments[0],
			i = 1,
			length = arguments.length,
			obj,copy,name;

		for(;i<length;i++){
			obj = arguments[i];
			for(name in obj){
				copy = obj[name];
				target[name] = copy;
			}
		}

		return target;
	},
	addHandler : function(element, type, handler){
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		}
		else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		}else {
			element["on" + type] = handler;
		}
	},
	removeHandler : function(element, type, handler){
		if(element.removeEventListener){
			element.removeEventListener(type, handler, false);
		}else if(element.attachEvent){
			element.detachEvent("on"+type, handler);
		}else{
			element["on" + type] = null;
		}
	},
	one:function(el,type,fn){
		var origFn = fn;
		fn = function(){
			el.removeEventListener(type,fn,false);
			return origFn();
		};
		el.addEventListener(type,fn,false);
	},
	addcss:function(){
        var id = 'hc-layer-css';
        if(document.getElementById(id)) return;
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        var path = this.getPath();
        link.rel = 'stylesheet';
        link.href = path + '../css/hclayer.css';
        link.id = id;
        head.appendChild(link);
    },
    getScrollBarWidth: function() {
    	var scrollBarWidth;
		var outer = document.createElement('div');
		outer.className = 'h-scrollbar--wrap';
		outer.style.visibility = 'hidden';
		outer.style.width = '100px';
		outer.style.position = 'absolute';
		outer.style.top = '-9999px';
		document.body.appendChild(outer);

		var widthNoScroll = outer.offsetWidth;
		outer.style.overflow = 'scroll';

		var inner = document.createElement('div');
		inner.style.width = '100%';
		outer.appendChild(inner);

		var widthWithScroll = inner.offsetWidth;
		outer.parentNode.removeChild(outer);
		scrollBarWidth = widthNoScroll - widthWithScroll;

		return scrollBarWidth;
    }
};

export default domUtils;