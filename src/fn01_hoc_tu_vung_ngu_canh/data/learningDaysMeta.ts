export type LearningDayMeta = {
  dayNumber: number;
  title: string;
  subtitle: string;
  topic: string;
  wordCount: number;
};

export const LEARNING_DAYS: LearningDayMeta[] = [
  { dayNumber: 1, title: 'Ngày 1', subtitle: 'Stand-up & Agile', topic: 'Agile / Scrum', wordCount: 10 },
  { dayNumber: 2, title: 'Ngày 2', subtitle: 'Code & Git', topic: 'Software Development', wordCount: 10 },
  { dayNumber: 3, title: 'Ngày 3', subtitle: 'Giao tiếp team', topic: 'Workplace Communication', wordCount: 10 },
  { dayNumber: 4, title: 'Ngày 4', subtitle: 'Email & báo cáo', topic: 'Business Writing', wordCount: 10 },
  { dayNumber: 5, title: 'Ngày 5', subtitle: 'Chất lượng & bug', topic: 'Quality Assurance', wordCount: 10 },
  { dayNumber: 6, title: 'Ngày 6', subtitle: 'Kế hoạch & timeline', topic: 'Project Planning', wordCount: 10 },
  { dayNumber: 7, title: 'Ngày 7', subtitle: 'Phỏng vấn & thăng tiến', topic: 'Career Growth', wordCount: 10 },
];
