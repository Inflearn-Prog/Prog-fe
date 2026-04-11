"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
  updateCategoryOrder,
} from "@/queries/api/admin";

import { AdminCategory } from "../types";

function buildTree(categories: AdminCategory[]) {
  const sorted = [...categories].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const parents = sorted.filter((c) => c.parentId === null);
  const children = sorted.filter((c) => c.parentId !== null);

  return parents.map((parent) => ({
    ...parent,
    children: children.filter((c) => c.parentId === parent.categoryId),
  }));
}

export function CategoriesTab() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const { data } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getAdminCategories,
    select: (res) => res.data,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setNewName("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });

  const orderMutation = useMutation({
    mutationFn: updateCategoryOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });

  const categories = data?.categories ?? [];
  const tree = buildTree(categories);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMutation.mutate({ name: newName.trim() });
  };

  const handleUpdate = (id: number) => {
    if (!editName.trim()) return;
    updateMutation.mutate({ id, name: editName.trim() });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const swapOrder = (fromIdx: number, toIdx: number) => {
    const parentIds = tree.map((t) => t.categoryId);
    const fromItem = parentIds.at(fromIdx);
    const toItem = parentIds.at(toIdx);
    if (fromItem === undefined || toItem === undefined) return;
    const reordered = parentIds.map((id, i) => {
      if (i === fromIdx) return toItem;
      if (i === toIdx) return fromItem;
      return id;
    });
    orderMutation.mutate(reordered);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    swapOrder(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index >= tree.length - 1) return;
    swapOrder(index, index + 1);
  };

  const startEdit = (cat: AdminCategory) => {
    setEditingId(cat.categoryId);
    setEditName(cat.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Default"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={100}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-frog-600"
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <span className="text-xs text-gray-400">{newName.length}/100</span>
        <Button
          onClick={handleCreate}
          disabled={createMutation.isPending || !newName.trim()}
          className="bg-frog-600 hover:bg-frog-700"
        >
          카테고리 추가
        </Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        {tree.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            카테고리가 없습니다.
          </div>
        ) : (
          <div className="divide-y">
            {tree.map((parent, idx) => (
              <div key={parent.categoryId}>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      className="cursor-grab text-gray-400 hover:text-gray-600"
                      title="순서 변경"
                      onClick={() =>
                        idx > 0 ? handleMoveUp(idx) : handleMoveDown(idx)
                      }
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                    {editingId === parent.categoryId ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleUpdate(parent.categoryId);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onBlur={() => handleUpdate(parent.categoryId)}
                        className="rounded border px-2 py-1 text-sm outline-none focus:border-frog-600"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {parent.name}{" "}
                        <span className="text-gray-400">
                          ({parent.childrenCount})
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(parent)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(parent.categoryId)}
                      className="text-gray-400 hover:text-red-500"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {parent.children.map((child) => (
                  <div
                    key={child.categoryId}
                    className="flex items-center justify-between border-t bg-gray-50 px-4 py-3 pl-12"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">↳</span>
                      <GripVertical className="h-4 w-4 text-gray-300" />
                      {editingId === child.categoryId ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleUpdate(child.categoryId);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          onBlur={() => handleUpdate(child.categoryId)}
                          className="rounded border px-2 py-1 text-sm outline-none focus:border-frog-600"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm">
                          {child.name}{" "}
                          <span className="text-gray-400">
                            ({child.childrenCount})
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
