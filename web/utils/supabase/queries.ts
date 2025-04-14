/**
 * Loads data for a specific profile given its ID
 */

import { SupabaseClient, User } from "@supabase/supabase-js";
import { Profile} from "./models";
import { z } from "zod";

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
