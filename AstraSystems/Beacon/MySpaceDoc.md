- NoteTypeとNoteTopSectionType→NTSType を分けて管理しよう
- シンセごとに管理？


CustomJSを最大限活かすスキーマ駆動モジューラ設計
- 利点、JSファイルを自然に安全にObsidian内に入れられる。
- 起点の肝心なところはCustomJSがやってくれる、エントリーポイント？
	- ただこれだと自作でプラグインを作るよりも柔軟性に欠けて、やりたいことを真っすぐできない
	- → これを解決するためのスキーマ駆動
	- まず、CsutomJSが最初にシングルトンでインスタンス化するオブジェクト（主にスターズ）を全てシンセサイザー（以下参照）に流し込んで、そこから、ビルドしたスキーマの情報を元に依存性の解決を行い、欲しい機能を提供する
- 要するに、最表層のシンセサイザーに注入されるのは、customJS＋状況に応じて、dv+app or tp, のみ、ということになる。
	- このCustomJSオブジェクトと、dv, ap, tpから、全ての処理を行う構成にする。
		- 場合によっては、filesとか注入してもいいかもしれないけど、まぁこれは最終手段
		- ここらへんの最表面の依存注入も、スキーマとかに記載しときたいな。


- MySpace
	- Searchlights
		- Subs
		- HOME
	- Exos
	- DailyLogs
	- Galaxies
		- CreativeCrate
		- 
	- System
		- CoreSrc （CustomJS適用の対象）（メイン処理はここ、builtSchemaだけ読み込む）
			- MyNoteSystem
				- MyNoteStar
				- MyNotePlanets
					- WIPsNotePlanet
					- ToDoNotePlanet
			- 〇〇System
			- Satellites（トレイトっぽい機能はここに置いてもいいかも、用途が限定されてるなら、システム配下、シンセ配下でも良い）
			- Ports ファサード的な
			- Synthers 
				- NoteTopSectionSynther
				- NoteGeneratingSynther
		- Beacon（説明書的な）
			- Policy
			- docs
			- plugins
			- shotcuts
		- Terminal （Templater）（スクリプト手動実行ポイント）
			- 
		- Orbits（主なシステム設定、スキーマ、になるのかな？、内部システムはこの配下に依存している）
			- builtSchemas
				- 
			- noteTypes
				- 
			- propertyOptions
				- 
			- Templates
				- 
			- CoreSchema（1ファイルにまとめる。これをビルドしてDoc作ったり、駆動用のスキーマを再構成したり）