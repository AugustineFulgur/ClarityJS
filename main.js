const fs = require("fs");
const parser = require("@babel/parser"); 
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');
const requireAll = require('require-all'); // 引入require-all
const cj = requireAll(__dirname + '/fragment');

cj.rename.startwith("00")
const __main__=[
    //请注意调用顺序，比如手，ff.rename推荐最后调用
    //cj.redefined,
    //cj.rename,
    //cj.propertyclear,
    cj.constclear
]

//待解混淆文件
const jscode = fs.readFileSync(
    './111.js', {
        encoding: 'utf-8'
    }
);
console.log(jscode);
let ast = parser.parse(jscode);//js转ast

__main__.forEach(e => {
    traverse.default(ast, e.main);
    console.log("【"+e.n+"】"+"执行完毕，执行了"+e.c()+"次。");
});

let {code} = generator.default(ast,opts = {jsescOption:{"minimal":true}})
console.log(code);
//输出文件
fs.writeFile('./222.js', code, (err) => {});


