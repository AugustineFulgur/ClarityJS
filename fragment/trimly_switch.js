const tps = require('@babel/types');//类型
const generator = require('@babel/generator');
const parser = require("@babel/parser");
var count=0;
const __name__="简化分支-SWITCH";

function switchclear(p){
  if(p.node.body.length==2 && (tps.isVariableDeclaration(p.node.body[0]) || tps.isExpressionStatement(p.node.body[0])) && tps.isWhileStatement(p.node.body[1])){
    //先来一个精确识别
    for(let e of p.node.body[1].body.body[0].cases){
      e.consequent.pop()
      let __="";
      e.consequent.forEach(l => {
        __+=generator.generate(l).code;
      });
      //换行、引号 一个比一个烦人
      e.consequent=parser.parse("origin+='"+__.replaceAll(/\\/g,"\\\\").replaceAll(/[\n\r]/g,"").replaceAll(/'/g,'"')+"';").program.body;
    }
    let _=""
    p.node.body.forEach(e => {
      _+=generator.generate(e).code;
    });
    let origin=eval("'use strict';let origin='';"+_+"(function(){ return origin;})()");
    //这里要考虑到return的问题
    p.node.body=parser.parse(""+origin+"").program.body;
    count++;
  }
}

module.exports = { 
    main: [{
        "BlockStatement":switchclear
    }],
    c: ()=>{return count;},
    n: __name__
};
