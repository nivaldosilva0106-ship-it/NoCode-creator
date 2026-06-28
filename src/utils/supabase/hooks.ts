import { supabase } from "../utils/supabase/client";

export async function checkSupabaseConnection() {
  try {
    const res = await fetch("/api/supabase/status");
    const data = await res.json();
    return data;
  } catch {
    return { connected: false, error: "Não foi possível conectar ao servidor." };
  }
}

export async function saveProjectToSupabase(project: {
  prompt: string;
  html: string;
  css: string;
  js: string;
  explanation: string;
}) {
  try {
    const res = await fetch("/api/supabase/projects/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    return await res.json();
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function getProjectsFromSupabase() {
  try {
    const res = await fetch("/api/supabase/projects");
    return await res.json();
  } catch (err: any) {
    return { projects: [], error: err.message };
  }
}

export async function deleteProjectFromSupabase(id: string) {
  try {
    const res = await fetch(`/api/supabase/projects/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err: any) {
    return { error: err.message };
  }
}
