import { useState, useCallback, useRef, useEffect } from "react";
import { FaceEditResult } from "./useFaceEditsPreset";
import { BASE_API_ENDPOINT } from "~/config";

export interface Downloads {
  url: string;
  expires_at: string;
}

export interface FaceEditStatus {
  id: string;
  status: "complete" | "error" | "canceled" | "draft" | "queued" | "rendering";
  downloads: Downloads[];
}

interface UseGetFaceEditPresetsReturn {
  data: FaceEditStatus[];
  loading: boolean;
  /** Any error message (or null if no error) */
  error: string | null;
  /**
   * Kick off the upload + preset call.
   * @param imageUri - local URI of the image to send
   */
  getEdit: (faceEditResult: FaceEditResult[]) => Promise<void>;
}

/**
 * Hook to call your /preset-face-edit-all endpoint with polling support.
 */
export function useGetFaceEdit(): UseGetFaceEditPresetsReturn {
  const [data, setData] = useState<FaceEditStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const fetchJobStatus = useCallback(
    async (jobId: string): Promise<FaceEditStatus | null> => {
      try {
        const res = await fetch(
          `${BASE_API_ENDPOINT}/face-edit-status/${jobId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          console.warn(
            `Failed to fetch status for job ${jobId}: ${res.status}`
          );
          return null;
        }

        return (await res.json()) as FaceEditStatus;
      } catch (err) {
        console.warn(`Error fetching status for job ${jobId}:`, err);
        return null;
      }
    },
    []
  );

  const pollJobStatuses = useCallback(
    async (jobIds: string[]) => {
      const statusPromises = jobIds.map((jobId) => fetchJobStatus(jobId));
      const results = await Promise.allSettled(statusPromises);

      // Filter out failed requests and null results
      const validStatuses = results
        .map((result, index) => {
          if (result.status === "fulfilled" && result.value !== null) {
            return result.value;
          }
          return null;
        })
        .filter((status): status is FaceEditStatus => status !== null);

      // If no valid statuses were retrieved, that's a problem
      if (validStatuses.length === 0) {
        throw new Error("Failed to fetch status for all jobs");
      }
      setData(validStatuses);

      // Check if we should continue polling
      const shouldContinuePolling = validStatuses.some((status) =>
        ["queued", "rendering", "draft"].includes(status.status)
      );

      if (!shouldContinuePolling) {
        // All jobs are in final states, stop polling
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setLoading(false);
      }

      return shouldContinuePolling;
    },
    [fetchJobStatus]
  );

  const startPolling = useCallback(
    (jobIds: string[]) => {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(async () => {
        try {
          const shouldContinue = await pollJobStatuses(jobIds);
          if (!shouldContinue) {
            // Polling stopped naturally, loading state already set to false
            return;
          }
        } catch (err: any) {
          // All jobs failed
          setError(err.message || "Failed to fetch job statuses");
          setLoading(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 2000); // Poll every 2 seconds
    },
    [pollJobStatuses]
  );

  const getEdit = useCallback(
    async (faceEditResult: FaceEditResult[]) => {
      setLoading(true);
      setError(null);
      setData([]);

      // Clear any existing polling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      try {
        const jobIds = faceEditResult.map((job) => job.job_id);

        // Initial fetch
        const shouldContinuePolling = await pollJobStatuses(jobIds);

        if (shouldContinuePolling) {
          // Start polling for updates
          startPolling(jobIds);
        } else {
          // All jobs are already in final states
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch job statuses");
        setLoading(false);
      }
    },
    [pollJobStatuses, startPolling]
  );

  return { data, loading, error, getEdit };
}
