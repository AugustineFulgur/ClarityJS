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
    //3. 简化重定义；简化函数声明 这个是给mss写的
    if (tps.isIdentifier(n.id) && tps.isArrowFunctionExpression(n.init) && n.init.params.length === 0) {
        // 支持两种情况：
        // 1. 函数体是块语句且只有一个返回语句 ({ return xxx; })
        // 2. 函数体是表达式 (直接返回表达式结果)
        
        let returnValue;
        if (tps.isBlockStatement(n.init.body)) {
            // 检查函数体是否只有一个返回语句
            const body = n.init.body.body;
            if (body.length === 1 && tps.isReturnStatement(body[0])) {
                returnValue = body[0].argument;
            } else {
                // 不符合简化条件
                return;
            }
        } else {
            // 函数体是表达式，可以直接使用
            returnValue = n.init.body;
        }

        // 获取左值的所有绑定
        let binding = p.scope.getBinding(n.id.name);
        if (!binding || binding.constantViolations.length > 0) return;
        
        count += 1;
        let v = 0;
        
        // 替换所有引用为返回值
        binding.referencePaths.map((rpath) => {
            // 克隆节点以防修改原始AST
            const clonedReturnValue = tps.cloneDeep(returnValue);
            rpath.replaceWith(clonedReturnValue);
            v++;
        });
        
        if (v != 0 && v === binding.referencePaths.length) {
            // 左值没有其它被引用的地方了，删除左值的声明
            p.remove();
        }
    }

}

module.exports = { 
    main: [{
        "VariableDeclarator": on_start 
    }],
    c: ()=>{return count;}, //天才出生了
    n: __name__
};