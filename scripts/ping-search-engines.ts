/**
 * 新しいページをサーチエンジンに通知するスクリプト
 *
 * 使い方:
 *   npm run ping-search-engines
 *   npm run ping-search-engines https://haraisugi.jp/articles/new-article
 *
 * 注意:
 *   Google の /ping?sitemap= エンドポイントは 2023年に廃止されました。
 *   Googleへの通知はサーチコンソールから手動で行ってください。
 *   Bing は IndexNow プロトコルに対応しています（要 API キー）。
 */

const SITEMAP_URL = 'https://haraisugi.jp/sitemap.xml';
const SITE_URL = 'https://haraisugi.jp';

// IndexNow の API キー（public/ に <key>.txt を設置した後に設定）
// 取得方法: https://www.bing.com/indexnow
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? '';

async function pingBingIndexNow(urls: string[]) {
  if (!INDEXNOW_KEY) {
    console.log('⚠ INDEXNOW_KEY が未設定のため Bing IndexNow をスキップします');
    console.log('  取得方法: https://www.bing.com/indexnow');
    return;
  }

  const body = {
    host: 'haraisugi.jp',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      console.log(`✓ Bing IndexNow に ${urls.length} 件の URL を通知しました`);
    } else {
      console.log(`✗ Bing IndexNow への通知に失敗しました: ${res.status} ${res.statusText}`);
    }
  } catch (error) {
    console.error('Bing IndexNow への通知中にエラーが発生しました:', error);
  }
}

function printSearchConsoleInstructions(url?: string) {
  console.log('\n========================================');
  console.log('Google へのインデックス登録方法（手動）');
  console.log('========================================');
  console.log('1. https://search.google.com/search-console にアクセス');
  console.log('2. 左メニュー「URL検査」をクリック');
  if (url) {
    console.log(`3. 「${url}」を入力して Enter`);
  } else {
    console.log('3. 登録したい URL を入力して Enter');
    console.log(`   例: ${SITE_URL}/column`);
  }
  console.log('4. 「インデックス登録をリクエスト」をクリック');
  console.log('\nヒント: サイトマップは既に登録済みであれば再送不要です。');
  console.log(`サイトマップ URL: ${SITEMAP_URL}`);
  console.log('========================================\n');
}

async function main() {
  const specificUrl = process.argv[2];

  console.log('サーチエンジンへの通知を開始します...\n');

  if (specificUrl) {
    // 特定URLの通知
    await pingBingIndexNow([specificUrl]);
    printSearchConsoleInstructions(specificUrl);
  } else {
    // サイト全体の主要URLを通知
    const mainUrls = [
      SITE_URL,
      `${SITE_URL}/column`,
    ];
    await pingBingIndexNow(mainUrls);
    printSearchConsoleInstructions();
  }

  console.log('完了しました！');
}

main().catch(console.error);
