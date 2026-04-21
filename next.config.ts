import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/articles',
        destination: '/column',
        permanent: true,
      },
      // 重複記事の統合（旧スラッグ → 新スラッグ 301）
      // 詳細: /articles/[slug] でほぼ同一内容の新旧ペアを検出。新側を正規版に統合する。
      {
        source: '/articles/iryohi-kojo-urawaza-7sen',
        destination: '/articles/iryouhi-koujo-urawaza',
        permanent: true,
      },
      {
        source: '/articles/iryohi-vs-selfmedication',
        destination: '/articles/iryouhi-self-medication-hikaku',
        permanent: true,
      },
      {
        source: '/articles/selfmedication-taishoyaku',
        destination: '/articles/self-medication-taishou-list',
        permanent: true,
      },
      {
        source: '/articles/taishokukin-zekin-keisan',
        destination: '/articles/taishokukin-zeikin-keisan',
        permanent: true,
      },
      {
        source: '/articles/fukugyou-keihi-dokomade',
        destination: '/articles/fukugyou-keihi-ichiran',
        permanent: true,
      },
      {
        source: '/articles/fukugyou-20man-juminzei',
        destination: '/articles/fukugyou-20man-rule',
        permanent: true,
      },
      {
        source: '/articles/50dai-taishoku-setsuzei-checklist',
        destination: '/articles/taishoku-mae-setsuzei-checklist',
        permanent: true,
      },
      {
        source: '/articles/ideco-taishokukin-ukewatashi',
        destination: '/articles/taishoku-ideco-saiteki',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
