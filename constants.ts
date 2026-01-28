
import { Course, CourseLevel, DiscussionPost } from './types';

export const TEACH_WITH_TECH_COURSE: Course = {
  id: 'c1',
  title: 'Teach with Tech',
  level: CourseLevel.BEGINNER,
  duration: '2.5 Hours',
  price: 'Free',
  category: 'Educational Technology',
  description: 'Master the fundamental digital tools that transform classroom teaching and administrative efficiency.',
  targetAudience: 'K-12 Teachers new to digital classroom tools.',
  outcomes: [
    'Confidently use core digital teaching platforms',
    'Create interactive content for diverse learning styles',
    'Streamline administrative tasks using cloud tools',
    'Apply ethical digital citizenship in the classroom'
  ],
  instructor: {
    name: 'Dr. Sarah Mitchell',
    role: 'EdTech Specialist & Former Principal',
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  modules: [
    {
      id: 'm1',
      title: 'Technology Basics for Teachers',
      lessons: [{
        id: 'l1',
        title: 'Navigating the Digital Landscape',
        duration: '12 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        takeaways: ['Understanding cloud storage', 'Hardware vs Software basics', 'Troubleshooting basics'],
        task: 'Organize your current lesson plans into a cloud-based folder structure.',
        reflection: 'Which manual task takes you the most time currently, and how could a digital tool solve it?'
      }]
    },
    {
      id: 'm2',
      title: 'Creating Simple Digital Content',
      lessons: [{
        id: 'l2',
        title: 'Interactive Presentations 101',
        duration: '15 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        takeaways: ['Visual design principles', 'Integrating multimedia', 'Interactive quizzes'],
        task: 'Convert one slide-based lesson into an interactive presentation with at least one poll.',
        reflection: 'How do visuals change the way your students perceive complex information?'
      }]
    },
    {
      id: 'm3',
      title: 'Classroom Engagement using Technology',
      lessons: [{
        id: 'l3',
        title: 'Gamifying the Lesson',
        duration: '10 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        takeaways: ['Engagement strategies', 'Game-based learning tools', 'Real-time feedback'],
        task: 'Run a 5-minute digital quiz at the end of your next lesson.',
        reflection: 'Did the competitive element of gamification help or distract your students?'
      }]
    },
    {
      id: 'm4',
      title: 'Organizing Teaching Work Digitally',
      lessons: [{
        id: 'l4',
        title: 'Automating Gradebooks & Attendance',
        duration: '15 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        takeaways: ['Spreadsheet automation', 'Email templates', 'Calendar management'],
        task: 'Set up an automated attendance tracker for one week.',
        reflection: 'How many minutes did you save this week using digital automation?'
      }]
    },
    {
      id: 'm5',
      title: 'Responsible and Ethical Use of Technology',
      lessons: [{
        id: 'l5',
        title: 'Digital Safety & Privacy',
        duration: '8 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        takeaways: ['Student data privacy', 'Copyright laws for teachers', 'Dealing with cyberbullying'],
        task: 'Review your school\'s privacy policy and list three ways you protect student data.',
        reflection: 'What is the biggest ethical challenge you see with AI in education?'
      }]
    }
  ]
};

export const MOCK_COURSES: Course[] = [
  TEACH_WITH_TECH_COURSE,
  {
    id: 'c2',
    title: 'Effective Parent Communication',
    level: CourseLevel.INTERMEDIATE,
    duration: '4 Hours',
    price: 49,
    category: 'Soft Skills',
    description: 'Build strong relationships with parents to support student success.',
    targetAudience: 'Experienced teachers looking to improve stakeholder relations.',
    outcomes: ['Conflict resolution techniques', 'Writing empathetic emails', 'Conducting PTMs'],
    instructor: { name: 'Mark Stevens', role: 'Counseling Lead', avatar: 'https://picsum.photos/seed/mark/100/100' },
    modules: []
  },
  {
    id: 'c3',
    title: 'Active Learning Strategies',
    level: CourseLevel.ADVANCED,
    duration: '6 Hours',
    price: 99,
    category: 'Pedagogy',
    description: 'Transform passive classrooms into dynamic learning hubs.',
    targetAudience: 'Teachers aiming for high-engagement mastery.',
    outcomes: ['Flipped classroom mastery', 'Project-based learning design', 'Peer-assessment systems'],
    instructor: { name: 'Dr. Jane Doe', role: 'Pedagogy Researcher', avatar: 'https://picsum.photos/seed/jane/100/100' },
    modules: []
  }
];

export const MOCK_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'd1',
    author: 'Sunil K.',
    role: 'Mathematics Teacher',
    title: 'Handling disruptive behavior in remote classes',
    content: 'Has anyone found a good way to manage middle schoolers who keep unmuting themselves at the wrong time?',
    category: 'Classroom Challenges',
    replies: 12,
    timestamp: '2 hours ago'
  },
  {
    id: 'd2',
    author: 'Priya M.',
    role: 'Primary School Educator',
    title: 'Best tools for teaching phonics?',
    content: 'Looking for interactive apps that help grade 1 students with letter sounds. Any recommendations?',
    category: 'Subject-specific',
    replies: 8,
    timestamp: '5 hours ago'
  }
];
