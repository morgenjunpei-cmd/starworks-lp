#!/bin/bash

# STAR WORKS — FTP自動アップロード（Bash版）
# 使用方法: ./ftp_uploader.sh

set -e

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ロゴ表示
echo -e "${BLUE}"
echo "╔════════════════════════════════════╗"
echo "║  STAR WORKS FTP Uploader v1.0      ║"
echo "║  想いを、Webで形に。                 ║"
echo "╚════════════════════════════════════╝"
echo -e "${NC}\n"

# FTP情報の入力
read -p "FTPサーバーホスト: " FTP_HOST
read -p "FTPユーザー名: " FTP_USER
read -sp "FTPパスワード: " FTP_PASSWORD
echo ""
read -p "リモートディレクトリ (デフォルト: /public_html/): " FTP_REMOTE
FTP_REMOTE=${FTP_REMOTE:-/public_html/}

# 確認
echo -e "\n${YELLOW}接続情報:${NC}"
echo "  ホスト: $FTP_HOST"
echo "  ユーザー: $FTP_USER"
echo "  リモートディレクトリ: $FTP_REMOTE"
read -p "この設定で実行しますか? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "キャンセルしました"
    exit 0
fi

# このスクリプトのディレクトリをカレントに
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# FTPコマンド生成
FTP_COMMANDS=$(cat << 'EOFTP'
#!/bin/bash

# FTPコマンド実行
(
echo "user $1 $2"
echo "binary"

# HTML ファイル
for file in *.html; do
    [ -f "$file" ] && echo "put $file $3$file"
done

# 設定ファイル
for file in sitemap.xml robots.txt .htaccess; do
    [ -f "$file" ] && echo "put $file $3$file"
done

# CSS & JS
[ -d "assets" ] && {
    echo "mkdir $3assets"
    for file in assets/*.css assets/*.js; do
        [ -f "$file" ] && echo "put $file $3$(basename $file)"
    done
}

# 画像
[ -d "assets/images" ] && {
    echo "mkdir $3assets/images"
    for file in assets/images/*; do
        [ -f "$file" ] && echo "put $file $3images/$(basename $file)"
    done
}

echo "bye"
) | ftp -n "$SCRIPT_DIR/temp_ftp_commands.txt" 2>&1
EOFTP
)

# ローカルホスト + ftp コマンド使用版
echo -e "\n${BLUE}📤 ファイルアップロード中...${NC}\n"

# FTP接続テスト
if ! nc -zv "$FTP_HOST" 21 2>/dev/null; then
    echo -e "${RED}❌ FTPサーバーに接続できません${NC}"
    exit 1
fi

# アップロードコマンド作成
cat > /tmp/ftp_commands.txt << EOF
user $FTP_USER $FTP_PASSWORD
binary
cd $FTP_REMOTE
EOF

# ファイルリスト追加
for file in *.html sitemap.xml robots.txt .htaccess; do
    [ -f "$file" ] && echo "put $file" >> /tmp/ftp_commands.txt
done

# CSS & JS
if [ -d "assets" ]; then
    echo "mkdir assets" >> /tmp/ftp_commands.txt
    echo "cd assets" >> /tmp/ftp_commands.txt
    for file in assets/*.css assets/*.js; do
        [ -f "$file" ] && echo "put $file $(basename $file)" >> /tmp/ftp_commands.txt
    done
    echo "cd .." >> /tmp/ftp_commands.txt
fi

# 画像
if [ -d "assets/images" ]; then
    echo "mkdir assets/images" >> /tmp/ftp_commands.txt
    echo "cd assets/images" >> /tmp/ftp_commands.txt
    for file in assets/images/*; do
        [ -f "$file" ] && echo "put $file $(basename $file)" >> /tmp/ftp_commands.txt
    done
    echo "cd ../.." >> /tmp/ftp_commands.txt
fi

echo "bye" >> /tmp/ftp_commands.txt

# FTP実行
ftp -n < /tmp/ftp_commands.txt 2>&1 | tee /tmp/ftp_output.txt

# クリーンアップ
rm -f /tmp/ftp_commands.txt

# 結果確認
if grep -q "550\|error" /tmp/ftp_output.txt; then
    echo -e "\n${RED}⚠️  アップロード中にエラーが発生しました${NC}"
    rm -f /tmp/ftp_output.txt
    exit 1
else
    echo -e "\n${GREEN}✅ アップロード完了！${NC}"
    rm -f /tmp/ftp_output.txt
fi

echo -e "\n${YELLOW}次のステップ:${NC}"
echo "  1. ドメインのDNS設定でネームサーバーを変更"
echo "  2. サーバー管理画面でSSL設定を有効化"
echo "  3. https://starworks.jp にアクセス確認"
echo ""
