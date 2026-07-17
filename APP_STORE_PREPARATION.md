# Tsume Shogi — App Store提出準備

更新日: 2026-07-18

## 現在の構成

- Capacitor 8でWeb版をiOSのネイティブコンテナに同梱する。
- 対象はiPhone・iOS 15以降。縦向き表示とし、問題、翻訳、判定エンジンを同梱して通常のプレイはオフラインで完結する。
- 無料版としてGoogle AdMobのインタースティシャル広告を使用する。アカウント、独自のアクセス解析、課金SDKは使用しない。
- 広告は4問正解後、「次の問題」へ進む区切りでのみ候補となり、表示後10分間は再表示しない。対局中、不正解時、答え再生時、起動直後には表示しない。
- 非パーソナライズ広告を要求し、ATT許可は要求しない。地域ごとの同意はGoogle User Messaging Platformで取得する。
- 仮Bundle ID: `com.jugglerarata.tsumeshogi`。App Store Connectへ登録する前に、所有ドメインやブランド名と合わせて最終決定する。

## App Review 4.2への説明材料

本アプリは公開Webページを表示するだけのアプリではない。次の学習機能とデータをアプリ本体に収録する。

- このアプリ用に作成し、詰みエンジンで検証した64問
- 合法手、王手、詰み、最長抵抗を判定する将棋エンジン
- 「1手ごと」「通しで挑戦」の2種類の判定方法
- 3段階ヒント、正解手順の再生、手数別ランダム出題
- 日本語・英語・フランス語・スペイン語、3種類の駒表示、3テーマ
- 通信なしでの問題演習と端末内の進捗保存

## 公開URL

- マーケティングURL: `https://tsume-shogi-learn.juggler-arata.chatgpt.site/`
- プライバシーポリシー: `https://tsume-shogi-learn.juggler-arata.chatgpt.site/privacy.html`
- サポートURL: `https://tsume-shogi-learn.juggler-arata.chatgpt.site/support.html`

※プライバシーとサポートページを含む版を公開してから、App Store Connectへ入力する。

## App Privacy回答案（AdMob導入後）

「データを収集しない」は選択できない。Google Mobile Ads SDKの現行開示を基に、少なくとも次をApp Store Connectで再確認する。

- おおよその位置情報（IPアドレスから推定）
- デバイスID
- 広告データ
- 製品の操作情報
- クラッシュデータ
- パフォーマンスデータ
- 利用目的: 第三者広告、分析、アプリ機能、不正防止・セキュリティ等（各データに該当する目的をGoogleの現行説明とXcode Privacy Reportで照合）
- Tracking: 非パーソナライズ広告・ATT要求なしの設計。ただし最終回答は、使用する本番SDK版とApp Store Connectの定義を照合して決定する。

学習進捗、表示設定、広告までの正解数、最終広告時刻は端末内だけに保存し、開発者のサーバーへ送信しない。

## ストア掲載文案

### 日本語

- アプリ名: `Tsume Shogi`
- サブタイトル: `詰将棋で学ぶ、はじめての将棋`
- プロモーション文: `1手詰めから9手詰めまで。ヒントと答えの再生を使い、自分のペースで詰みの形を学べます。`
- キーワード案: `将棋,詰将棋,つめしょうぎ,初心者,オフライン,棋譜,パズル,学習`

説明文案:

> Tsume Shogiは、将棋の「詰み」を短い問題で学ぶ初心者向けアプリです。1手詰め・3手詰め・5手詰め・7手詰め・9手詰めを収録。駒を実際に動かしながら、王手の連続で玉を詰ませます。
>
> 判定は、正解筋から外れたときすぐ知らせる「1手ごと」と、最後まで考える「通しで挑戦」から選択できます。行き詰まったときは3段階ヒントや答えの再生を利用できます。
>
> 日本語・英語・フランス語・スペイン語、漢字・ローマ字・併記の駒表示に対応。問題と判定機能をアプリに収録しているため、通常の練習はオフラインで行えます。
>
> 本アプリは広告によって無料で提供されます。広告は複数の問題を正解した後、次の問題へ進む区切りで表示される場合があります。

### English

- App name: `Tsume Shogi`
- Subtitle: `Learn shogi through checkmate`
- Promotional text: `Practise mate in 1 through mate in 9 with step-by-step hints, two feedback styles, and answer replay.`
- Keywords: `shogi,tsume,checkmate,japanese chess,puzzle,beginner,offline,learn`

Description draft:

> Tsume Shogi is a beginner-friendly way to learn checkmate patterns in Japanese chess. Move the pieces yourself and solve mate-in-1, 3, 5, 7, and 9 puzzles.
>
> Choose immediate feedback when you want guidance after every move, or play through the full line when you want to test your reading. Three levels of hints and animated answer replay help you learn from difficult positions.
>
> The interface supports Japanese, English, French, and Spanish, with Kanji, letter, or combined piece labels. Puzzles and judging logic are included in the app, so normal practice works offline.
>
> The app is free with ads. An ad may appear at the transition to the next puzzle after several successful solves.

