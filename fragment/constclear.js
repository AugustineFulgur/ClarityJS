const tps = require('@babel/types');//类型
const generator = require('@babel/generator');
const __name__="简化常量算式";
let count=0;
let time=5; //遍历次数
//常量优化

//----------------------------------------------------------------------------------------------
//注：这里使用了eval函数，搞混淆的大哥们可以不要往代码里拉屎吗
//----------------------------------------------------------------------------------------------


function is_constant(n,dept=0){
    //以前不是支持函数后面跟问号的吗
    //二元
    if(dept>=5) return false;
    if(tps.isBinaryExpression(n)){
        return is_constant(n.left,dept+1) && is_constant(n.right,dept+1);
    }
    //一元
    else if(tps.isUnaryExpression(n)){
        return is_constant(n.argument,dept+1);
    }
    //纯值判断 
    else if(tps.isNumericLiteral(n) || tps.isStringLiteral(n)){
        return !dept==0 //跳过本来就是纯值的部分，节省不必要的执行
        || n.extra?.raw?.startsWith('0x');  //优化0x 这缩进越来越奇怪了，有没有js缩进插件 
    }
    //空数组处理
    else if((tps.isArrayExpression(n) && n.elements?.length === 0)){
        return true;
    }
    else{
        return false;
    }
}

function on_start(p){
    //好想写成巨大的三目运算符集合，但简直是在折磨人
    if(is_constant(p.node)){
        try{
            let re=eval(generator.default(p.node).code);
            count+=1;
            switch(typeof re){
                case "string":
                    p.replaceWith(tps.stringLiteral(re));
                    break;
                case "number": //哇塞 缩进还是我自己敲的
                    p.replaceWith(tps.numericLiteral(re));
                    break;
                case "boolean":
                    p.replaceWith(tps.booleanLiteral(re));
                    break;
            }
        } 
        catch(e){
            //不支持的直接跳过
        }
    }
}

module.exports = { 
    main: {
        "BinaryExpression": on_start,
        "UnaryExpression": on_start,
        "NumericLiteral": on_start
    },
    c: ()=>{return count;}, //天才出生了
    n: __name__,
    maxdept: (s)=>{maxdept=s;}
};