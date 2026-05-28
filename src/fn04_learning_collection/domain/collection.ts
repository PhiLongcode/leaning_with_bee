export type LearningCollection = {
  id: string;
  deviceId: string;
  title: string;
  description: string | null;
};

export type CollectionItem = {
  id: string;
  collectionId: string;
  itemType: 'vocabulary' | 'sentence';
  itemId: string;
};
