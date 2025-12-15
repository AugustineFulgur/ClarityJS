const tps = require('@babel/types');
const __name__ = "非常规变量重命名";
let count = 0;
const __m = new Map(); // 记录已重命名的变量映射
const scopeCounters = new WeakMap(); // 作用域计数器

//这一节因为苯人算不清数所以用der包写的 谢谢。 有问题就是der包的问题

function get_unique_name(scope) {
    if (!scopeCounters.has(scope)) {
        scopeCounters.set(scope, { n: 1 });
    }
    const counter = scopeCounters.get(scope);
    
    while (true) {
        const name = "a" + counter.n;
        if (!scope.hasBinding(name, true)) {
            counter.n++;
            return name;
        }
        counter.n++;
    }
}

function on_start(p) {
    const node = p.node;
    
    // 只处理标识符
    if (!tps.isIdentifier(node)) {
        return;
    }
    
    const scope = p.scope;
    const originalName = node.name;
    // 如果变量名已经是合法的（以字母或下划线开头），跳过
    if (/^[a-zA-Z_]/.test(originalName)) {
        return;
    }
    // 如果已经处理过这个变量名，直接应用重命名
    if (__m.has(originalName)) {
        node.name = __m.get(originalName);
        return;
    }
    const newName = get_unique_name(scope);
    __m.set(originalName, newName);
    count++;
    
    // 重命名当前标识符
    node.name = newName;
    
    // 获取绑定信息（如果有）
    const binding = scope.getBinding(originalName);
    if (!binding) {
        return; // 如果没有绑定信息，可能是未声明的变量或全局变量
    }
    
    // 重命名所有引用
    binding.referencePaths.forEach(refPath => {
        if (tps.isIdentifier(refPath.node)) {
            refPath.node.name = newName;
        }
    });
    
    // 重命名声明
    if (binding.path) {
        const declNode = binding.path.node;
        if (tps.isVariableDeclarator(declNode) && tps.isIdentifier(declNode.id)) {
            declNode.id.name = newName;
        } else if (tps.isFunctionDeclaration(declNode) && tps.isIdentifier(declNode.id)) {
            declNode.id.name = newName;
        } else if (tps.isFunctionExpression(declNode) && tps.isIdentifier(declNode.id)) {
            declNode.id.name = newName;
        } else if (tps.isClassDeclaration(declNode) && tps.isIdentifier(declNode.id)) {
            declNode.id.name = newName;
        }
    }
    
    // 更新作用域绑定
    scope.removeBinding(originalName);
    scope.bindings[newName] = binding;
}

module.exports = { 
    main: {
        "Identifier": on_start 
    },
    c: () => count,
    n: __name__,
};