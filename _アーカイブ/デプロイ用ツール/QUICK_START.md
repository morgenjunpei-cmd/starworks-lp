# ⚡ STAR WORKS — クイックスタートガイド

**公開まで、残り 3ステップだけ！**

---

## 🎯 3つのステップ（約30分）

### **ステップ1️⃣: Formspree 認証（5分）**

```bash
1. Gmailを開く
2. Formspreeからのメール確認
3. 認証リンクをクリック
4. フォームIDをコピー
```

**場所:** https://formspree.io/

完了後、`contact.html` の85行目を置き換え：
```html
<!-- 変更前 -->
<form ... action="https://formspree.io/f/xpwzabcd" method="POST">

<!-- 変更後 -->
<form ... action="https://formspree.io/f/【取得したID】" method="POST">
```

---

### **ステップ2️⃣: ドメイン＆サーバー契約（20分）**

#### **A. ドメイン取得（10分）**
```
サイト: https://www.onamae.com/
検索: starworks.jp
支払い: クレジットカード
```

#### **B. サーバー契約（10分）**
```
サイト: https://www.conoha.jp/wing/
プラン: ベーシック（月額 ¥1,320）
支払い: クレジットカード
```

**契約後、FTP情報をメモ:**
- ホスト名: ftp.●●●●●.conoha.io
- ユーザー名: ●●●●●
- パスワード: ●●●●●

---

### **ステップ3️⃣: ファイルアップロード（5分）**

#### **方法A: 自動スクリプト（推奨）**

```bash
# ターミナルで実行
cd /Users/shoujijunpei/HP制作事業/04_制作/STARWORKS_LP
./ftp_uploader.sh
```

画面の指示に従って、FTP情報を入力するだけ！

#### **方法B: 手動FTP（FileZilla使用）**

1. **FileZilla をダウンロード**
   ```
   https://filezilla-project.org/
   ```

2. **接続設定**
   - ホスト: `ftp.●●●●●.conoha.io`
   - ユーザー: `●●●●●`
   - パスワード: `●●●●●`
   - ポート: `21`

3. **ファイルドラッグ&ドロップ**
   ```
   ローカル                  → リモート
   STARWORKS_LP/            → /public_html/
   ├── *.html               → /public_html/
   ├── assets/              → /public_html/assets/
   ├── sitemap.xml          → /public_html/
   ├── robots.txt           → /public_html/
   └── .htaccess            → /public_html/
   ```

---

## 🎉 公開確認

**5. DNS設定が反映されたら（24〜48時間後）**

ブラウザで確認：
```
https://starworks.jp
```

完璧に表示されたら、公開成功！🎊

---

## 📞 困ったときは

| 問題 | 解決方法 |
|------|--------|
| Formspreeメール届かない | スパムフォルダ確認 / 再送信リクエスト |
| FTP接続できない | FTP情報を再確認 / ファイアウォール確認 |
| DNS反映されない | 24時間待つ / `nslookup starworks.jp` で確認 |
| SSL警告が出ている | サーバー管理画面でLet's Encrypt設定確認 |

---

## 📋 チェックリスト

- [ ] 1️⃣ Formspree 認証完了
- [ ] 2️⃣ ドメイン取得完了
- [ ] 3️⃣ サーバー契約完了
- [ ] 4️⃣ FTP情報をメモ
- [ ] 5️⃣ ファイルアップロード完了
- [ ] 6️⃣ DNS設定完了（待機中）
- [ ] 7️⃣ https://starworks.jp にアクセス確認

---

## 🚀 スクリプト使用方法

### **Python版（推奨）**
```bash
python3 ftp_uploader.py \
  --host ftp.●●●●●.conoha.io \
  --user ●●●●● \
  --password ●●●●● \
  --remote /public_html/
```

### **Bash版（Mac推奨）**
```bash
./ftp_uploader.sh
```

---

## 💡 豆知識

- **Formspree** は無料で月50件まで
- **ConoHa WING** は高速でおすすめ
- **SSL自動更新** だから証明書の心配なし
- **SEO設定済み** だから検索上位を狙いやすい

---

**質問・トラブルは庄子さんまで！**
- 📞 080-2835-1440
- 📧 starworks.shoji@gmail.com

