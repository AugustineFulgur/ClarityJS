const tps = require('@babel/types');//类型
const generator = require('@babel/generator');
const __name__="简化分支";
let count=0;

function on_start1(p) {
    //1.花指令简化；去除永真if
	if(tps.isBinaryExpression(p.node.test)&&tps.isStringLiteral(p.node.test.left) && tps.isStringLiteral(p.node.test.right)){
		//二元表达式；左边为字符串；右边为字符串；
        count+=1;
		let re=eval(generator.default(p.node.test).code); //获取表达式值
		if(re){ //要么长要么烦
			p.replaceWithMultiple(tps.isBlockStatement(p.node.consequent)?p.node.consequent.body:[p.node.consequent]);
		}else{
			p.replaceWithMultiple(tps.isBlockStatement(p.node.alternate)?p.node.alternate.body:[p.node.alternate]); 
		}
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
    main: {
        "IfStatement": on_start1,  // 只处理if语句节点
        "ConditionalExpression": on_start2 //只处理?:
    },
    c: ()=>{return count;},
    n: __name__
};
