import { useState, useCallback } from "react";
import { BASE_API_ENDPOINT } from "~/config";

export interface FaceEditResult {
  preset_id: string;
  preset_name: string;
  job_id: string;
  frame_cost: number;
  credits_charged: number;
}

interface UseFaceEditPresetsReturn {
  /** The array of results returned by the API (or null if none yet) */
  data: FaceEditResult[] | null;
  /** True while the request is in flight */
  loading: boolean;
  /** Any error message (or null if no error) */
  error: string | null;
  /**
   * Kick off the upload + preset call.
   * @param imageUri - local URI of the image to send
   */
  runPresets: (imageUri: string) => Promise<void>;
}

/**
 * Hook to call your /preset-face-edit-all endpoint.
 * @param apiUrl Base URL (e.g. "https://api.example.com")
 */
export function useFaceEditPresets(): UseFaceEditPresetsReturn {
  const [data, setData] = useState<FaceEditResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runPresets = useCallback(async (imageUri: string) => {
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

      const res = await fetch(`${BASE_API_ENDPOINT}/preset-face-edit-all`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server ${res.status}: ${text}`);
      }

      const json = (await res.json()) as { results: FaceEditResult[] };
      setData(json.results);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, runPresets };
}
