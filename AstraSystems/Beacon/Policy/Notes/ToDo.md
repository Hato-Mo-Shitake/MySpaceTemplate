# Properties
### created
Type: Date & time
Value: Free 
### tags
Type: Tags
Value: 「ToDo」＋Free 
### toDo
Type: Text
Value: 
```dataviewjs
const list = dv.pages('"☼MOCs/PropertyMOCs/toDoCategory"').values.map(f => f.file.link).sort().reverse();
dv.list(list);
```
### progress
Type: Number
Value: 1~100 
### resolved
Type: Date & time
Value: Free 
### relatesTo
Type: List
Value: Free 
### belongsTo
Type: List
Value: Free 