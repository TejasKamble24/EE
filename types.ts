
export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  takeaways: string[];
  task: string;
  reflection: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  level: CourseLevel;
  duration: string;
  price: number | 'Free';
  category: string;
  description: string;
  outcomes: string[];
  targetAudience: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  modules: Module[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  subject: string;
  experience: string;
  avatar: string;
  completedCourses: string[];
  progress: Record<string, number>; // courseId -> percentage
}

export interface DiscussionPost {
  id: string;
  author: string;
  role: string;
  title: string;
  content: string;
  category: string;
  replies: number;
  timestamp: string;
}
