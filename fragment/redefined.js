const generator = require('@babel/generator');
const tps = require('@babel/types');//类型
const __name__="简化重定义";
let count=0;

function on_start(p){
    let n=p.node;
    //1. 简化重定义；简化两边都是变量的情况
    if(tps.isIdentifier(n.id)&&tps.isIdentifier(n.init)){
        let binding=p.scope.getBinding(n.id.name); //获取左值（id）的所有绑定
        if(!binding || binding.constantViolations.length>0) return; //如果变量值已经被修改就返回 也就是所谓的一致性检测
        count+=1;
        let v=0;
        binding.referencePaths.map((rpath)=>{ //对于左值的所有引用
            rpath.node.name=n.init.name; //替换为右值
            v++;
        });
        if(v!=0&&v===binding.referencePaths.length){
            //左值没有其它被引用的地方了，删除左值的声明
            p.remove();
        }
    }
    //2.简化重定义；简化常量变量
    if(tps.isIdentifier(n.id)&&(tps.isLiteral(n.init)||tps.isUnaryExpression(n.init))){
        //当左值为标识符，右值为简单量时
        count+=1;
        let binding=p.scope.getBinding(n.id.name); //获取左值（id）的所有绑定
        if(!binding || binding.constantViolations.length>0) return;
        let v=0;
        binding.referencePaths.map((rpath)=>{ //对于左值的所有引用
            rpath.node.name=generator.default(n.init).code; //替换为右值
            v++;
        });
        if(v!=0&&v===binding.referencePaths.length){
            //左值没有其它被引用的地方了，删除左值的声明
            p.remove();
        }
    }
}

module.exports = { 
    main: {
        "VariableDeclarator": on_start 
    },
    c: ()=>{return count;}, //天才出生了
    n: __name__
};