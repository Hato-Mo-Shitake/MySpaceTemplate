# optionsSourcePath
- System/`_`env/propertyOptions
# Inbox
## alias
- MyNote
## module
- MyNoteModule
## defaultProperties
### created
#### dataType
- string
#### description
- 作成日のデイリーノートへのリンク

### tags
#### dataType
- array
#### description
- タグ。
#### note
- 先頭の要素がメインの「noteKind」になる。取得時はフロントマター配下のtagsを参照すること。

### relatesTo
#### dataType
- array
#### description
- 関連ノートの内部リンク

### belongsTo
#### dataType
- array
#### description
- 親ノートの内部リンク

## commonProperties
### rank
#### dataType
- number
#### description
- 主観的価値度

### references
#### dataType
- array
#### description
- 参考ソース

### ruby
#### dataType
- string
#### description
- ルビ

### progress
#### dataType
- number
#### description
- 進捗度：1-100

### resolved
#### dataType
- datetime
#### description
- 解決日時

### completed
#### dataType
- string
#### description
- 完成時のデイリーノートへのリンク


## childNotes
### CreativeCrate
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- rank
- references


#### alias
- CreativeCrate
#### module
- CreativeCrateNoteModule

### CreativeCrate/Creations
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- ruby
- rank
- references

##### creationLabels
###### dataType
- array
###### description
- subKind
###### options
- true

##### released
###### dataType
- date
###### description
- 公開日

##### creators
###### dataType
- array
###### description
- 作者

##### producedBy
###### dataType
- array
###### description
- 出版元など

##### creMediums
###### dataType
- array
###### description
- 作品媒体
###### options
- true

##### creGenres
###### dataType
- array
###### description
- 作品ジャンル
###### options
- true


#### alias
- Creations
#### module
- CreationsNoteModule

### CreativeCrate/Creations/Characters
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- ruby
- rank
- references

##### creations
###### dataType
- array
###### description
- 登場作品

##### birthday
###### dataType
- date
###### description
- 誕生日

##### age
###### dataType
- array
###### description
- 年齢。作中で年齢が変化するケースを想定し、複数記録できるようarray型

##### gender
###### dataType
- string
###### description
- 性別
###### options
- true

##### creRoles
###### dataType
- array
###### description
- ストーリー面における役割
###### options
- true

##### crePositions
###### dataType
- array
###### description
- 社会的立場。creRolesより客観性の高いモノ。creRolesとの値被りは許可する。
###### options
- true


#### alias
- Characters
#### module
- CharactersNoteModule

### CreativeCrate/Creatorium
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- rank
- references

##### creativeLabels
###### dataType
- array
###### description
- 創作用ノートに対するsubKind
###### options
- true


#### alias
- Creatorium
#### module
- CreatoriumNoteModule

### CreativeCrate/Creatorium/WIPs
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- rank
- references
- progress
- completed

##### wipAspect
###### dataType
- string
###### description
- 作業メモにおけるsubKind
###### options
- true


#### alias
- WIPs
#### module
- WIPsNoteModule

### CreativeCrate/Creatorium/WIPs/Characters
#### alias
- CharactersIP
#### module
- WIPsNoteModule
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- rank
- references
- progress
- completed

##### cipAspect
###### dataType
- string
###### description
- キャラ作成の作業メモにおけるsubKind
###### options
- true



### CreativeCrate/Creatorium/WIPs/Music
#### alias
- MusicIP
#### module
- WIPsNoteModule
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- rank
- references
- progress
- completed

##### cipAspect
###### dataType
- string
###### description
- 音楽作成の作業メモにおけるsubKind
###### options
- true



### CreativeCrate/Creatorium/WIPs/Novels
#### alias
- NovelsIP
#### module
- WIPsNoteModule
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- rank
- references
- progress
- completed

##### cipAspect
###### dataType
- string
###### description
- 小説作成の作業メモにおけるsubKind
###### options
- true



### CreativeCrate/Creators
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- ruby
- rank


#### alias
- Creators
#### module
- CreatorsNoteModule

### FAQ
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- rank
- references
- resolved

##### faqType
###### dataType
- string
###### description
- FAQタイプ
###### options
- true


#### alias
- FAQ
#### module
- FAQNoteModule

### Knowledge
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- ruby
- rank
- references


#### alias
- Knowledge
#### module
- KnowledgeNoteModule

### ToDo
#### properties
##### common
###### source
- this.Inbox.commonProperties
###### keys
- rank
- references
- progress
- resolved

##### toDoType
###### dataType
- string
###### description
- ToDoタイプ
###### options
- true


#### alias
- ToDo
#### module
- ToDoNoteModule



# Daily
## properties
### created
#### dataType
- string
#### description
- 作成日のデイリーノートへのリンク

### tags
#### dataType
- array
#### description
- タグ。先頭の要素は「Daily」取得時はフロントマター配下のtagsを参照すること。

### spending
#### dataType
- number
#### description
- 使ったお金

### rank
#### dataType
- number
#### description
- その日の充実度

### relatesTo
#### dataType
- array
#### description
- 関連ノートの内部リンク



# MOC
## properties
### tags
#### dataType
- array
#### description
- タグ。先頭の要素は「MOC」。取得時はフロントマター配下のtagsを参照すること。

### relatesTo
#### dataType
- array
#### description
- 関連ノートの内部リンク

### belongsTo
#### dataType
- array
#### description
- 親ノートの内部リンク



