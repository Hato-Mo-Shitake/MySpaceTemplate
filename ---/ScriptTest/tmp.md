```js
const storageFilePath = 'AstraSystems/Orbits/BuiltSchemas/forNoteTopSection.md'
console.log(
app.vault.getFileByPath(storageFilePath)
);
```

```jsD
        let targetKey = 'properties';
        let removeFunc = function ({ val }) {
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                if (targetKey in val) {
                    delete val.properties;
                }
            }
        }
        console.log(removeFunc);
```
