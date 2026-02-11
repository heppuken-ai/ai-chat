import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20">
      <h1 className="text-4xl font-bold">AI Chat</h1>
      <p className="text-gray-600">キャラクターと会話を楽しもう</p>
      <div className="flex gap-4">
        <Link
          href="/chat"
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          チャットを始める
        </Link>
        <Link
          href="/characters"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          キャラクター管理
        </Link>
      </div>
    </div>
  );
}
