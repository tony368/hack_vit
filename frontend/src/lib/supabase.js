import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dlprtzxwaxgeofaaocdy.supabase.co";
const supabaseKey = "sb_publishable_lvb59KLaahJ0P0btaaxa1w_HMkDsbEi";

export const supabase = createClient(supabaseUrl, supabaseKey);
