const tps = require('@babel/types');//类型
const __name__="简化属性调用";
let count=0;

function on_start(p){
    if(p.node.computed && tps.isStringLiteral(p.node.property) 
        && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(p.node.property.value)){
        //哇塞这么长
        count+=1;
        p.replaceWith(tps.memberExpression(p.node.object,tps.identifier(p.node.property.value),false));
    }
}

module.exports = { 
    main: {
        "MemberExpression":on_start
    },
    c: ()=>{return count;}, //天才出生了
    n: __name__
};