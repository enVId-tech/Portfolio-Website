import { ObjectId } from 'mongodb';

export interface BlogInterface {
  _id?: ObjectId | string;
  id: string; // slug
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  coverImage?: string;
  tags: string[];
  publishStatus: 'published' | 'private' | 'unlisted';
  scheduledPublish?: string;
  readTime: string;
}