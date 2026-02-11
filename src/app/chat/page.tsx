"use client";

import { useEffect, useState } from "react";
import ChatRoom from "@/components/ChatRoom";
import ConversationList from "@/components/ConversationList";
import Spinner from "@/components/Spinner";
import { useToast } from "@/components/ToastProvider";

type Character = {
  id: string;
  name: string;
  description: string;
};

type Conversation = {
  id: string;
  title: string;
  character: Character;
  updatedAt: string;
};

export default function ChatPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setConversations(data);
    } catch {
      showToast("会話履歴の読み込みに失敗しました", "error");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/characters");
        if (!res.ok) throw new Error();
        setCharacters(await res.json());
        await loadConversations();
      } catch {
        showToast("データの読み込みに失敗しました", "error");
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startConversation = async (characterId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId }),
      });
      if (!res.ok) throw new Error();
      const conv = await res.json();
      await loadConversations();
      setActiveConversationId(conv.id);
      setShowSidebar(false);
    } catch {
      showToast("会話の作成に失敗しました", "error");
    }
  };

  const deleteConversation = async (id: string) => {
    if (!confirm("この会話を削除しますか？")) return;
    try {
      const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      if (activeConversationId === id) setActiveConversationId(null);
      loadConversations();
    } catch {
      showToast("会話の削除に失敗しました", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-4">
      {/* Sidebar toggle (mobile) */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-gray-900 p-3 text-white shadow-lg sm:hidden"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "fixed inset-0 z-30 bg-white p-4" : "hidden"
        } w-full flex-shrink-0 flex-col overflow-y-auto sm:static sm:flex sm:w-72 sm:rounded-lg sm:border sm:border-gray-200 sm:bg-white sm:p-4`}
      >
        <div className="mb-4 flex items-center justify-between sm:hidden">
          <h2 className="font-semibold">メニュー</h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* New conversation */}
        <div className="mb-4">
          <h3 className="mb-2 text-xs font-medium uppercase text-gray-400">
            新しい会話
          </h3>
          <div className="flex flex-col gap-1">
            {characters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => startConversation(ch.id)}
                className="rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                {ch.name}
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={(id) => {
            setActiveConversationId(id);
            setShowSidebar(false);
          }}
          onDelete={deleteConversation}
        />
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col rounded-lg border border-gray-200 bg-white">
        {activeConversationId ? (
          <ChatRoom conversationId={activeConversationId} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            キャラクターを選んで会話を始めましょう
          </div>
        )}
      </div>
    </div>
  );
}
