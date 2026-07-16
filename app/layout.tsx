import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Tsume Shogi — 詰将棋を一手ずつ",
  description: "A bilingual, offline-friendly shogi puzzle app for beginners.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#173f36",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
