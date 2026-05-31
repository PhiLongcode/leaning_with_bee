export type AppSystemPermissions = {
  allowUserVocabCrud: boolean;
  allowQuickCapture: boolean;
  allowAiTutor: boolean;
  allowAiVocabEnrich: boolean;
  allowSocialRank: boolean;
  allowWebSync: boolean;
};

export type AppSystemConfig = {
  permissions: AppSystemPermissions;
  updatedAt: string | null;
};

export const DEFAULT_APP_SYSTEM_PERMISSIONS: AppSystemPermissions = {
  allowUserVocabCrud: true,
  allowQuickCapture: true,
  allowAiTutor: true,
  allowAiVocabEnrich: true,
  allowSocialRank: false,
  allowWebSync: false,
};

export const DEFAULT_APP_SYSTEM_CONFIG: AppSystemConfig = {
  permissions: DEFAULT_APP_SYSTEM_PERMISSIONS,
  updatedAt: null,
};

export function mapPermissionsJson(raw: unknown): AppSystemPermissions {
  const p = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    allowUserVocabCrud: p.allow_user_vocab_crud !== false,
    allowQuickCapture: p.allow_quick_capture !== false,
    allowAiTutor: p.allow_ai_tutor !== false,
    allowAiVocabEnrich: p.allow_ai_vocab_enrich !== false,
    allowSocialRank: p.allow_social_rank === true,
    allowWebSync: p.allow_web_sync === true,
  };
}
