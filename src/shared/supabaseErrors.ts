function postgrestCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code: string }).code);
  }
  return '';
}

/** Lỗi PostgREST khi bảng chưa tồn tại (schema chưa push). */
export function isMissingTableError(error: unknown): boolean {
  const code = postgrestCode(error);
  if (code === 'PGRST205' || code === '42P01') return true;
  const msg = errorMessage(error);
  return (
    msg.includes('PGRST205') ||
    msg.includes('Could not find the table') ||
    msg.includes('does not exist') ||
    msg.includes('404') ||
    (msg.includes('relation') && msg.includes('not found'))
  );
}

/** Cột chưa migrate (vd. vocabulary.lesson_day). */
export function isMissingColumnError(error: unknown): boolean {
  const code = postgrestCode(error);
  if (code === '42703') return true;
  const msg = errorMessage(error);
  return msg.includes('does not exist') && msg.includes('column');
}

export function isInvalidUuid(value: string): boolean {
  return !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function errorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: string }).message);
  }
  return String(error ?? '');
}
