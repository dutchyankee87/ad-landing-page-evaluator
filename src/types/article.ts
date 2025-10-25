export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
  };
  publishedDate: string;
  readTime: string;
  category: string;
  tags: string[];
  slug: string;
}