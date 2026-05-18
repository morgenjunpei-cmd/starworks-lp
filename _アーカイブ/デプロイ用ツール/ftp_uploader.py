#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
STAR WORKS — FTP自動アップロードスクリプト

使用方法：
    python3 ftp_uploader.py --host ftp.example.com --user username --password password --remote /public_html/

設定が必要：
    1. ConoHa WINGの管理画面でFTP情報を取得
    2. --host, --user, --password を入力
    3. --remote を /public_html/ に設定
    4. スクリプト実行
"""

import os
import sys
import argparse
from pathlib import Path
from ftplib import FTP, all_errors
import time

class STARWORKSUploader:
    def __init__(self, host, user, password, remote_dir="/public_html/"):
        self.host = host
        self.user = user
        self.password = password
        self.remote_dir = remote_dir
        self.ftp = None
        self.local_base = Path(__file__).parent

    def connect(self):
        """FTPサーバーに接続"""
        try:
            print(f"🔗 FTPサーバーに接続中... ({self.host})")
            self.ftp = FTP(self.host, timeout=10)
            self.ftp.login(self.user, self.password)
            print(f"✅ 接続成功！")
            return True
        except all_errors as e:
            print(f"❌ 接続失敗: {e}")
            return False

    def get_local_files(self):
        """ローカルのアップロード対象ファイルを取得"""
        files_to_upload = []

        # HTML ファイル
        for html_file in self.local_base.glob("*.html"):
            files_to_upload.append(("", html_file))

        # 設定ファイル
        for config_file in ["sitemap.xml", "robots.txt", ".htaccess"]:
            config_path = self.local_base / config_file
            if config_path.exists():
                files_to_upload.append(("", config_path))

        # CSS & JS
        assets_dir = self.local_base / "assets"
        if assets_dir.exists():
            for asset_file in assets_dir.glob("*.css"):
                files_to_upload.append(("assets", asset_file))
            for asset_file in assets_dir.glob("*.js"):
                files_to_upload.append(("assets", asset_file))

        # 画像
        images_dir = self.local_base / "assets" / "images"
        if images_dir.exists():
            for img_file in images_dir.glob("*"):
                if img_file.is_file():
                    files_to_upload.append(("assets/images", img_file))

        return files_to_upload

    def create_remote_dirs(self, files_list):
        """リモートサーバーに必要なディレクトリを作成"""
        required_dirs = set()
        for remote_subdir, _ in files_list:
            if remote_subdir:
                required_dirs.add(remote_subdir)

        for dir_name in required_dirs:
            try:
                remote_path = f"{self.remote_dir}{dir_name}"
                self.ftp.mkd(remote_path)
                print(f"📁 作成: {remote_path}")
            except all_errors:
                # ディレクトリが既に存在する場合はスキップ
                pass

    def upload_file(self, remote_subdir, local_file):
        """単一ファイルをアップロード"""
        try:
            filename = local_file.name
            if remote_subdir:
                remote_path = f"{self.remote_dir}{remote_subdir}/{filename}"
            else:
                remote_path = f"{self.remote_dir}{filename}"

            with open(local_file, 'rb') as f:
                self.ftp.storbinary(f'STOR {remote_path}', f)

            print(f"✅ {remote_path}")
            return True
        except all_errors as e:
            print(f"❌ {local_file.name}: {e}")
            return False

    def upload_all(self):
        """すべてのファイルをアップロード"""
        if not self.connect():
            return False

        files_to_upload = self.get_local_files()

        if not files_to_upload:
            print("❌ アップロードするファイルが見つかりません")
            return False

        print(f"\n📊 アップロード対象: {len(files_to_upload)} ファイル\n")

        # ディレクトリ作成
        self.create_remote_dirs(files_to_upload)

        # ファイルアップロード
        print("\n📤 ファイルアップロード中...\n")
        success_count = 0
        fail_count = 0

        for remote_subdir, local_file in files_to_upload:
            if self.upload_file(remote_subdir, local_file):
                success_count += 1
            else:
                fail_count += 1
            time.sleep(0.3)  # サーバー負荷軽減

        print(f"\n{'='*50}")
        print(f"✅ 成功: {success_count}")
        print(f"❌ 失敗: {fail_count}")
        print(f"{'='*50}\n")

        return fail_count == 0

    def disconnect(self):
        """FTP接続を切断"""
        if self.ftp:
            try:
                self.ftp.quit()
            except:
                pass


def main():
    parser = argparse.ArgumentParser(
        description="STAR WORKS — FTP自動アップロードツール",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例：
  python3 ftp_uploader.py --host ftp.example.com --user myuser --password mypass

必須パラメータ（初回のみ）:
  --host      FTPサーバーのホスト名
  --user      FTPユーザー名
  --password  FTPパスワード
  --remote    リモートディレクトリ（デフォルト: /public_html/）
        """
    )

    parser.add_argument("--host", required=True, help="FTPサーバーホスト")
    parser.add_argument("--user", required=True, help="FTPユーザー名")
    parser.add_argument("--password", required=True, help="FTPパスワード")
    parser.add_argument("--remote", default="/public_html/", help="リモートディレクトリ")

    args = parser.parse_args()

    # ロゴ表示
    print("""
    ╔════════════════════════════════════╗
    ║  STAR WORKS FTP Uploader v1.0      ║
    ║  想いを、Webで形に。                  ║
    ╚════════════════════════════════════╝
    """)

    uploader = STARWORKSUploader(
        host=args.host,
        user=args.user,
        password=args.password,
        remote_dir=args.remote
    )

    try:
        success = uploader.upload_all()
        uploader.disconnect()

        if success:
            print("🎉 アップロード完了！")
            print("\n次のステップ:")
            print("  1. ドメインのDNS設定でネームサーバーを変更")
            print("  2. サーバー管理画面でSSL設定を有効化")
            print("  3. https://starworks.jp にアクセス確認")
            return 0
        else:
            print("⚠️  いくつかのファイルがアップロードできませんでした")
            return 1
    except KeyboardInterrupt:
        print("\n\n⚠️  キャンセルされました")
        uploader.disconnect()
        return 1
    except Exception as e:
        print(f"\n❌ エラー: {e}")
        uploader.disconnect()
        return 1


if __name__ == "__main__":
    sys.exit(main())
