if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
if (!String.prototype.repeat) {
	  String.prototype.repeat = function(count) {
	    'use strict';
	    if (this == null) {
	      throw new TypeError('can\'t convert ' + this + ' to object');
	    }
	    var str = '' + this;
	    count = +count;
	    if (count != count) {
	      count = 0;
	    }
	    if (count < 0) {
	      throw new RangeError('repeat count must be non-negative');
	    }
	    if (count == Infinity) {
	      throw new RangeError('repeat count must be less than infinity');
	    }
	    count = Math.floor(count);
	    if (str.length == 0 || count == 0) {
	      return '';
	    }
	    // Ensuring count is a 31-bit integer allows us to heavily optimize the
	    // main part. But anyway, most current (August 2014) browsers can't handle
	    // strings 1 << 28 chars or longer, so:
	    if (str.length * count >= 1 << 28) {
	      throw new RangeError('repeat count must not overflow maximum string size');
	    }
	    var rpt = '';
	    for (var i = 0; i < count; i++) {
	      rpt += str;
	    }
	    return rpt;
	  }
	}

function LeafNode (order) {
	this.order = order;
	this.isLevelNode = false;
	this.parentNode = null;
	this.nextNode = null;
	this.prevNode = null;
	this.data = [];
}
LeafNode.prototype.getLeaf=function(k) {return this;}
LeafNode.prototype.getData=function(k,f){
		for(var i=0,il=this.data.length; i<il; i++){
			if(this.data[i].key === k) {
				return f? f(k,this.data[i].value) : this.data[i].value;
			}
			if(this.data[i].key>k) {break;}
		}
		return undefined;
	};
LeafNode.prototype.between=function(s,e,f){
		for(var i=0,il=this.data.length; i<il; i++){
			if(this.data[i].key >= s) {
				break;
			}
		}
		var n=this,d;
		while (true) {
			if(i<il) {
				d=n.data[i];
				if(d.key<=e)
				f(d.key,d.value);
				i++;
			} else {
				if(n.nextNode) {
					n=n.nextNode;
					i=0;
					il=n.data.length;
				}else{return};
			}
		}
	};
LeafNode.prototype.split=function(){
		var tmp = new LeafNode(this.order);
		var m = Math.ceil(this.data.length / 2);
		var k = this.data[m-1].key;
		// Copy & shift data
		for(var i=0; i<m; i++) {tmp.data[i] = this.data.shift();}
		tmp.parentNode = this.parentNode;
		tmp.nextNode = this;
		tmp.prevNode = this.prevNode;
		if(tmp.prevNode) {tmp.prevNode.nextNode = tmp;}
		this.prevNode = tmp;
 		if(!this.parentNode){
			var p = new LevelNode(this.order);
			this.parentNode = tmp.parentNode = p;
		}
 		return this.parentNode.insert(k, tmp, this);
	};
LeafNode.prototype.upsert=function(key,value,match,noMatch){
		var i=0,il=this.data.length;
		for(;i<il;i++){
			if(this.data[i].key === key) {
				if(match) {match(k);}
				this.data[i].value = value;
				return null;
			}
			if(this.data[i].key > key) {break;}
		}
		if(noMatch) {noMatch(k);}
		if(this.data[i]) {this.data.splice(i, 0, {"key": key, "value": value});}
		else {this.data.push({"key": key, "value": value});}
		if(this.data.length > this.order) {
			return this.split();
		}
		return null;
	};
LeafNode.prototype.walk=function(f){
		for(var i=0,il=this.data.length;i<il;i++){
			if(f) {f(this.data[i]);}
			else {console.log(this.data[i].key+"->"+this.data[i].value);}
		}
	};
 function LevelNode(order) {
		this.order=order;
		this.maxDatasize=order*2+1;
		this.isLevelNode = true;
		this.parentNode=null;
		this.data=[];
}
LevelNode.prototype.split=function(){
		var i, m= ((this.data.length-1)/2) - (this.order % 2);
		var tmp = new LevelNode(this.order);
		tmp.parentNode = this.parentNode;
		for(i=0; i<m; i++){
			tmp.data[i] = this.data.shift();
		}
		for(i=0,m=tmp.data.length; i<m; i+=2){
			tmp.data[i].parentNode = tmp;
		}
		var key = this.data.shift();
		if(!this.parentNode){
			this.parentNode = tmp.parentNode = new LevelNode(this.order);
		}
		return this.parentNode.insert(key, tmp, this);
	};
 
LevelNode.prototype.insert=function(key, node1, node2){
		if(this.data.length){
			var il=this.data.length,i=1;
			for(; i<il; i+=2){
				if(this.data[i] > key) {break;}
			}
			if(i<il) { // found
				i--;
				this.data.splice(i, 0, node1, key);
			}else{
				this.data[i-1] = node1;
				this.data.push(key,node2);
			}
			if(this.data.length > (this.maxDatasize)){
				return this.split();
			}
			return null;
		}else{
			this.data=[node1,key,node2];
			return this;
		}
	};
LevelNode.prototype.walk=function(f,fb,fa){
		for(var i=0,il=this.data.length;i<il;i+=2){
			if(fb) {fb(this.data[i+1]);}
			if(f) {this.data[i].walk(f,fb,fa);}
			if(fa) {fa(this.data[i+1]);}
		}
	};
LevelNode.prototype.getLeaf=function(k){
		for(var i=1,il=this.data.length; i<il; i+=2){
			if(k <= this.data[i]) {
				break;
			}
		}
		i--;
		return this.data[i].getLeaf(k);
	};

function BPlusTree(options) {
	this.setOptions(options);
	this.root = new LeafNode(this.options.order);
}
BPlusTree.prototype.options= {
		order: 2
	};
BPlusTree.prototype.setOptions=function(options){
	this.options=Object.assign(this.options, options);
	};
BPlusTree.prototype.insert=function(k,v){
		this.root=this.root.getLeaf(k).upsert(k,v,function(k){Error("key already exists, key: "+k)})||this.root;
	};
BPlusTree.prototype.update=function(k,v){
		this.root=this.root.getLeaf(k).upsert(k,v,null,function(k){Error("key not found, key: "+k)})||this.root;
	};
BPlusTree.prototype.upsert=function(k,v){
		this.root=this.root.getLeaf(k).upsert(k,v)||this.root;
	};
BPlusTree.prototype.getData=function(k,f) {
		return this.root.getLeaf(k).getData(k,f);
	};
BPlusTree.prototype.between=function(s,e,f) {
		return this.root.getLeaf(s).between(s,e,f);
	};
BPlusTree.prototype.walk=function(f,fb,fa){
		if(!(f||fb||fa)) {
			if(console.group) {
				var fb=function(k){console.log("level key = "+k);console.group();}
					,fa=function(k){console.groupend();}
					,f=function(n){console.log(n.key+"->"+n.value)};
			} else {
				var level=0
					,fb=function(k){console.log('  '.repeat(level++)+"level key = "+k)}
				,fa=function(k){level--;}
					,f=function(n){console.log('  '.repeat(level)+n.key+"->"+n.value)};
			}
		}
		this.root.walk(f,fb,fa);
	};
module.exports=BPlusTree;