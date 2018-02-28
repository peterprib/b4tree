	/*eslint-disable unknown-require, no-unused-vars*/
	const BPlusTree=require('../bplustree');
	function akey(i) {return "key"+i;}
	var order = 10;
	var num = 500000;
	var key1 = akey(200000);
	var key2 = akey(300000);
 	var searchCount = 1000;
 	var i,j,x,k;
	// Populate time
	var start = new Date();
	var tree = new BPlusTree({order: order});
	for(i=0; i<num; i++){
		tree.insert(akey(i), i+" - value");
	}
	var end = new Date();
	console.log("Populate B+-tree elapsed time: " + (end - start));
	start = new Date();
	var obj = {};
	for(i=0; i<num; i++){
		obj[akey(i)] = i+" - value";
	}
	end = new Date();
	console.log("Populate object elapsed time: " + (end - start));
 
	start = new Date();
	var arr = [];
	for(i=0; i<num; i++){
		arr[i] = {"key": akey(i), "value":i+"- value"};
	}
	end = new Date();
	console.log("Populate array elapsed time: " + (end - start));
 
	// Search
	start = new Date();
	for(i=0; i<searchCount;i++){
		x = tree.getData(akey(i));
	}
	end = new Date();
	console.log("Search B+-tree elapsed time: " + (end - start));
 
	start = new Date();
	for(i=0; i<searchCount;i++){
		x = obj[akey(i)];
	}
	end = new Date();
	console.log("Search object elapsed time: " + (end - start));
 
	start = new Date();
	for(i=0; i<searchCount;i++){
		k=akey(i);
		for(j=0; j<num; j++){
			if(arr[j].key === akey) {
				x = arr[i].value;
				break;
			}
		}
	}
 
	end = new Date();
	console.log("Search array elapsed time: " + (end - start));	
 
	// Range search
	j=0;
	start = new Date();
	tree.between(key1,key2,function(){j++;});
	end = new Date();
	console.log("Range search B+-tree found "+j+" elapsed time: " + (end - start));
	
	j=0;
	start = new Date();
	for(var p in obj){
		if(key1 <= p && p <= key2){
			x = obj[p];
			j++;
		}
	}
	end = new Date();
	console.log("Range search object "+j+" elapsed time: " + (end - start));
	j=0;
	start = new Date();
	for(i=0; i<arr.length; i++){
		if(key1 <= arr[i].key && arr[i].key <= key2) {
			x = arr[i].data;
			j++;
		}
	}
	end = new Date();
	console.log("Range search array "+j+" elapsed time: " + (end - start));