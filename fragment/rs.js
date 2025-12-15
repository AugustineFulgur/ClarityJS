const tps = require('@babel/types');//类型
const generator = require('@babel/generator');
const __name__="简化属性调用";
let count=0;

var dict={};

function func1(p){
    let body=p.node.body.body; //函数体
    if(body.length!==3) return; //三条语句
    if(tps.isVariableDeclaration(body[0]) && tps.isExpressionStatement(body[1]) && tps.isReturnStatement(body[2])){
        //简单判断一下就不写这么详细了
        //人干人机的活
        try{
            dict[p.node.id?.name]=tps.callExpression(
                tps.memberExpression(
                    tps.identifier(body[2].argument?.callee.object.name), //_$kz
                    tps.identifier('apply')
                ),
                [
                    tps.thisExpression(),
                    tps.arrayExpression(body[0].declarations[0].init.elements)
                ]
            );
            //p.remove();    
        }catch(e){console.log(e)} //没有这个判断的义务
        
    }
}

function func2(p){
    if(tps.isIdentifier(p.node.callee) && dict[p.node.callee?.name]){
        count++;
        console.log(generator.default(dict[p.node.callee.name]).code);
        p.replaceWith(tps.cloneNode(dict[p.node.callee.name]));
    }
}

function func3(p){
    try{
        if(dict[p.node.name] && !p.parentPath.isFunctionDeclaration({id:p.node})){
            count++;
            p.replaceWith(tps.cloneNode(dict[p.node.name]));
        }
    }catch(e){}
    
}

module.exports = { 
    main: [{
        "FunctionDeclaration": func1,  //在没什么效果的时候这里可以换成on_start_binary
        "CallExpression": func2, 
        "Identifier": func3
    }],
    c: ()=>{return count;}, //天才出生了
    n: __name__,
    dict: ()=>{return dict;}
};