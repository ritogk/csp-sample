import express from "express";
import path from "path";
import helmet from "helmet";

const app = express();
const port = 3000;

async function main() {
  // // 静的ファイルのディレクトリを設定
  app.use(express.static("src/public"));

  // cspの設定
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        // 全設定のデフォルト
        defaultSrc: ["'self'"],
        // scriptタグのsrcのpathを制限
        // デフォルトだとselfオリジンのインラインスクリプトも呼び出せない。unsafe-inlineやunsafe-evalでセキュリティリスクがあるため非推奨
        // selfオリジンのスクリプトを実行する場合は外部jsファイルに切りだす必要あり
        // noneを指定する事でjsの実行を全て禁止できるが、chrome拡張機能は読み込み可能。
        scriptSrc: ["'none'", "https://code.jquery.com"],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
        ],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://gvisual.homisoftware.net",
        ],
        // fetchの接続先を制限。jsでアクセス可能なシークレット情報はcspを設定しておけばよさそう。
        connectSrc: ["'self'", "https://gvisual.homisoftware.net"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        // objectタグは、画像、動画、pdf等といった、ブラウザ標準で表示できるマルチメディアを表示するタグ
        // 用途がよくわからんからとりあえずnone
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );

  // なぜかrootでcspがきかない。クローラーとかの関係でrootのcspは効かせないようにしているのかも。
  app.get("/sample-page", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
main();
