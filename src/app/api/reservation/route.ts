// GitHub Pages（SSG）向けのダミーAPI実装
// 実際のAPIやメール送信機能は無効化済み

/**
 * プレビュー用ダミーAPI
 * GitHub Pages（静的サイト）では実際のAPI処理は行えないため、
 * 成功レスポンスを返すダミー実装
 */
export async function POST() {
  // プレビュー版では実際の処理は行わず、常に成功を返す
  return new Response(
    JSON.stringify({
      message: "Preview mode: Registration simulation completed",
      note: "This is a preview version - actual email sending is disabled",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
