import { useState, useCallback } from "react";
import { BASE_API_ENDPOINT } from "~/config";
import { supabase } from "~/lib/supabase";

export const send_like = async (job_id: string) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  const token = session?.access_token;

  const res = await fetch(`${BASE_API_ENDPOINT}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job_id }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server ${res.status}: ${text}`);
  }
};
