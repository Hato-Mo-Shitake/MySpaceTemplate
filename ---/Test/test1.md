---
tags: 
aaa: 
created: "[[2025-03-27_Thu]]"
---
tesdy



<details>
<summary>
	テスト
</summary>
<p>折りたたまれる</p>
</dtails>

```dataviewj

const str = `
[[テスト]]
<details>
<summary>
	テスト
</summary>
<p>折りたたまれる</p>
<ul>
<li>[[りんご]]</li>
</ul>
- ${dv.fileLink("---/Test/test1")}
- [[テスト]]
<a href = "obsidian://open?vault=TemplateVault&file=---%2FTest%2Ftest1">テスト12234</a>
</dtails>

<details>
<summary>
	テスト
</summary>
<p>折りたたまれる</p>
- [ｔｔｔｔ](http//:)
</dtails>
`

dv.el('d', str)


dv.markdown(`
<details>
<summary>開く</summary>
- [[test1]]
- [[test2]]
</details>
`)
```
