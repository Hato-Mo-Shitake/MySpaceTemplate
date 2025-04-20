```JSON
{
	"schemaVersion": "1.0.3",
	"NoteSchema": {
		"optionsSourcePath": "AstraSystems/Orbits/PropertyOptions",
		"noteTypesPath": "AstraSystems/Orbits/NoteTypes",
		"defaultCommonPropertiesSource": "this.Galaxies.commonProperties"
		"Galaxies": {
			"noteType": "MyNote",
			"ntsDep": "MyNoteStar",
			"defaultProperties": {
				"created": {
					"dataType": "string",
					"description": "作成日のデイリーノートへのリンク"
				},
				"tags": {
					"dataType": "array",
					"description": "タグ。",
					"note": "先頭の要素がメインの「noteKind」になる。取得時はフロントマター配下のtagsを参照すること。"
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
				},
				"completed": {
					"dataType": "string",
					"description": "完成時のデイリーノートへのリンク"
				}
			},
			"childNotes": {
				"CreativeCrate": {
					"ntsDep": "MyNoteStar",
					"properties": {
						"common": {
							"keys": ["rank", "references"]
						}
					}
				},
				"CreativeCrate/Creations": {
					"ntsDep": "MyNoteStar",
					"properties": {
						"common": {
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
					"ntsDep": "MyNoteStar",
					"properties": {
						"common": {
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
							"description": "年齢。作中で年齢が変化するケースを想定し、複数記録できるようarray型"
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
					"ntsDep": "MyNoteStar",
					"properties": {
						"common": {
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
					"properties": {
						"common": {
							"keys": ["rank", "references", "progress", "completed"]
						},
						"wipAspect": {
							"dataType": "string",
							"description": "作業メモにおけるsubKind",
							"options": true
						}
					}
				},
				"CreativeCrate/Creatorium/WIPs/Characters": {
					"noteType": "CharactersIP",
					"ntsDep": "WIPsNotePlanet",
					"properties": {
						"common": {
							"keys": ["rank", "references", "progress", "completed"]
						},
						"cipAspect": {
							"dataType": "string",
							"description": "キャラ作成の作業メモにおけるsubKind",
							"options": true
						}
					}
				},
				"CreativeCrate/Creatorium/WIPs/Music": {
					"noteType": "MusicIP",
					"ntsDep": "WIPsNotePlanet",
					"properties": {
						"common": {
							"keys": ["rank", "references", "progress", "completed"]
						},
						"mipAspect": {
							"dataType": "string",
							"description": "音楽作成の作業メモにおけるsubKind",
							"options": true
						}
					}
				},
				"CreativeCrate/Creatorium/WIPs/Novels": {
					"noteType": "NovelsIP",
					"ntsDep": "WIPsNotePlanet",
					"properties": {
						"common": {
							"keys": ["rank", "references", "progress", "completed"]
						},
						"cipAspect": {
							"dataType": "string",
							"description": "小説作成の作業メモにおけるsubKind",
							"options": true
						}
					}
				},
				"CreativeCrate/Creators": {
					"ntsDep": "MyNoteStar",
					"properties": {
						"common": {
							"keys": ["ruby", "rank"]
						}
					}
				},
				"FAQ": {
					"ntsDep": "MyNoteStar",
					"properties": {
						"common": {
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
					"ntsDep": "MyNoteStar",
					"properties": {
						"common": {
							"keys": ["ruby", "rank", "references"]
						}
					}
				},
				"ToDo": {
					"ntsDep": "MyNoteStar",
					"properties": {
						"common": {
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
		"Daily": {
			"properties": {
				"created": {
					"dataType": "string",
					"description": "作成日のデイリーノートへのリンク"
				},
				"tags": {
					"dataType": "array",
					"description": "タグ。先頭の要素は「Daily」取得時はフロントマター配下のtagsを参照すること。"
					},
				"spending": {
					"dataType": "number",
					"description": "使ったお金"
				},
				"rank": {
					"dataType": "number",
					"description": "その日の充実度"
				},
				"relatesTo": {
					"dataType": "array",
					"description": "関連ノートの内部リンク"
				}
			}
		},
		"MOC": {
			"properties": {
				"tags": {
					"dataType": "array",
					"description": "タグ。先頭の要素は「MOC」。取得時はフロントマター配下のtagsを参照すること。"
					},
				"relatesTo": {
					"dataType": "array",
					"description": "関連ノートの内部リンク"
				},
				"belongsTo": {
					"dataType": "array",
					"description": "親ノートの内部リンク"
				}
			}
		}
	}
}
```