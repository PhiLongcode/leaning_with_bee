-- FN-11 phase 2: lưu khung giờ nhắc trên Supabase (song song AsyncStorage)

alter table public.notification_settings
  add column if not exists window_start_hour int not null default 8
    check (window_start_hour between 0 and 23),
  add column if not exists window_end_hour int not null default 20
    check (window_end_hour between 0 and 23),
  add column if not exists interval_hours int not null default 3
    check (interval_hours between 1 and 12);
