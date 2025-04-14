/**
 * Loads data for a specific profile given its ID
 */

import { SupabaseClient, User } from "@supabase/supabase-js";
import { Profile } from "./models";
import { z } from "zod";

// get profile data
export const getProfileData = async (
  supabase: SupabaseClient,
  profileId: string
): Promise<z.infer<typeof Profile>> => {
  const { data, error } = await supabase
    .from("profile")
    .select()
    .eq("id", profileId)
    .single();

  if (error) {
    alert(error.message);
  }

  return Profile.parse(data);
};

// for reference only to understand data structure
type NotebooksData = {
  name: string;
  id: string;
  chapter: {
    name: string;
    id: string;
    page: {
      name: string;
      id: string;
    }[];
  }[];
}[];

// get notebooks, chapters, and pages for authenicated user
export async function getNotebookTreeByUser(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("notebook")
    .select(
      `
      id,
      title,
      chapter (
        id,
        title,
        page (
          id,
          title
        )
      )
    `
    )
    .eq("author_id", userId);

  if (error) {
    console.error("Failed to fetch notebook tree:", error.message);
    return [];
  }

  return data.map((notebook) => ({
    name: notebook.title,
    id: notebook.id,
    chapter: notebook.chapter.map((ch) => ({
      name: ch.title,
      id: ch.id,
      page: ch.page.map((pg) => ({
        name: pg.title,
        id: pg.id,
      })),
    })),
  }));
}
