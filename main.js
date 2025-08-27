const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');
const requireAll = require('require-all'); // 引入require-all
const cj = requireAll(__dirname + '/fragment');

const __main__ = [
    //请注意调用顺序，比如，ff.rename推荐最后调用
    //cj.redefined,
    //cj.rename,
    //cj.propertyclear,
    cj.constclear,
    cj.propertyclear,
]

//待解混淆文件
let jscode = fs.readFileSync(
    './111.js', {
        encoding: 'utf-8'
    }
);

//console.log(jscode);

let ast = parser.parse(jscode); //js转ast
__main__.forEach(e => {
    traverse.default(ast, e.main);
    console.log("【" + e.n + "】" + "执行完毕，执行了" + e.c() + "次。");
});
jscode = generator.default(ast, opts = {
    jsescOption: {
        "minimal": true
    }
}).code;

//console.log(code);

//输出文件
fs.writeFile('./222.js', jscode, (err) => {});