//无限循环版本
const __name__="变量重命名";
let rename_startwith="_0x";
let count=0;

//----------------------------------------------------------------------------------------------
//注：不要在最开始调用，由于混淆程序一般会创建非常多个变量->这个函数很有可能会卡死。
//----------------------------------------------------------------------------------------------

function get_unique(p) {
    const c = "qwertyuiopasdfghjklzxcvbnm";
    let n = "", len = 1, i = 0;
    while (true) {
        n = Array(len).fill(0).map(() => c[i++ % c.length]).join('');
        const name = p.scope.parent ? n : `global_${n}`;
        if (!p.scope.hasBinding(name, true)) return name;
        if (i % Math.pow(c.length, len) === 0) len++;
    }
}

function on_start(p){
    //变量重命名
    Object.keys(p.scope.bindings).forEach(v=>{
        //遍历所有变量绑定
        if(v.startsWith(rename_startwith)){
            //只处理_0x开头的
            count+=1;
            let __=get_unique(p);
            //console.log(__);
            let bind=p.scope.bindings[v];
            //处理变量的情况
            if(bind.path.isVariableDeclarator()){
                bind.path.node.id.name=__;
            }
            else if(bind.path.isFunctionDeclaration()||
                    bind.path.isFunctionExpression()){
                //处理函数的情况
                let index=bind.path.node.params.findIndex(p => p.name === v);
                if(index!=-1){
                    bind.path.node.params[index].name = __;
                }
            }
            bind.referencePaths.forEach(r => {
                r.node.name = __;
            });
            //更新作用域绑定
            p.scope.rename(v, __);
        }
    });
    
}

module.exports = { 
    main: {
        "Program":on_start,"Function":on_start
    },
    c: ()=>{return count;}, //天才出生了
    n: __name__,
    startwith: (s)=>{rename_startwith=s;}
};