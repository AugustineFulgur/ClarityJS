const generator = require('@babel/generator');
var count=0;
var l={};
const __name__="Object重映射";

//还原：{} obj格式的混淆 jsjiami 高级

function replace_0x_obj(p){
  if(Object.keys(l).includes(p.node.object.name)){
    let ps=l[p.node.object.name]; //好麻烦
    var re;
    ps.forEach(e=>{if(e.key.value==p.node.property.name) {re=e.value;}})
    if(!re) return;
    if(re.type==='StringLiteral' || re.type==='FunctionExpression' || re.type==="MemberExpression"){ //其实不用在意这么多 直接全部replaceWidth就行
      //对于 a={b:c.d}情况、常量的情况、调用的情况。全部照搬
      count++;
      p.replaceWith(re);
    }
  }
}

function get_objvars(p){
  if(p.node.declarations[0].init && p.node.declarations.length==1 && p.node.declarations[0].init.type=="ObjectExpression"){
    let binding = p.scope.getBinding(p.node.declarations[0].id.name);
    if(binding && !binding.constantViolations.length){
      console.log("找到变量"+p.node.declarations[0].id.name);
      l[p.node.declarations[0].id.name]=p.node.declarations[0].init.properties;
      p.remove();
    }
  }
}

module.exports = { 
    main: [
        {"VariableDeclaration":get_objvars},
        {"MemberExpression":replace_0x_obj}
    ],
    c: ()=>{return count;}, //天才出生了
    n: __name__
};