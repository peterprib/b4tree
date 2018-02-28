

# bplustree
Implements btree plus logic


## Usage
const BPlusTree=require('./bplustree');
var tree = new BPlusTree({order: 10});
tree.insert(key,value);
tree.upsert(key,value);
tree.update(key,value);
tree.between(keyfrom,keyto,function(key,value) {});
tree.getData(key,function(key,value) {})
	if function not provided returns value

walk=function(functionNode,functionNodeBefore,functionNodeBefore)
	by default walks tree writing nodes to console log
## Developing
delete


### Tools
