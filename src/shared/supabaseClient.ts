/** Supabase query surface for infrastructure adapters in src/. */

export type SupabaseRow = Record<string, unknown>;

export type SupabaseQueryResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

export type SupabaseFilter = {
  eq(column: string, value: unknown): SupabaseFilter;
  in(column: string, values: unknown[]): SupabaseFilter;
  select(columns?: string): SupabaseFilter;
  order(column: string, options?: { ascending?: boolean }): SupabaseFilter;
  limit(count: number): Promise<SupabaseQueryResult<SupabaseRow[]>>;
  single(): Promise<SupabaseQueryResult<SupabaseRow>>;
  maybeSingle(): Promise<SupabaseQueryResult<SupabaseRow | null>>;
};

type SelectChain = {
  select(columns?: string): SupabaseFilter;
};

export type SupabaseTable = {
  select(columns?: string): SupabaseFilter;
  insert(values: SupabaseRow | SupabaseRow[]): SelectChain;
  update(values: SupabaseRow): SupabaseFilter;
  delete(): SupabaseFilter;
  upsert(values: SupabaseRow | SupabaseRow[]): SelectChain;
};

export type SupabaseLikeClient = {
  from(table: string): SupabaseTable;
};

export function fromTable(client: SupabaseLikeClient, table: string): SupabaseTable {
  return client.from(table);
}
