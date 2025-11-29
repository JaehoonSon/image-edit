import { useState, useCallback } from "react";
import { BASE_API_ENDPOINT } from "~/config";
import { supabase } from "~/lib/supabase";

export interface CreateCollectionResult {
  collection_id: string;
  status: string;
}

interface UseFaceEditPresetsReturn {
  /** The array of results returned by the API (or null if none yet) */
  data: CreateCollectionResult | null;
  /** True while the request is in flight */
  loading: boolean;
  /** Any error message (or null if no error) */
  error: string | null;
  /**
   * Kick off the upload + preset call.
   * @param imageUri - local URI of the image to send
   */
  runCollection: (imageUri: string) => Promise<void>;
}

/**
 * Hook to call your /preset-face-edit-all endpoint.
 * @param apiUrl Base URL (e.g. "https://api.example.com")
 */
export function useCreateCollection(): UseFaceEditPresetsReturn {
  const [data, setData] = useState<CreateCollectionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runCollection = useCallback(async (imageUri: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      const token = session?.access_token;

      const res = await fetch(`${BASE_API_ENDPOINT}/preset-face-edit-all`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("done");
      // console.log(await res.text());

      if (!res.ok) {
        console.log("This?");
        const text = await res.text();
        throw new Error(`Server ${res.status}: ${text}`);
      }

      // const json = (await res.json()) as { results: CreateCollectionResult };
      const raw: CreateCollectionResult = await res.json();
      setData(raw);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, runCollection };
}
