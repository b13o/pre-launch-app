import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages向けの静的サイト生成設定
  output: "export",

  // GitHub Pagesでは画像最適化が利用できないため無効化
  images: {
    unoptimized: true,
  },

  // Base pathの設定（必要に応じてリポジトリ名を設定）
  // basePath: '/your-repo-name', // リポジトリ名に応じて設定してください
};

export default nextConfig;
