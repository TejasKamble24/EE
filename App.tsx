
import React, { useState } from 'react';
import { Header } from './components/Header';
import { BusinessPlan } from './components/BusinessPlan';
import { MOCK_COURSES, MOCK_DISCUSSIONS, TEACH_WITH_TECH_COURSE } from './constants';
import { Course, User, Lesson } from './types';
import { getTeachingAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('portal');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // PIN Logic
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinTarget, setPinTarget] = useState<'home' | 'business-plan' | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({
      id: 'u1',
      name: 'Priya Sharma',
      email: 'priya@school.edu',
      subject: 'Science',
      experience: '5 Years',
      avatar: 'https://picsum.photos/seed/priya/100/100',
      completedCourses: [],
      progress: { 'c1': 20 }
    });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('portal');
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setCurrentPage('course-detail');
    window.scrollTo(0, 0);
  };

  const startLearning = (course: Course) => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    setSelectedCourse(course);
    if (course.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(course.modules[0].lessons[0]);
    }
    setCurrentPage('player');
    window.scrollTo(0, 0);
  };

  const handleAskAI = async (prompt: string) => {
    setIsAiLoading(true);
    const advice = await getTeachingAdvice(prompt);
    setAiResponse(advice || "");
    setIsAiLoading(false);
  };

  const triggerPinCheck = (target: 'home' | 'business-plan') => {
    setPinTarget(target);
    setShowPinModal(true);
    setPinInput('');
    setPinError(false);
  };

  const handlePinInput = (digit: string) => {
    if (pinInput.length >= 4) return;
    const newPin = pinInput + digit;
    setPinInput(newPin);
    setPinError(false);

    if (newPin.length === 4) {
      const requiredPin = pinTarget === 'home' ? '1111' : '2222';
      if (newPin === requiredPin) {
        setTimeout(() => {
          setCurrentPage(pinTarget!);
          setShowPinModal(false);
          setPinTarget(null);
          setPinInput('');
          window.scrollTo(0, 0);
        }, 300);
      } else {
        setPinError(true);
        setTimeout(() => {
          setPinInput('');
          setPinError(false);
        }, 1000);
      }
    }
  };

  const GlobalBackButton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <button 
        onClick={() => {
            setShowPinModal(false);
            setPinTarget(null);
            setCurrentPage('portal');
        }}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition group py-2 text-sm sm:text-base"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
        Back to Portal
      </button>
    </div>
  );

  const PinEntryModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-2xl max-w-sm w-full transform transition-all scale-100">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl sm:text-2xl mx-auto mb-4">🔒</div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Protected Access</h3>
          <p className="text-slate-500 mt-2 text-xs sm:text-sm">Enter PIN to continue to {pinTarget === 'home' ? 'Teacher Platform' : 'Business Plan'}.</p>
        </div>

        <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-10 h-14 sm:w-12 sm:h-16 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-bold transition-all ${
                pinError ? 'border-red-500 bg-red-50 text-red-600 animate-pulse' : 
                pinInput.length > i ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              {pinInput.length > i ? '•' : ''}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((key) => (
            <button
              key={key.toString()}
              onClick={() => {
                if (key === 'C') setPinInput('');
                else if (key === '←') setPinInput(prev => prev.slice(0, -1));
                else handlePinInput(key.toString());
              }}
              className="h-12 sm:h-14 rounded-xl font-bold text-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all text-slate-700"
            >
              {key}
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            setShowPinModal(false);
            setPinTarget(null);
            setCurrentPage('portal');
          }}
          className="w-full text-emerald-600 font-bold hover:text-emerald-700 transition flex items-center justify-center gap-2 border-t pt-4 sm:pt-6 text-sm"
        >
          <span>←</span> Back to Portal
        </button>
      </div>
    </div>
  );

  const renderPortal = () => (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-4 sm:px-6 py-12">
      <div className="text-center mb-10 sm:mb-16 max-w-2xl px-2">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl mx-auto mb-6 shadow-xl">E</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">EduElevate Ecosystem</h1>
        <p className="text-sm sm:text-lg text-slate-600">Choose your path to explore professional educator development or deep dive into our business strategy.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-5xl">
        <div 
          onClick={() => triggerPinCheck('home')}
          className="group bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center"
        >
          <div className="text-5xl sm:text-6xl mb-6 transform group-hover:scale-110 transition-transform">🎓</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">I am a Teacher</h2>
          <p className="text-xs sm:text-base text-slate-500 mb-8 leading-relaxed">Upgrade your skills, earn certifications, and join the global educator community.</p>
          <button className="mt-auto w-full sm:w-auto bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-emerald-700 shadow-lg transition transform group-hover:-translate-y-1">
            Explore Courses
          </button>
        </div>

        <div 
          onClick={() => triggerPinCheck('business-plan')}
          className="group bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-slate-200 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center"
        >
          <div className="text-5xl sm:text-6xl mb-6 transform group-hover:scale-110 transition-transform">💼</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">For Stakeholders</h2>
          <p className="text-xs sm:text-base text-slate-500 mb-8 leading-relaxed">View our problem statement, revenue model, and long-term scaling vision.</p>
          <button className="mt-auto w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-black shadow-lg transition transform group-hover:-translate-y-1">
            Explore Strategy
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-12 sm:space-y-20 pb-20">
      <GlobalBackButton />
      <section className="bg-gradient-to-br from-emerald-50 to-white pt-6 pb-20 sm:pt-12 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Upgrade Your Teaching Skills.<br/>
            <span className="text-emerald-600">Teach with Confidence.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
            Practical, bite-sized courses designed for the modern educator. Join 50,000+ teachers transforming their classrooms today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
            <button onClick={() => setCurrentPage('login')} className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-emerald-700 shadow-lg transition transform hover:-translate-y-1">Start Free</button>
            <button onClick={() => setCurrentPage('courses')} className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition">Explore Courses</button>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-[2rem] p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">Featured Course</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4">Teach with Tech</h2>
            <p className="text-slate-300 mb-8 text-base sm:text-lg">Master the essential digital tools to create an engaging classroom environment in just 2.5 hours.</p>
            <button onClick={() => handleCourseClick(TEACH_WITH_TECH_COURSE)} className="w-full sm:w-auto bg-white text-slate-900 px-10 py-3.5 rounded-xl font-bold hover:bg-emerald-50 transition shadow-lg">Enroll Now</button>
          </div>
          <div className="flex-1 w-full h-56 sm:h-80 bg-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
             <img src="https://picsum.photos/seed/tech/800/600" className="w-full h-full object-cover opacity-60" alt="Tech" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 transition">▶</div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderCourses = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <GlobalBackButton />
      <div className="mb-10 mt-6 sm:mt-12 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Explore Courses</h1>
        <p className="text-slate-500">Professional upskilling tailored for every grade level.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        {MOCK_COURSES.map(course => (
          <div key={course.id} onClick={() => handleCourseClick(course)} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer flex flex-col">
            <div className="h-48 bg-slate-100 relative">
              <img src={`https://picsum.photos/seed/${course.id}/600/400`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={course.title} />
              <span className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">{course.price === 'Free' ? 'Free' : `$${course.price}`}</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition">{course.title}</h3>
              <div className="mt-auto flex items-center justify-between text-slate-400 text-sm">
                 <span className="flex items-center gap-1">⏱ {course.duration}</span>
                 <span className="text-emerald-600 font-bold">View Course →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCourseDetail = () => {
    if (!selectedCourse) return null;
    return (
      <div className="bg-white min-h-screen">
        <GlobalBackButton />
        <div className="bg-slate-900 py-12 sm:py-20 text-white mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
               <div className="flex-[3]">
                  <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">{selectedCourse.title}</h1>
                  <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">{selectedCourse.description}</p>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">{selectedCourse.level}</div>
                    <div className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">{selectedCourse.duration}</div>
                    <div className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">{selectedCourse.category}</div>
                  </div>
               </div>
               <div className="flex-[2] w-full">
                 <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl">
                    <img src={`https://picsum.photos/seed/${selectedCourse.id}/400/250`} className="w-full h-48 object-cover rounded-2xl mb-8 shadow-inner" alt="Preview" />
                    <button onClick={() => startLearning(selectedCourse)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg text-lg">Enroll Now</button>
                    <div className="mt-6 space-y-3 text-sm text-slate-500">
                        <p className="flex items-center gap-2">✓ Full lifetime access</p>
                        <p className="flex items-center gap-2">✓ Certificate of completion</p>
                        <p className="flex items-center gap-2">✓ Peer discussion group</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-slate-900">Learning Outcomes</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {selectedCourse.outcomes.map((out, idx) => (
                    <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 items-start">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                        <p className="text-slate-700 font-medium leading-relaxed">{out}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

  const renderLogin = () => (
    <div className="min-h-[80vh] flex flex-col bg-slate-50 px-4">
      <GlobalBackButton />
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Teacher Login</h2>
              <p className="text-slate-500">Secure access to your professional dashboard.</p>
          </div>
          <div className="space-y-4">
              <button onClick={handleLogin} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center justify-center gap-3">
                <span className="text-xl">G</span> Continue with Google
              </button>
              <button onClick={handleLogin} className="w-full border-2 border-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-50 transition">Login with OTP</button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-8 leading-relaxed">
            By joining EduElevate, you agree to our professional standards and privacy guidelines for educators.
          </p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <GlobalBackButton />
      <div className="mb-10 mt-6 sm:mt-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Welcome, {user?.name}</h1>
        <p className="text-slate-500">Ready to complete your next module?</p>
      </div>
      <div className="grid gap-8">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-10 flex flex-col lg:flex-row gap-10 items-center shadow-sm">
             <div className="w-full lg:w-72 h-48 bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner">
                <img src="https://picsum.photos/seed/c1/400/300" className="w-full h-full object-cover" alt="Course" />
                <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold shadow-xl">▶</div>
                </div>
             </div>
             <div className="flex-1 w-full text-center lg:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 justify-center lg:justify-start">
                   <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">In Progress</span>
                   <span className="text-xs text-slate-400 font-medium">• Last active 2 days ago</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-800">Teach with Tech</h3>
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>COURSE PROGRESS</span>
                        <span className="text-emerald-600">20%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-emerald-500 h-full w-[20%] transition-all duration-1000" />
                    </div>
                </div>
                <button onClick={() => startLearning(TEACH_WITH_TECH_COURSE)} className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg">Resume Learning</button>
             </div>
          </div>
      </div>
    </div>
  );

  const renderPlayer = () => {
    if (!selectedCourse || !activeLesson) return null;
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-900">
        <div className="bg-white py-4 px-4 sm:px-6 flex justify-between items-center border-b border-slate-100">
            <button onClick={() => setCurrentPage('dashboard')} className="text-slate-500 hover:text-emerald-600 font-bold flex items-center gap-2 text-sm">
                <span>←</span> <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            <h2 className="font-bold text-slate-800 text-sm truncate max-w-[150px] sm:max-w-md">{selectedCourse.title}</h2>
            <div className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">20% DONE</div>
        </div>
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
              <div className="max-w-4xl mx-auto space-y-8">
                  <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative">
                      <video src={activeLesson.videoUrl} controls className="w-full h-full" />
                  </div>
                  <div className="bg-white p-6 sm:p-10 rounded-[2rem] border border-slate-100 shadow-sm">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{activeLesson.title}</h1>
                      <div className="grid md:grid-cols-2 gap-8 mt-10">
                          <div className="space-y-6">
                              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">📌 Key Learning Points</h3>
                              <ul className="space-y-4">
                                  {activeLesson.takeaways.map((t, i) => (
                                      <li key={i} className="text-sm text-slate-600 flex gap-3 leading-relaxed font-medium">
                                        <span className="text-emerald-500 mt-1">•</span> {t}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                          <div className="bg-emerald-50 p-6 sm:p-8 rounded-3xl border border-emerald-100">
                              <h3 className="font-bold text-emerald-900 mb-4 text-lg">🛠 Practical Homework</h3>
                              <p className="text-sm text-emerald-800 leading-relaxed mb-6 italic">{activeLesson.task}</p>
                              <label className="block text-[10px] font-bold text-emerald-600 mb-2 uppercase tracking-widest">Self Reflection</label>
                              <textarea className="w-full bg-white border border-emerald-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" rows={4} placeholder={activeLesson.reflection}></textarea>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
            <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto h-64 lg:h-auto">
                <div className="p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h3 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-widest">Curriculum</h3>
                    <p className="text-xs text-slate-400 font-medium">Progress through the modules below</p>
                </div>
                <div className="p-4">
                    {selectedCourse.modules.map(mod => (
                      <div key={mod.id} className="mb-6">
                        <p className="text-[10px] font-bold text-slate-300 mb-3 px-2 uppercase tracking-widest">{mod.title}</p>
                        <div className="space-y-1">
                            {mod.lessons.map(les => (
                              <div 
                                key={les.id} 
                                onClick={() => setActiveLesson(les)} 
                                className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${activeLesson.id === les.id ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] border-2 flex-shrink-0 ${activeLesson.id === les.id ? 'border-emerald-500 bg-emerald-500 text-white shadow-md' : 'border-slate-200 bg-white text-slate-300'}`}>
                                    {activeLesson.id === les.id ? '▶' : '✓'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm leading-tight line-clamp-1">{les.title}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{les.duration}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderCommunity = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <GlobalBackButton />
      <div className="mt-8 px-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Teacher Community</h1>
        <p className="text-slate-500 mb-10">Collaborate with educators across the globe.</p>
        <div className="space-y-6">
           {MOCK_DISCUSSIONS.map(disc => (
             <div key={disc.id} className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group cursor-pointer">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-sm font-bold text-emerald-600 shadow-inner">{disc.author[0]}</div>
                    <div className="text-xs">
                        <p className="font-bold text-slate-900">{disc.author}</p>
                        <p className="text-slate-400">{disc.timestamp} • {disc.category}</p>
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 transition leading-tight">{disc.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed line-clamp-3">{disc.content}</p>
                <div className="flex items-center justify-between border-t pt-6">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1">💬 {disc.replies} Replies</span>
                        <span className="flex items-center gap-1">👍 24 Helpful</span>
                    </div>
                    <span className="text-emerald-600 text-sm font-bold">Read Discussion →</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <GlobalBackButton />
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-16 mt-6 text-center shadow-xl">
         <div className="relative inline-block mb-8">
            <img src={user?.avatar} className="w-28 h-28 sm:w-40 sm:h-40 rounded-full mx-auto border-4 border-emerald-500 shadow-2xl p-1 bg-white" alt="User" />
            <div className="absolute bottom-2 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 border-4 border-white rounded-full flex items-center justify-center text-white text-xs shadow-lg">✓</div>
         </div>
         <h1 className="text-3xl font-bold text-slate-900 mb-2">{user?.name}</h1>
         <p className="text-slate-500 text-sm mb-6">{user?.email}</p>
         <div className="flex justify-center flex-wrap gap-2">
             <span className="text-xs font-bold bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full border border-slate-100">{user?.subject} Educator</span>
             <span className="text-xs font-bold bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full border border-slate-100">{user?.experience} Mastery</span>
         </div>
         <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-12 max-w-sm mx-auto">
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                 <p className="text-3xl font-bold text-emerald-600">1</p>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Courses</p>
             </div>
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                 <p className="text-3xl font-bold text-slate-200">0</p>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Certificates</p>
             </div>
         </div>
         <button onClick={handleLogout} className="mt-16 text-red-500 font-bold hover:bg-red-50 px-8 py-3 rounded-xl transition text-sm flex items-center gap-2 mx-auto">
            <span>🚪</span> Sign Out
         </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {showPinModal && <PinEntryModal />}
      <main className="flex-1">
        {currentPage === 'portal' && renderPortal()}
        {currentPage === 'home' && renderHome()}
        {currentPage === 'courses' && renderCourses()}
        {currentPage === 'course-detail' && renderCourseDetail()}
        {currentPage === 'business-plan' && <div className="py-8 sm:py-12"><GlobalBackButton /><BusinessPlan /></div>}
        {currentPage === 'login' && renderLogin()}
        {currentPage === 'dashboard' && isLoggedIn && renderDashboard()}
        {currentPage === 'player' && isLoggedIn && renderPlayer()}
        {currentPage === 'community' && isLoggedIn && renderCommunity()}
        {currentPage === 'profile' && isLoggedIn && renderProfile()}
      </main>
      <footer className="bg-white border-t border-slate-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center cursor-pointer" onClick={() => { setCurrentPage('portal'); window.scrollTo(0, 0); }}>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mr-3 shadow-lg">E</div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">EduElevate</span>
           </div>
           <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500 font-bold">
              <button onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }} className="hover:text-emerald-600 transition">Mission</button>
              <button className="hover:text-emerald-600 transition">Terms</button>
              <button className="hover:text-emerald-600 transition">Privacy</button>
              <button className="hover:text-emerald-600 transition">Help</button>
           </div>
           <p className="text-xs text-slate-400 text-center md:text-right leading-relaxed">
             © 2024 EduElevate Platform.<br className="hidden md:block" /> Built for Teachers, by Educators.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;