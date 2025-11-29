import { useState, useCallback } from "react";
import { BASE_API_ENDPOINT } from "~/config";
import { supabase } from "~/lib/supabase";

export interface FaceEditCollectionResult {
  collection_id: string;
  items: { job_id: string }[];
}

interface UseFaceEditPresetsReturn {
  /** The array of results returned by the API (or null if none yet) */
  data: FaceEditCollectionResult | null;
  /** True while the request is in flight */
  loading: boolean;
  /** Any error message (or null if no error) */
  error: string | null;
  /**
   * Kick off the upload + preset call.
   * @param imageUri - local URI of the image to send
   */
  runCollection: (collection_id: string) => Promise<FaceEditCollectionResult>;
}

/**
 * Hook to call your /preset-face-edit-all endpoint.
 * @param apiUrl Base URL (e.g. "https://api.example.com")
 */
export function useGetFaceEditCollection(): UseFaceEditPresetsReturn {
  const [data, setData] = useState<FaceEditCollectionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runCollection = useCallback(async (collection_id: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      const token = session?.access_token;

      const res = await fetch(
        `${BASE_API_ENDPOINT}/face-edit-collection/${collection_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.log("This?");
        const text = await res.text();
        throw new Error(`Server ${res.status}: ${text}`);
      }

      // const json = (await res.json()) as { results: CreateCollectionResult };
      const raw: FaceEditCollectionResult = await res.json();
      setData(raw);
      return raw;
    } catch (err: any) {
      setError(err.message || "Upload failed");
      return { collection_id, items: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, runCollection };
}
