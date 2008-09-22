/*
	Copyright (c) 2004-2007, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/book/dojo-book-0-9/introduction/licensing
*/


if(!dojo._hasResource["dijit.Dialog"]){dojo._hasResource["dijit.Dialog"]=true;dojo.provide("dijit.Dialog");dojo.require("dojo.dnd.move");dojo.require("dojo.fx");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.form.Form");dojo.declare("dijit.DialogUnderlay",[dijit._Widget,dijit._Templated],{templateString:"<div class=dijitDialogUnderlayWrapper id='${id}_underlay'><div class=dijitDialogUnderlay dojoAttachPoint='node'></div></div>",postCreate:function(){dojo.body().appendChild(this.domNode);this.bgIframe=new dijit.BackgroundIframe(this.domNode);},layout:function(){var _1=dijit.getViewport();var is=this.node.style,os=this.domNode.style;os.top=_1.t+"px";os.left=_1.l+"px";is.width=_1.w+"px";is.height=_1.h+"px";var _4=dijit.getViewport();if(_1.w!=_4.w){is.width=_4.w+"px";}if(_1.h!=_4.h){is.height=_4.h+"px";}},show:function(){this.domNode.style.display="block";this.layout();if(this.bgIframe.iframe){this.bgIframe.iframe.style.display="block";}this._resizeHandler=this.connect(window,"onresize","layout");},hide:function(){this.domNode.style.display="none";if(this.bgIframe.iframe){this.bgIframe.iframe.style.display="none";}this.disconnect(this._resizeHandler);},uninitialize:function(){if(this.bgIframe){this.bgIframe.destroy();}}});dojo.declare("dijit.Dialog",[dijit.layout.ContentPane,dijit._Templated,dijit.form._FormMixin],{templateString:null,templateString:"<div class=\"dijitDialog\">\n\t<div dojoAttachPoint=\"titleBar\" class=\"dijitDialogTitleBar\" tabindex=\"0\" waiRole=\"dialog\">\n\t<span dojoAttachPoint=\"titleNode\" class=\"dijitDialogTitle\">${title}</span>\n\t<span dojoAttachPoint=\"closeButtonNode\" class=\"dijitDialogCloseIcon\" dojoAttachEvent=\"onclick: hide\">\n\t\t<span dojoAttachPoint=\"closeText\" class=\"closeText\">x</span>\n\t</span>\n\t</div>\n\t\t<div dojoAttachPoint=\"containerNode\" class=\"dijitDialogPaneContent\"></div>\n\t<span dojoAttachPoint=\"tabEnd\" dojoAttachEvent=\"onfocus:_cycleFocus\" tabindex=\"0\"></span>\n</div>\n",open:false,duration:400,_lastFocusItem:null,attributeMap:dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap),{title:"titleBar"}),postCreate:function(){dojo.body().appendChild(this.domNode);this.inherited("postCreate",arguments);this.domNode.style.display="none";this.connect(this,"onExecute","hide");this.connect(this,"onCancel","hide");},onLoad:function(){this._position();this.inherited("onLoad",arguments);},_setup:function(){this._modalconnects=[];if(this.titleBar){this._moveable=new dojo.dnd.Moveable(this.domNode,{handle:this.titleBar});}this._underlay=new dijit.DialogUnderlay();var _5=this.domNode;this._fadeIn=dojo.fx.combine([dojo.fadeIn({node:_5,duration:this.duration}),dojo.fadeIn({node:this._underlay.domNode,duration:this.duration,onBegin:dojo.hitch(this._underlay,"show")})]);this._fadeOut=dojo.fx.combine([dojo.fadeOut({node:_5,duration:this.duration,onEnd:function(){_5.style.display="none";}}),dojo.fadeOut({node:this._underlay.domNode,duration:this.duration,onEnd:dojo.hitch(this._underlay,"hide")})]);},uninitialize:function(){if(this._underlay){this._underlay.destroy();}},_position:function(){if(dojo.hasClass(dojo.body(),"dojoMove")){return;}var _6=dijit.getViewport();var mb=dojo.marginBox(this.domNode);var _8=this.domNode.style;_8.left=Math.floor((_6.l+(_6.w-mb.w)/2))+"px";_8.top=Math.floor((_6.t+(_6.h-mb.h)/2))+"px";},_findLastFocus:function(_9){this._lastFocused=_9.target;},_cycleFocus:function(_a){if(!this._lastFocusItem){this._lastFocusItem=this._lastFocused;}this.titleBar.focus();},_onKey:function(_b){if(_b.keyCode){var _c=_b.target;if(_c==this.titleBar&&_b.shiftKey&&_b.keyCode==dojo.keys.TAB){if(this._lastFocusItem){this._lastFocusItem.focus();}dojo.stopEvent(_b);}else{while(_c){if(_c==this.domNode){if(_b.keyCode==dojo.keys.ESCAPE){this.hide();}else{return;}}_c=_c.parentNode;}if(_b.keyCode!=dojo.keys.TAB){dojo.stopEvent(_b);}else{if(!dojo.isOpera){try{this.titleBar.focus();}catch(e){}}}}}},show:function(){if(!this._alreadyInitialized){this._setup();this._alreadyInitialized=true;}if(this._fadeOut.status()=="playing"){this._fadeOut.stop();}this._modalconnects.push(dojo.connect(window,"onscroll",this,"layout"));this._modalconnects.push(dojo.connect(document.documentElement,"onkeypress",this,"_onKey"));var ev=typeof (document.ondeactivate)=="object"?"ondeactivate":"onblur";this._modalconnects.push(dojo.connect(this.containerNode,ev,this,"_findLastFocus"));dojo.style(this.domNode,"opacity",0);this.domNode.style.display="block";this.open=true;this._loadCheck();this._position();this._fadeIn.play();this._savedFocus=dijit.getFocus(this);setTimeout(dojo.hitch(this,function(){dijit.focus(this.titleBar);}),50);},hide:function(){if(!this._alreadyInitialized){return;}if(this._fadeIn.status()=="playing"){this._fadeIn.stop();}this._fadeOut.play();if(this._scrollConnected){this._scrollConnected=false;}dojo.forEach(this._modalconnects,dojo.disconnect);this._modalconnects=[];this.connect(this._fadeOut,"onEnd",dojo.hitch(this,function(){dijit.focus(this._savedFocus);}));this.open=false;},layout:function(){if(this.domNode.style.display=="block"){this._underlay.layout();this._position();}}});dojo.declare("dijit.TooltipDialog",[dijit.layout.ContentPane,dijit._Templated,dijit.form._FormMixin],{title:"",_lastFocusItem:null,templateString:null,templateString:"<div class=\"dijitTooltipDialog\" >\n\t<div class=\"dijitTooltipContainer\">\n\t\t<div class =\"dijitTooltipContents dijitTooltipFocusNode\" dojoAttachPoint=\"containerNode\" tabindex=\"0\" waiRole=\"dialog\"></div>\n\t</div>\n\t<span dojoAttachPoint=\"tabEnd\" tabindex=\"0\" dojoAttachEvent=\"focus:_cycleFocus\"></span>\n\t<div class=\"dijitTooltipConnector\" ></div>\n</div>\n",postCreate:function(){this.inherited("postCreate",arguments);this.connect(this.containerNode,"onkeypress","_onKey");var ev=typeof (document.ondeactivate)=="object"?"ondeactivate":"onblur";this.connect(this.containerNode,ev,"_findLastFocus");this.containerNode.title=this.title;},orient:function(_f){this.domNode.className="dijitTooltipDialog "+" dijitTooltipAB"+(_f.charAt(1)=="L"?"Left":"Right")+" dijitTooltip"+(_f.charAt(0)=="T"?"Below":"Above");},onOpen:function(pos){this.orient(pos.corner);this._loadCheck();this.containerNode.focus();},_onKey:function(evt){if(evt.keyCode==dojo.keys.ESCAPE){this.onCancel();}else{if(evt.target==this.containerNode&&evt.shiftKey&&evt.keyCode==dojo.keys.TAB){if(this._lastFocusItem){this._lastFocusItem.focus();}dojo.stopEvent(evt);}else{if(evt.keyCode==dojo.keys.TAB){evt.stopPropagation();}}}},_findLastFocus:function(evt){this._lastFocused=evt.target;},_cycleFocus:function(evt){if(!this._lastFocusItem){this._lastFocusItem=this._lastFocused;}this.containerNode.focus();}});}