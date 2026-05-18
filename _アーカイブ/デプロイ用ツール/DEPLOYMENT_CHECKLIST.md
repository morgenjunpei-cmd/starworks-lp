# 🚀 STAR WORKS — デプロイメント チェックリスト

## ✅ ファイル準備（完了）

- ✅ HTML ファイル（5ファイル）
  - index.html - トップページ
  - about.html - 想いページ
  - service.html - サービス・料金ページ
  - faq.html - FAQ ページ
  - contact.html - お問い合わせページ

- ✅ CSS & JavaScript
  - assets/style.css（スタイルシート完全版）
  - assets/script.js（アニメーション・機能実装済み）

- ✅ 画像ファイル（5ファイル）
  - logo.png, logo-light.png
  - why-01.png, why-02.png, why-03.png

- ✅ Meta情報・SEO設定
  - 全ページのメタディスクリプション設定済み
  - 内部リンク・導線完成

---

## 📋 公開前に必須の作業

### **1️⃣ Formspreeの認証完了（重要！）**

現状：contact.html の form action は `https://formspree.io/f/xpwzabcd` となっています

**必要な作業：**
- [ ] Formspree.io にアクセス
- [ ] アカウント作成（庄子純平のGmail）
- [ ] 新しいフォーム作成 → 送信先を starworks.shoji@gmail.com に設定
- [ ] 取得した本物のフォームID（例：xpwzabcd）を contact.html に置き換え
- [ ] メール認証リンクをクリック（Gmail確認）

**置き換え方法：**
```html
<!-- contact.html の85行目 -->
<form ... action="https://formspree.io/f/【ここに本物のID】" method="POST">
```

---

### **2️⃣ ドメイン取得**

**選択肢：**
- starworks.jp（和風・日本向け）
- starworks-web.jp（長めだが分かりやすい）
- shoji-web.jp（個人向け）

**推奨：** starworks.jp（覚えやすく、ブランド感がある）

**取得先：**
- お名前.com
- ムームードメイン
- Google Domains

**予算：** 年間 ¥1,000〜2,000

---

### **3️⃣ レンタルサーバー契約**

**推奨サーバー（小規模サイト向け）：**
- ConoHa WING（月額 ¥1,320〜）← おすすめ
- さくらインターネット（月額 ¥436〜）
- ロリポップ（月額 ¥99〜）

**必須機能：**
- ✅ PHP対応（Formspreeはサーバーサイド処理なし、だから不要）
- ✅ SSL/HTTPS対応（無料）
- ✅ FTPアクセス可能
- ✅ 日本サーバー（速度重視）

**推奨：ConoHa WING**
- 日本最速クラス
- WordPress対応
- SSL自動設定
- 24時間サポート

---

### **4️⃣ ファイルのアップロード**

**手順：**
1. レンタルサーバーのFTP情報を取得
2. FileZilla（無料FTPクライアント）等でサーバーに接続
3. 以下のファイル構成でアップロード：
   ```
   /public_html/
   ├── index.html
   ├── about.html
   ├── service.html
   ├── faq.html
   ├── contact.html
   ├── /assets/
   │   ├── style.css
   │   ├── script.js
   │   └── /images/
   │       ├── logo.png
   │       ├── logo-light.png
   │       ├── why-01.png
   │       ├── why-02.png
   │       └── why-03.png
   ```

4. サーバーにアップロード完了後、ドメインでアクセスして動作確認

---

### **5️⃣ DNS設定**

**レジストラ側（ドメイン取得先）：**
- [ ] DNS設定 → レンタルサーバーのネームサーバーを指定
- [ ] 反映待機（24〜48時間）

**反映確認：**
```bash
nslookup starworks.jp
# サーバーのIPアドレスが返ってくればOK
```

---

### **6️⃣ SSL/HTTPS 設定**

- [ ] レンタルサーバーの管理画面から Let's Encrypt（無料）を設定
- [ ] 自動更新の有効化確認
- [ ] .htaccess で http → https リダイレクト

**htaccess コード：**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

### **7️⃣ その他確認事項**

- [ ] **スマートフォン表示確認** → レスポンシブ対応確認
- [ ] **ブラウザ互換性** → Chrome, Safari, Firefox で動作確認
- [ ] **画像最適化** → 画像サイズが適切（現在は OK）
- [ ] **読み込み速度** → PageSpeed Insights で80点以上を目指す
- [ ] **SEO確認** → Google Search Console に登録
- [ ] **Googleビジネス登録** → ローカルSEO対策

---

## 📅 公開までのスケジュール

| 項目 | 所要時間 | 難易度 |
|-----|--------|------|
| Formspree 認証 | 10分 | ⭐ 簡単 |
| ドメイン取得 | 15分 | ⭐ 簡単 |
| サーバー契約 | 20分 | ⭐ 簡単 |
| ファイルアップロード | 30分 | ⭐ 簡単 |
| DNS設定 | 10分 | ⭐ 簡単 |
| 動作確認 | 30分 | ⭐⭐ 中程度 |
| **合計** | **約2時間** | |

---

## 💡 その他の推奨サービス（オプション）

### **Google Analytics 設定**
```html
<!-- 全ページの </head> 直前に追加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### **Google Search Console 登録**
- サイトマップ (sitemap.xml) 提出
- インデックス登録リクエスト

### **Twitter / Instagram / LINE 連携**
- 現在は footer にリンク可能

---

## 🎯 庄子純平さんへの補足

Formspree の認証がまだ完了していないため、**最優先は Formspree のメール認証です。**

メール認証完了後、contact.html の `xpwzabcd` を本物のフォームIDに置き換えれば、すぐに公開できます！

---

**作成日：2026年5月15日**
**次のステップ：Formspree 認証 → ドメイン取得 → サーバー契約**
