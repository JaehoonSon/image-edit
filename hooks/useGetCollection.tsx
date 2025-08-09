import { useState, useCallback } from "react";
import { BASE_API_ENDPOINT } from "~/config";
import { Database } from "~/database.types";
import { supabase } from "~/lib/supabase";

type Collection = Database["public"]["Tables"]["image_collection"]["Row"];

export function useGetCollection() {
  const [data, setData] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCollectionData = useCallback(async () => {
    setLoading(true);
    setError(null);
    // setData(data);

    try {
      // if (data.length == 0) {
      //   const { data: collection_data, error: collection_error } =
      //     await supabase
      //       .from("image_collection")
      //       .select("*")
      //       .order("created_at", { ascending: false })
      //       .limit(5);

      //   if (collection_error) throw collection_error;

      //   setData(collection_data);
      // } else {
      //   const { data: collection_data, error: collection_error } =
      //     await supabase
      //       .from("image_collection")
      //       .select("*")
      //       .order("created_at", { ascending: false })
      //       .gt("created_at", data[0].created_at)
      //       .limit(5);

      //   if (collection_error) throw collection_error;

      //   setData((prev) => [...collection_data, ...prev]);
      // }

      let query = supabase
        .from("image_collection")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (data.length > 0) {
        query = query.gt("created_at", data[0].created_at);
      }

      const { data: newItems, error } = await query;
      if (error) throw error;
      if (!newItems || newItems.length === 0) return;

      setData((prev) =>
        data.length === 0 ? newItems : [...newItems, ...prev]
      );
    } catch (err: any) {
      setError(err.message || "Retrieval Fail");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getCollectionData };
}
