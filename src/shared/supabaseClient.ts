/** Minimal Supabase query surface — tránh phụ thuộc @supabase/supabase-js trong src/. */
export type SupabaseQueryResult<T> = {
  data: T[] | null;
  error: { message: string } | null;
};

export type SupabaseTableClient = {
  select(columns: string): {
    limit(count: number): Promise<SupabaseQueryResult<Record<string, unknown>>>;
  };
};

export type SupabaseLikeClient = {
  from(table: string): SupabaseTableClient;
};
