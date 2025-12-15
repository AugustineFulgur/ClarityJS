const tps = require('@babel/types');//类型
const generator = require('@babel/generator');
const __name__="【UNSAFE】简化分支-IF";
let count=0;

function on_start1(p) {
    //1.花指令简化；去除永真if
    let re=undefined;
	if((tps.isBinaryExpression(p.node.test) && /Literal/.test(p.node.test.left.type) && /Literal/.test(p.node.test.right.type))){
		//二元表达式；左边为常量；右边为常量；       
		re=eval(generator.default(p.node.test).code); //获取表达式值
	}else if((tps.isCallExpression(p.node.test) && tps.isFunctionExpression(p.node.test.callee))){
        //调用；被调用的是匿名函数；参数为常量；
        for(let e of p.node.test.arguments) {
            if(!/Literal/.test(e.type)) return;
        }
        re=eval("("+generator.default(p.node.test).code+")"); //获取表达式值
    }
    if(re===undefined){return;}
    if(re){ //要么长要么烦
        count+=1;
        p.replaceWithMultiple(tps.isBlockStatement(p.node.consequent)?p.node.consequent.body:[p.node.consequent]);
    }else{
        count+=1;
        p.replaceWithMultiple(tps.isBlockStatement(p.node.alternate)?p.node.alternate.body:[p.node.alternate]); 
    }
}

function on_start2(p){
    //2.花指令简化；三目表达式简化
    //我感觉滥用eval会导致开发在里面拉屎，不滥用又太长了，哇塞
    if(p.node.test.value!==undefined){
        count+=1;
        p.replaceWithMultiple(p.node.test.vaule?p.node.consequent:p.node.alternate);
    }
}

module.exports = { 
    main: [{
        "IfStatement": on_start1,  // 只处理if语句节点
        "ConditionalExpression": on_start2 //只处理?:
    }],
    c: ()=>{return count;},
    n: __name__
};
