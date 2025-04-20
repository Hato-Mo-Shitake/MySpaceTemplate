---
tags:
  - MOC
belongsTo:
  - "[[🌎HOME]]"
---

```dataviewjs
const folderDir = '"System/_env/propertyOptions"';
const files = dv.pages(folderDir).values;
// console.log(all);
const curretFolder = dv.current().file.folder;
const result = {};
files.forEach(f => {
	const folder = f.file.folder.replace(folderDir.slice(1, -1) + '/', '');
	if (folder === curretFolder) {
		return;
	}
	if(!Object.keys(result).includes(folder)){
		result[folder] = [f.file];
	} else {
		result[folder].push(f.file);
	}
});

Object.keys(result).forEach(key => {
	dv.el('d', `### ${key}（${result[key].length}）`);
	dv.list(result[key].map(f => `${f.link}（${f.inlinks.length}）`));
});
```













