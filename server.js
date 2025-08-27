const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// プロジェクトのルートディレクトリにある静的ファイルを配信します
// これにより、index.htmlやindex.tsxなどが正しく読み込まれます
app.use(express.static(path.join(__dirname, '')));

// シングルページアプリケーション(SPA)対応: どのURLへのリクエストでもindex.htmlを返します
// これにより、ブラウザ側でのルーティングが正しく機能します
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