## 審査メモ案

1. アプリ起動後、盤上の攻め方の駒または持ち駒を選び、光った行き先を選ぶ。
2. 上部の問題バーから問題一覧を開き、手数別問題またはランダム出題を選べる。
3. 盤面下の「判定」で、1手ごとの訂正と通し挑戦を切り替えられる。
4. 「ヒント」は3段階、「答えを見る」は確認後に正解手順を再生する。
5. ログイン、購入、特別な審査用アカウントは不要。
6. 通信を切った状態でも通常の問題演習が可能。
7. テスト時は、4問正解後の「広告のあと次へ」からGoogleのテスト広告を表示する。広告が取得できない場合も次の問題へ進める。

## オーナーが決める項目

- Apple Developer Programを個人名義にするか、法人名義にするか
- 正式なアプリ名とBundle ID
- 販売方式は「無料＋広告」で開始する（2026-07-18決定）
- 配信する国・地域
- 「子ども向け」カテゴリを明示的に選ぶか。初回は通常カテゴリ・年齢レーティング4+相当で始める案を推奨する

## 現在の提出ブロッカー

- Xcodeが自動生成した青い仮アイコンと仮スプラッシュ画像が残っている。Web版の「詰」アイコンを正式採用するか、App Store用に再設計する必要がある。
- Bundle ID `com.jugglerarata.tsumeshogi` は仮。App Store Connectのアプリレコード作成後は変更が難しいため、その前に確定する。
- Apple Developer Programの名義と署名チームが未設定。個人登録では原則として個人の法的氏名、法人登録では法人名が販売者名になる。
- 販売価格、配信地域、年齢レーティングの回答はオーナー判断が必要。
- プライバシー／サポートページはファイル作成済みだが、公開サイトにはまだ反映していない。
- AdMobの本番アプリID／インタースティシャル広告ユニットIDが未発行。現在はGoogle公式のサンプルIDのみを使用しているため、そのまま公開しない。
- AdMob管理画面でGDPR等のPrivacy & messagingを設定し、アプリ単位でも頻度上限を設定する。

## 依存関係監査（2026-07-18）

- `npm audit --omit=dev` は、Webビルドに使うNext.js内のPostCSSについてmoderate 2件を報告した。該当処理は、静的HTML・CSS・JavaScriptとしてiOSアプリへ同梱した後の実行時には含まれない。
- 開発用依存を含めるとlow 1件・moderate 4件・high 6件。主にVite、Wrangler、Cloudflareのローカル開発・ビルド経路で、CapacitorのiOS実行依存からは報告されていない。
- 監査が提案するNext.jsの大幅ダウングレードやビルド基盤の一括更新は互換性リスクがあるため未適用。公開ビルド基盤を更新するときに個別に更新・再検証する。

## 実施済み検証（2026-07-18）

- Node通常テスト: 25件合格（広告頻度、同意状態、ブラウザ無効化、本番／デモID混在防止を含む）
- Webプロダクションビルド: 合格
- AdMob 8.0.0を含むCapacitor同期: 合格
- Xcode 26.6・iOS 26.5 Simulator SDK・署名なしDebugビルド: 合格（Google Mobile Ads／User Messaging Platformをリンク）
- iPhone 17 Proシミュレータへのインストール、起動、縦画面表示: 合格
- Google Mobile Ads／User Messaging PlatformのPrivacy Manifest同梱: 確認済み
- 64問の難度別完全探索: 全件合格
  - 1手8問、3手12問、5手27問、7手12問、9手5問
  - 最短詰み手数、唯一の初手、ヒントが示す完全手順、攻め方の持駒余りなしを確認

## 提出チェックリスト

- [ ] Apple Developer Programへ登録する
- [ ] App Store Connectでアプリレコードを作る
- [ ] アプリ名、Bundle ID、署名チームを確定する
- [ ] App Store用1024×1024アイコンを確定する
- [ ] iPhone実機で駒操作、シート、外部リンク、オフライン動作を確認する
- [ ] 日本語・英語のストア用スクリーンショットを作る
- [ ] 年齢レーティング質問票に回答する
- [ ] App Privacyとプライバシーポリシーを最終照合する
- [ ] AdMobでアプリとインタースティシャル広告ユニットを作り、サンプルIDを本番IDへ差し替える
- [ ] AdMobのPrivacy & messagingと頻度上限を設定する
- [ ] 不適切な広告の報告方法を、広告画面内のAdChoicesに加えてサポートページでも案内する
- [ ] TestFlightで外部または内部テストを行う
- [ ] 審査メモを添えて提出する
