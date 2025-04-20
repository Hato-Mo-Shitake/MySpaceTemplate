```dataviewj
const tFile = app.vault.getFileByPath("System/_env/testScheme.md");
const fileText = await app.vault.cachedRead(tFile);
const json = fileText.slice(7, -3);
console.log(json);
const obj = JSON.parse(json);
console.log(obj);
dv.el("d", obj);
```
















