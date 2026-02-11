"use client";

import { useEffect, useState } from "react";
import CharacterForm from "@/components/CharacterForm";
import Spinner from "@/components/Spinner";
import { useToast } from "@/components/ToastProvider";

type Character = {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatarUrl: string | null;
  isPreset: boolean;
};

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editing, setEditing] = useState<Character | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/characters");
      if (!res.ok) throw new Error("読み込みに失敗しました");
      const data = await res.json();
      setCharacters(data);
    } catch {
      showToast("キャラクターの読み込みに失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("このキャラクターを削除しますか？")) return;
    try {
      const res = await fetch(`/api/characters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("キャラクターを削除しました");
      load();
    } catch {
      showToast("削除に失敗しました", "error");
    }
  };

  const handleSave = async (data: {
    name: string;
    description: string;
    systemPrompt: string;
    avatarUrl: string;
  }) => {
    try {
      const res = editing
        ? await fetch(`/api/characters/${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/characters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "保存に失敗しました");
      }

      showToast(editing ? "キャラクターを更新しました" : "キャラクターを作成しました");
      setEditing(null);
      setShowForm(false);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "保存に失敗しました", "error");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">キャラクター</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          新規作成
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <CharacterForm
            initial={editing ?? undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {characters.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="mb-1 flex items-center gap-2">
                <h2 className="font-semibold">{c.name}</h2>
                {c.isPreset && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                    プリセット
                  </span>
                )}
              </div>
              <p className="mb-3 text-sm text-gray-600">{c.description}</p>
              {!c.isPreset && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(c);
                      setShowForm(true);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
