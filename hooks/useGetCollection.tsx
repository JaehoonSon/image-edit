import { useState, useCallback } from "react";
import { BASE_API_ENDPOINT } from "~/config";
import { Database } from "~/database.types";
import { supabase } from "~/lib/supabase";

type Collection = Database["public"]["Tables"]["image_collection"]["Row"];

export function useGetCollection() {
  const [data, setData] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearData = useCallback(() => {
    setData([]);
  }, []);

  const getCollectionData = useCallback(
    async (lastEndDate: string = new Date().toISOString()) => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("image_collection")
          .select("*")
          .lt("created_at", lastEndDate)
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: newItems, error } = await query;
        if (error) throw error;
        if (!newItems || newItems.length === 0) return;

        setData((prev) => {
          const existing = new Set(prev.map((i) => i.id));
          const toAppend = newItems.filter((i) => !existing.has(i.id));
          return prev.length === 0 ? toAppend : [...prev, ...toAppend];
        });
      } catch (err: any) {
        setError(err.message || "Retrieval Fail");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, getCollectionData, clearData };
}
