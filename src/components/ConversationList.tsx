"use client";

type Conversation = {
  id: string;
  title: string;
  character: { name: string };
  updatedAt: string;
};

type Props = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "たった今";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  return `${days}日前`;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
}: Props) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase text-gray-400">
        会話履歴
      </h3>
      <div className="flex flex-col gap-1">
        {conversations.length === 0 && (
          <p className="px-3 py-2 text-sm text-gray-400">まだ会話がありません</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm ${
              conv.id === activeId
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            <button
              onClick={() => onSelect(conv.id)}
              className="flex-1 truncate text-left"
            >
              <span className="block truncate">{conv.title}</span>
              <span className="block text-xs text-gray-400">
                {conv.character.name} · {relativeTime(conv.updatedAt)}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="ml-2 hidden text-gray-400 hover:text-red-500 group-hover:block"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
