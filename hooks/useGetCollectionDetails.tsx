import { useState, useCallback } from "react";
import { BASE_API_ENDPOINT } from "~/config";
import { Database } from "~/database.types";
import { supabase } from "~/lib/supabase";

type Image_Detail = {
  job_id: string;
};

export function useGetCollectionDetails() {
  const [data, setData] = useState<Image_Detail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCollectionDetail = useCallback(
    async (collection_id: string): Promise<Image_Detail[]> => {
      setLoading(true);
      setError(null);
      // setData([]);

      try {
        const { data: collection_detail_data, error: collection_detail_error } =
          await supabase
            .from("image_detail")
            .select(`job_id`)
            .eq("collection_id", collection_id)
            .not("enhanced_image_url", "is", null)
            .limit(20);

        if (collection_detail_error) throw collection_detail_error;
        const result = collection_detail_data.map((item) => ({
          job_id: item.job_id,
        }));

        setData(result);
        return result;
      } catch (err: any) {
        setError(err.message || "Retrieval Fail");
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, getCollectionDetail };
}
