# Properties
### created
Type: Date & time
Value: Free 
### tags
Type: Tags
Value: 「CreativeCrate/Creatorium/WIPs/Novels」＋Free 
### ruby
Type: Text
Value: Free, but not link
### creations
Type: List
Value: Free 
### birthday
Type: Date
Value: Free 
### age
Type: Number
Value: Free
### gender
Type: Text
Value: 
```dataviewjs
const list = dv.pages('"☼MOCs/PropertyMOCs/gender"').values.map(f => f.file.link).sort().reverse();
dv.list(list);
```
### roles（作中の役割 | positionsとの差別化は要件等）
Type: List
Value: 
```dataviewjs
const list = dv.pages('"☼MOCs/PropertyMOCs/roles"').values.map(f => f.file.link).sort().reverse();
dv.list(list);
```
### positions（社会的立場｜rolesとの差別化は要検討｜rolesより具体的で客観的にも明らかな値がここ｜込める意味が異なるのなら、rolesと被っていもいい。幼なじみ、妹、とか）
Type: List
Value: 
```dataviewjs
const list = dv.pages('"☼MOCs/PropertyMOCs/positions"').values.map(f => f.file.link).sort().reverse();
dv.list(list);
```
### rank
Type: Number
Value: Free
### references
Type: List
Value: Free 
### relatesTo
Type: List
Value: Free 
### belongsTo
Type: List
Value: Free 
