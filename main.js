const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');
const requireAll = require('require-all'); // 引入require-all
const cj = requireAll(__dirname + '/fragment');

//cj.rename.startwith("_$");
const __main__ = [
    //请注意调用顺序，比如，ff.rename推荐最后调用
    cj.trimly_switch
];
const __looptime__=1;

//待解混淆文件
var jscode = fs.readFileSync(
    './1.js', {
        encoding: 'utf-8'
    }
);

for(let _=0;_<__looptime__;_++){
    console.log(jscode);
    let ast = parser.parse(jscode); //js转ast
    __main__.forEach(e => {
        e.main.forEach(m => {
            traverse.default(ast, m);
        });
        console.log("【" + e.n + "】" + "执行完毕，执行了" + e.c() + "次。");
    });
    jscode = generator.default(ast, opts = {jsescOption: {"minimal": true}}).code;
    console.log(jscode);
}



//输出文件
fs.writeFile('./1.js', jscode, (err) => {});