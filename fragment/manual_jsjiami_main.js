const tps = require('@babel/types');//类型
const __name__="【UNSAFE】【MANUAL】还原类jsjiami混淆函数-需要补充参数";
let count=0;

const FUNCNAME=""; // 需要补充量：解密函数名

// 还需要补充前几个函数的内容，直接复制粘贴在这个代码里就可以，判断方法和依赖在我文章里有写，自己找一下惹

function exec_func(p){
    if(p.node.callee.name==FUNCNAME){

        //查找所有0x3dea的引用
        let re=eval(FUNCNAME+"("+p.node.arguments[0].value+")"); //执行结果
        console.log(re);
        p.replaceWith(tps.stringLiteral(re)); //直接替换为结果
    }
}


module.exports = { 
    main: [{
        "CallExpression":exec_func
    }],
    c: ()=>{return count;}, //天才出生了
    n: __name__
};