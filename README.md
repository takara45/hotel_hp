## ローカル環境での実行方法 (Local Development)

お使いのPC上でアプリケーションを起動し、テストするための手順です。

### 1. 前提条件 (Prerequisites)

- [Node.js](https://nodejs.org/) (バージョン18以降を推奨) と npm がインストールされていること。

### 2. セットアップ手順 (Steps)

1.  **リポジトリをクローン**
    ```bash
    git clone https://github.com/[あなたのユーザー名]/[リポジトリ名].git
    cd [リポジトリ名]
    ```

2.  **依存関係をインストール**
    プロジェクトに必要なパッケージをインストールします。
    ```bash
    npm install
    ```

3.  **APIキーを設定**
    このアプリケーションは、Gemini APIキーを環境変数 `API_KEY` から読み込みます。サーバーを起動する前に、ターミナルで以下のコマンドを実行してください。

    **macOS / Linux の場合:**
    ```bash
    export API_KEY="ここにあなたのAPIキーを貼り付け"
    ```

    **Windows (コマンドプロンプト) の場合:**
    ```bash
    set API_KEY="ここにあなたのAPIキーを貼り付け"
    ```

    **Windows (PowerShell) の場合:**
    ```bash
    $env:API_KEY="ここにあなたのAPIキーを貼り付け"
    ```

4.  **サーバーを起動**
    以下のコマンドでローカルWebサーバーを起動します。
    ```bash
    npm start
    ```
    ターミナルに `Server listening on port 8080` と表示されれば成功です。

5.  **ブラウザで確認**
    ウェブブラウザを開き、アドレスバーに以下のURLを入力してください。
    [http://localhost:8080](http://localhost:8080)

