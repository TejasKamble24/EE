
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
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition group py-2"
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
          <p className="text-slate-500 mt-2 text-sm sm:text-base">Enter PIN to continue to {pinTarget === 'home' ? 'Teacher Platform' : 'Business Plan'}.</p>
        </div>

        <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-10 h-14 sm:w-12 sm:h-16 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-bold transition-all ${
                pinError ? 'border-red-500 bg-red-50 text-red-600 animate-shake' : 
                pinInput.length > i ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              {pinInput.length > i ? '•' : ''}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((key) => (
            <button
              key={key.toString()}
              onClick={() => {
                if (key === 'C') setPinInput('');
                else if (key === '←') setPinInput(prev => prev.slice(0, -1));
                else handlePinInput(key.toString());
              }}
              className="h-12 sm:h-14 rounded-xl font-bold text-base sm:text-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-md active:scale-95 transition-all text-slate-700"
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
          className="w-full mt-6 text-emerald-600 font-bold hover:text-emerald-700 transition flex items-center justify-center gap-2 border-t pt-4 sm:pt-6"
        >
          <span>←</span> Back to Portal
        </button>
      </div>
    </div>
  );

  const renderPortal = () => (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-16 max-w-2xl">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl mx-auto mb-6 shadow-xl">E</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">EduElevate Ecosystem</h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 px-2">Select your destination to explore our professional educator platform or deep dive into our business strategy.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 sm:gap-8 w-full max-w-5xl">
        <div 
          onClick={() => triggerPinCheck('home')}
          className="group bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform">🎓</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">I am a Teacher</h2>
          <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 leading-relaxed">Upgrade your skills, earn certifications, and join the global educator community.</p>
          <button className="mt-auto w-full sm:w-auto bg-emerald-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-emerald-700 shadow-lg transition transform group-hover:-translate-y-1">
            Explore Courses
          </button>
        </div>

        <div 
          onClick={() => triggerPinCheck('business-plan')}
          className="group bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-slate-200 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform">💼</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">For Stakeholders</h2>
          <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 leading-relaxed">View our problem statement, 3-year revenue plan, and long-term business vision.</p>
          <button className="mt-auto w-full sm:w-auto bg-slate-900 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-black shadow-lg transition transform group-hover:-translate-y-1">
            Explore Business
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-12 sm:space-y-20 pb-20">
      <GlobalBackButton />
      <section className="bg-gradient-to-br from-emerald-50 to-white pt-8 pb-20 sm:pt-12 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Upgrade Your Teaching Skills.<br/>
            <span className="text-emerald-600">Teach with Confidence.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Practical, bite-sized courses designed for the modern educator. Join 50,000+ teachers transforming their classrooms today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setCurrentPage('login')} className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 shadow-lg transition transform hover:-translate-y-1">Start Free</button>
            <button onClick={() => setCurrentPage('courses')} className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-50 transition">Explore Courses</button>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">Featured Free Course</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-4 mb-4">Teach with Tech</h2>
            <p className="text-slate-300 mb-6 text-base sm:text-lg">Master the essential digital tools to create an engaging classroom environment in just 2.5 hours.</p>
            <button onClick={() => handleCourseClick(TEACH_WITH_TECH_COURSE)} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition w-full sm:w-auto">Enroll Now</button>
          </div>
          <div className="flex-1 w-full h-48 sm:h-64 md:h-80 bg-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
             <img src="https://picsum.photos/seed/tech/800/600" className="w-full h-full object-cover opacity-70" alt="Tech" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 transition">▶</div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderCourses = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <GlobalBackButton />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 sm:mb-12 mt-4 sm:mt-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Explore Courses</h1>
          <p className="text-slate-500">Pick a skill and start upgrading today.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {MOCK_COURSES.map(course => (
          <div key={course.id} onClick={() => handleCourseClick(course)} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition group cursor-pointer flex flex-col">
            <div className="h-40 sm:h-48 bg-slate-100 relative">
              <img src={`https://picsum.photos/seed/${course.id}/600/400`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={course.title} />
              <span className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">{course.price === 'Free' ? 'Free' : `$${course.price}`}</span>
            </div>
            <div className="p-5 sm:p-6 flex-1 flex flex-col">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 mb-3 leading-tight group-hover:text-emerald-600 transition">{course.title}</h3>
              <div className="mt-auto flex items-center justify-between text-slate-400 text-sm">
                 <span>⏱ {course.duration}</span>
                 <span className="text-emerald-600 font-semibold">View Details →</span>
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
        <div className="bg-slate-900 py-10 sm:py-16 text-white mt-4 sm:mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <button onClick={() => setCurrentPage('courses')} className="text-slate-400 hover:text-white mb-6 sm:mb-8 text-sm flex items-center gap-2"><span>←</span> Back to Courses</button>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
               <div className="flex-[2]">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">{selectedCourse.title}</h1>
                  <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8">{selectedCourse.description}</p>
                  <div className="flex flex-wrap gap-4 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                    <div className="bg-white/10 px-3 py-1 rounded-md">{selectedCourse.level}</div>
                    <div className="bg-white/10 px-3 py-1 rounded-md">{selectedCourse.duration}</div>
                    <div className="bg-white/10 px-3 py-1 rounded-md">{selectedCourse.price === 'Free' ? 'Free' : `$${selectedCourse.price}`}</div>
                  </div>
               </div>
               <div className="flex-1">
                 <div className="bg-white rounded-2xl p-4 sm:p-6 text-slate-900 shadow-2xl">
                    <img src={`https://picsum.photos/seed/${selectedCourse.id}/400/250`} className="w-full h-40 sm:h-48 object-cover rounded-xl mb-6 shadow-md" alt="Preview" />
                    <button onClick={() => startLearning(selectedCourse)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg text-lg">Enroll Now</button>
                    <p className="text-center text-slate-400 text-xs mt-4">Full lifetime access & Certificate included</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-2xl font-bold mb-8 text-slate-800">Learning Outcomes</h2>
            <div className="grid sm:grid-cols-2 gap-6">
                {selectedCourse.outcomes.map((out, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-sm">✓</div>
                        <p className="text-slate-600 text-sm sm:text-base">{out}</p>
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
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500 text-sm sm:text-base">Sign in to continue your teaching journey.</p>
          </div>
          <div className="space-y-4">
              <button onClick={handleLogin} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md">Continue with Google</button>
              <button onClick={handleLogin} className="w-full border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition">Login with Email</button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-6 px-4">By continuing, you agree to EduElevate's Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <GlobalBackButton />
      <div className="mb-8 sm:mb-12 mt-4 sm:mt-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Hello, {user?.name} 👋</h1>
        <p className="text-slate-500">You're making great progress! Keep going.</p>
      </div>
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 items-center shadow-sm">
         <div className="w-full md:w-56 lg:w-64 h-36 sm:h-40 bg-slate-100 rounded-2xl overflow-hidden relative">
            <img src="https://picsum.photos/seed/c1/400/300" className="w-full h-full object-cover" alt="Course" />
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900">▶</div>
            </div>
         </div>
         <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-2 justify-center md:justify-start">
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Current Learning</span>
               <span className="text-xs text-slate-400">• 20% Completed</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-slate-800">Teach with Tech</h3>
            <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[20%]" />
            </div>
            <button onClick={() => startLearning(TEACH_WITH_TECH_COURSE)} className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg">Resume Course</button>
         </div>
      </div>
    </div>
  );

  const renderPlayer = () => {
    if (!selectedCourse || !activeLesson) return null;
    return (
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <GlobalBackButton />
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden mt-4 sm:mt-6">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 pb-20">
              <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                  <div className="aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                      <video src={activeLesson.videoUrl} controls className="w-full h-full" />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{activeLesson.title}</h1>
                      <div className="flex gap-2">
                        <button className="text-xs font-bold bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50">Resources</button>
                        <button className="text-xs font-bold bg-emerald-600 px-4 py-2 rounded-lg text-white hover:bg-emerald-700">Next Lesson →</button>
                      </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100">
                          <h3 className="font-bold mb-4 text-slate-800 flex items-center gap-2">📌 Key Takeaways</h3>
                          <ul className="space-y-3">
                              {activeLesson.takeaways.map((t, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex gap-2"><span>•</span> {t}</li>
                              ))}
                          </ul>
                      </div>
                      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                          <h3 className="font-bold mb-4 text-emerald-900 flex items-center gap-2">🛠 Practical Task</h3>
                          <p className="text-sm text-emerald-800 leading-relaxed">{activeLesson.task}</p>
                          <div className="mt-6">
                              <label className="block text-xs font-bold text-emerald-600 mb-2 uppercase">Self Reflection</label>
                              <textarea className="w-full bg-white border border-emerald-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" rows={3} placeholder={activeLesson.reflection}></textarea>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
            {/* Lesson Sidebar */}
            <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 overflow-y-auto h-64 md:h-auto">
                <div className="p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h2 className="font-bold text-sm text-slate-400 uppercase tracking-widest">{selectedCourse.title}</h2>
                    <p className="text-xs text-slate-500 mt-1">5 Lessons • 2h 30m total</p>
                </div>
                <div className="p-2">
                    {selectedCourse.modules.map(mod => (
                      <div key={mod.id} className="mb-4">
                        <p className="text-[10px] font-bold text-slate-400 mb-2 px-3 pt-2 uppercase">{mod.title}</p>
                        <div className="space-y-1">
                            {mod.lessons.map(les => (
                              <div 
                                key={les.id} 
                                onClick={() => {
                                    setActiveLesson(les);
                                    if(window.innerWidth < 768) {
                                        window.scrollTo(0, 0);
                                    }
                                }} 
                                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${activeLesson.id === les.id ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}
                              >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 ${activeLesson.id === les.id ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                                    {activeLesson.id === les.id ? '▶' : '•'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm leading-tight">{les.title}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{les.duration}</p>
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
      <div className="mt-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Community</h1>
        <p className="text-slate-500 mb-8">Discuss classroom challenges with fellow teachers.</p>
        <div className="space-y-4 sm:space-y-6">
           {MOCK_DISCUSSIONS.map(disc => (
             <div key={disc.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition group cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{disc.author[0]}</div>
                    <div className="text-xs">
                        <p className="font-bold text-slate-800">{disc.author}</p>
                        <p className="text-slate-400">{disc.timestamp} • {disc.category}</p>
                    </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-emerald-600 transition">{disc.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 line-clamp-2">{disc.content}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">💬 {disc.replies} Replies</span>
                    <span className="text-emerald-600">Reply →</span>
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
      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-12 mt-6 text-center shadow-sm">
         <div className="relative inline-block mb-6">
            <img src={user?.avatar} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto border-4 border-emerald-500 shadow-xl" alt="User" />
            <div className="absolute bottom-1 right-1 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-600 border-4 border-white rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
         </div>
         <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{user?.name}</h1>
         <p className="text-slate-500 text-sm sm:text-base mb-2">{user?.email}</p>
         <div className="flex justify-center gap-2 mt-2">
             <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{user?.subject}</span>
             <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{user?.experience} Exp</span>
         </div>
         <div className="grid grid-cols-2 gap-4 mt-10 max-w-sm mx-auto">
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <p className="text-2xl font-bold text-emerald-600">1</p>
                 <p className="text-[10px] text-slate-400 uppercase font-bold">In Progress</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <p className="text-2xl font-bold text-slate-300">0</p>
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Certificates</p>
             </div>
         </div>
         <button onClick={handleLogout} className="mt-12 text-red-500 font-bold hover:bg-red-50 px-6 py-2 rounded-xl transition text-sm">Logout Session</button>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <GlobalBackButton />
      <div className="mt-10 sm:mt-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-3xl sm:text-4xl mb-6 sm:mb-8 mx-auto shadow-xl">👋</div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">Get in Touch</h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm sm:text-base">We're here to support your professional growth as an educator.</p>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 bg-emerald-50 px-6 sm:px-8 py-4 rounded-2xl border border-emerald-100 shadow-sm inline-block">Connect TSK</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {showPinModal && <PinEntryModal />}
      <main className="flex-1 transition-all duration-300">
        {currentPage === 'portal' && renderPortal()}
        {currentPage === 'home' && renderHome()}
        {currentPage === 'courses' && renderCourses()}
        {currentPage === 'course-detail' && renderCourseDetail()}
        {currentPage === 'business-plan' && <div className="py-8 sm:py-12"><GlobalBackButton /><BusinessPlan /></div>}
        {currentPage === 'contact' && renderContact()}
        {currentPage === 'login' && renderLogin()}
        {currentPage === 'dashboard' && isLoggedIn && renderDashboard()}
        {currentPage === 'player' && isLoggedIn && renderPlayer()}
        {currentPage === 'community' && isLoggedIn && renderCommunity()}
        {currentPage === 'profile' && isLoggedIn && renderProfile()}
      </main>
      <footer className="bg-white border-t border-slate-100 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
           <div className="flex items-center cursor-pointer" onClick={() => { setCurrentPage('portal'); window.scrollTo(0, 0); }}>
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-2">E</div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">EduElevate</span>
           </div>
           <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-slate-500 font-medium">
              <button onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }} className="hover:text-emerald-600 transition">About</button>
              <button onClick={() => { setCurrentPage('contact'); window.scrollTo(0, 0); }} className="hover:text-emerald-600 transition">Contact</button>
              <button className="hover:text-emerald-600 transition">Privacy</button>
           </div>
           <p className="text-[10px] sm:text-xs text-slate-400 text-center md:text-right">© 2024 EduElevate Platform.<br className="md:hidden" /> Built for Teachers, by Educators.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
