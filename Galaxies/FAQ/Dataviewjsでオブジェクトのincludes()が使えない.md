---
created: "[[2025-03-27_Thu]]"
tags:
  - FAQ
faqType: 
resolved: "[[2025-03-27_Thu]]"
relatesTo:
  - "[[オプショナルチェーン]]"
belongsTo: 
---
dataviewjs
```js

const pages = dv.pages('"99_Test"').where(page => 
	console.log(
		page.belongsTo.includes(`test99`)
	)
)
```
belongsToのプロパティを持たないファイルがある時に、存在しないbelongsToに対してincludesを使おうとすると、
エラー（Evaluation Error: TypeError: Cannot read properties of undefined (reading 'includes')）
が出る。

→オプショナルチェーン演算子（`?.`）で解決

