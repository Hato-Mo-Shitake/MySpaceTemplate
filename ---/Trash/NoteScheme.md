
モジュールはビルドする時に付け足すようにしよう
alias+NoteModuleって名前で。
ただ、明示的に異なるモノを使う時は、指定する。
aliasも同名の場合は付けない。
てか、それぞれのメイン処理に合わせたJSONをそれぞれ用意するでもいいか。必要なとこだけ、効率的な構造で出力する。
```JSON
{
	"schemaVersion": "1.0.0",
	"optionsSourcePath": "System/_env/Properties",
	"Inbox": {
		"alias": "MyNote",
		"module": "MyNoteModule",
		"defaultProperties": {
			"created": {
				"dataType": "string",
				"description": "作成日のデイリーノートへのリンク"
			},
			"tags": {
				"dataType": "array",
				"description": "タグ。先頭の要素がメインの「noteKind」。取得時はフロントマター配下のtagsを参照すること。"
				},
			"relatesTo": {
				"dataType": "array",
				"description": "関連ノートの内部リンク"
			},
			"belongsTo": {
				"dataType": "array",
				"description": "親ノートの内部リンク"
			}
		},
		"commonProperties": {
			"rank": {
				"dataType": "number",
				"description": "主観的価値度"
			},
			"references": {
				"dataType": "array",
				"description": "参考ソース"
			},
			"ruby": {
				"dataType": "string",
				"description": "ルビ"
			},
			"progress": {
				"dataType": "number",
				"description": "進捗度：1-100"
			},
			"resolved": {
				"dataType": "datetime",
				"description": "解決日時"
			}
		},
		"children": {
			"CreativeCrate": {
				"alias": "",
				"module": "CreativeCrateNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["rank", "references"]
					}
				}
			},
			"CreativeCrate/Creations": {
				"alias": "Creations",
				"module": "CreationsNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["ruby", "rank", "references"]
					},
					"creationLabels": {
						"dataType": "array",
						"description": "subKind",
						"options": true
					},
					"released": {
						"dataType": "date",
						"description": "公開日"
					},
					"creators": {
						"dataType": "array",
						"description": "作者"
					},
					"producedBy": {
						"dataType": "array",
						"description": "出版元など"
					},
					"creMediums": {
						"dataType": "array",
						"description": "作品媒体",
						"options": true
					},
					"creGenres": {
						"dataType": "array",
						"description": "作品ジャンル",
						"options": true
					}
				}
			},
			"CreativeCrate/Creations/Characters": {
				"alias": "Characters",
				"module": "CharactersNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["ruby", "rank", "references"]
					},
					"creations": {
						"dataType": "array",
						"description": "登場作品"
					},
					"birthday": {
						"dataType": "date",
						"description": "誕生日"
					},
					"age": {
						"dataType": "array",
						"description": "年齢。作中で年齢が変化するケースを想定し、複数記録できるよう array 型にしている。"
					},
					"gender": {
						"dataType": "string",
						"description": "性別",
						"options": true
					},
					"creRoles": {
						"dataType": "array",
						"description": "ストーリー面における役割",
						"options": true
					},
					"crePositions": {
						"dataType": "array",
						"description": "社会的立場。creRolesより客観性の高いモノ。creRolesとの値被りは許可する。",
						"options": true
					}
				}
			},
			"CreativeCrate/Creatorium": {
				"alias": "Creatorium",
				"module": "CreatoriumNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["rank", "references"]
					},
					"creativeLabels": {
						"dataType": "array",
						"description": "創作用ノートに対するsubKind",
						"options": true
					}
				}
			},
			"CreativeCrate/Creatorium/WIPs": {
				"alias": "WIPs",
				"module": "WIPsNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["rank", "references", "progress"]
					},
					"wipAspect": {
						"dataType": "string",
						"description": "作業メモにおけるsubKind",
						"options": true
					}
				}
			},
			"CreativeCrate/Creatorium/WIPs/Characters": {
				"alias": "CharactersIP",
				"module": "WIPsCharactersNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["rank", "references", "progress"]
					},
					"cipAspect": {
						"dataType": "string",
						"description": "キャラ作成の作業メモにおけるsubKind",
						"options": true
					}
				}
			},
			"CreativeCrate/Creatorium/WIPs/Music": {
				"alias": "MusicIP",
				"module": "WIPsMusicNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["rank", "references", "progress"]
					},
					"cipAspect": {
						"dataType": "string",
						"description": "音楽作成の作業メモにおけるsubKind",
						"options": true
					}
				}
			},
			"CreativeCrate/Creatorium/WIPs/Novels": {
				"alias": "NovelsIP",
				"module": "WIPsNovelsNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["rank", "references", "progress"]
					},
					"cipAspect": {
						"dataType": "string",
						"description": "小説作成の作業メモにおけるsubKind",
						"options": true
					}
				}
			},
			"CreativeCrate/Creators": {
				"alias": "Creators",
				"module": "CreatorsNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["ruby", "rank"]
					}
				}
			},
			"FAQ": {
				"alias": "",
				"module": "FAQNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["rank", "references", "resolved"]
					},
					"faqType": {
						"dataType": "string",
						"description": "FAQタイプ",
						"options": true
					}
				}
			},
			"Knowledge": {
				"alias": "",
				"module": "KnowledgeNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["ruby", "rank", "references"]
					}
				}
			},
			"ToDo": {
				"alias": "",
				"module": "ToDoNoteModule",
				"properties": {
					"common": {
						"source": "this.Inbox.commonProperties",
						"keys": ["rank", "references", "progress", "resolved"]
					},
					"toDoType": {
						"dataType": "string",
						"description": "ToDoタイプ",
						"options": true
					}
				}
			}
		}
	},
	"Daily": {},
	"MOC": {}
}
```