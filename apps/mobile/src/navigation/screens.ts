export type Screen =
  | 'splash'
  | 'home'
  | 'fn01_vocabulary'
  | 'fn02_vocab_manage'
  | 'fn03_sentences'
  | 'fn04_collection'
  | 'fn05_spaced_repetition'
  | 'fn06_context_review'
  | 'fn07_ai_chat'
  | 'fn08_speaking'
  | 'fn09_pronunciation'
  | 'fn10_dashboard'
  | 'fn11_notifications';

export type FeatureMeta = {
  screen: Screen;
  title: string;
  req: string;
  description: string;
};

export const FEATURES: FeatureMeta[] = [
  {
    screen: 'fn01_vocabulary',
    title: 'Học từ vựng ngữ cảnh',
    req: 'REQ-01',
    description: 'Xem từ trong ngữ cảnh công việc — context, ví dụ, topic.',
  },
  {
    screen: 'fn02_vocab_manage',
    title: 'Quản lý từ vựng cá nhân',
    req: 'REQ-02',
    description: 'Thêm, sửa, yêu thích từ của bạn.',
  },
  {
    screen: 'fn03_sentences',
    title: 'Quản lý câu giao tiếp',
    req: 'REQ-03',
    description: 'Lưu câu mẫu theo chủ đề.',
  },
  {
    screen: 'fn04_collection',
    title: 'Learning Collection',
    req: 'REQ-04',
    description: 'Bộ sưu tập từ và câu.',
  },
  {
    screen: 'fn05_spaced_repetition',
    title: 'Spaced Repetition',
    req: 'REQ-05',
    description: 'Ôn từ theo lịch SRS.',
  },
  {
    screen: 'fn06_context_review',
    title: 'Context Review',
    req: 'REQ-06',
    description: 'Quiz chọn nghĩa theo ngữ cảnh.',
  },
  {
    screen: 'fn07_ai_chat',
    title: 'AI Conversation',
    req: 'REQ-07',
    description: 'Luyện hội thoại với AI.',
  },
  {
    screen: 'fn08_speaking',
    title: 'Speaking',
    req: 'REQ-08',
    description: 'Luyện nói — speech to text.',
  },
  {
    screen: 'fn09_pronunciation',
    title: 'Pronunciation Scoring',
    req: 'REQ-09',
    description: 'Chấm điểm phát âm.',
  },
  {
    screen: 'fn10_dashboard',
    title: 'Dashboard học tập',
    req: 'REQ-10',
    description: 'Streak, XP, tiến độ.',
  },
  {
    screen: 'fn11_notifications',
    title: 'Notification Reminder',
    req: 'REQ-11',
    description: 'Nhắc học hàng ngày.',
  },
];

export const QUICK_LINK_SCREENS: Record<string, Screen> = {
  'Từ vựng ngữ cảnh': 'fn01_vocabulary',
  'Context Review': 'fn06_context_review',
  Speaking: 'fn08_speaking',
  'AI Chat': 'fn07_ai_chat',
  'Bộ sưu tập': 'fn04_collection',
  'Tiến độ': 'fn10_dashboard',
};
