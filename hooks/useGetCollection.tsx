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

  const refreshData = useCallback(
    async (lastEndDate: string = new Date().toISOString()) => {
      setLoading(true);
      setError(null);

      const byCreatedDesc = (a: any, b: any) => {
        const ad = Date.parse(a.created_at);
        const bd = Date.parse(b.created_at);
        if (bd !== ad) return bd - ad; // newer first
        return String(b.id).localeCompare(String(a.id)); // tiebreaker
      };

      try {
        const { data: newItems, error } = await supabase
          .from("image_collection")
          .select("*")
          .lt("created_at", lastEndDate)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        if (!newItems || newItems.length === 0) return;

        setData((prev) => {
          // merge + de-dup
          const map = new Map(prev.map((i: any) => [i.id, i]));
          for (const item of newItems) map.set(item.id, item);
          // always keep correct position
          return Array.from(map.values()).sort(byCreatedDesc);
        });
      } catch (err: any) {
        setError(err.message || "Retrieval Fail");
      } finally {
        setLoading(false);
      }
    },
    []
  );

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

  return { data, loading, error, refreshData, getCollectionData, clearData };
}
