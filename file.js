const fs = require("fs");

const txtFileData = fs.readFileSync("./txt/language.txt", "utf-8");

let str = txtFileData.toString();
console.log(str.split("[")[1].split(","));
const strArr = str.split("[")[1].split(",");
strMap = strArr.map((el) => el.split("=>")[0]);

console.log(strMap);
fs.writeFileSync("./txt/lang.json", JSON.stringify(strMap));
console.log("saved successfully");
