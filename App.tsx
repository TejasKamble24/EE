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
  const [aiInput, setAiInput] = useState("");
  
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

  // AI Advice Handler
  const handleAiAdvice = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiResponse("");
    const advice = await getTeachingAdvice(aiInput);
    setAiResponse(advice);
    setIsAiLoading(false);
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
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Access Restricted</h3>
          <p className="text-slate-500 mt-2 text-xs sm:text-sm leading-relaxed">Please enter the access PIN to continue to the {pinTarget === 'home' ? 'Educator Site' : 'Business Roadmap'}.</p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
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
              className="h-12 sm:h-14 rounded-xl font-bold text-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all text-slate-700 active:scale-95"
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
      <div className="text-center mb-10 sm:mb-16 max-w-2xl">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl mx-auto mb-6 shadow-xl">E</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">EduElevate Platform</h1>
        <p className="text-sm sm:text-lg text-slate-600 px-4">The dedicated professional learning ecosystem for modern educators.</p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 w-full max-w-5xl px-2">
        <div 
          onClick={() => triggerPinCheck('home')}
          className="group bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all cursor-pointer flex flex-col items-center text-center"
        >
          <div className="text-5xl sm:text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🎓</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">I am a Teacher</h2>
          <p className="text-xs sm:text-base text-slate-500 mb-8 max-w-[280px]">Upgrade skills, earn certificates, and join the global teacher community.</p>
          <button className="mt-auto w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-emerald-700 shadow-lg transition">
            Explore Learning
          </button>
        </div>

        <div 
          onClick={() => triggerPinCheck('business-plan')}
          className="group bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all cursor-pointer flex flex-col items-center text-center"
        >
          <div className="text-5xl sm:text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📈</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Stakeholders</h2>
          <p className="text-xs sm:text-base text-slate-500 mb-8 max-w-[280px]">View the mission, revenue model, and 3-year growth strategy.</p>
          <button className="mt-auto w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-black shadow-lg transition">
            Strategy Hub
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-12 sm:space-y-24 pb-20">
      <GlobalBackButton />
      <section className="bg-gradient-to-br from-emerald-50 to-white pt-8 pb-20 sm:pt-16 sm:pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-[1.1]">
            Upgrade Your Teaching.<br/>
            <span className="text-emerald-600">Teach with Confidence.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Practical classroom-ready skills designed for busy educators. Join 50,000+ teachers transforming their careers today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
            <button onClick={() => setCurrentPage('login')} className="bg-emerald-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-emerald-700 shadow-xl transition transform hover:-translate-y-1">Start Free</button>
            <button onClick={() => setCurrentPage('courses')} className="bg-white text-slate-700 border-2 border-slate-200 px-10 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition">Browse Courses</button>
          </div>
        </div>
      </section>
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-20 overflow-hidden">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6">Popular & Free</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Teach with Tech</h2>
            <p className="text-slate-300 mb-10 text-base sm:text-lg leading-relaxed">Master digital tools to create engaging classrooms. Start your journey with our foundational 2.5-hour certificate course.</p>
            <button onClick={() => handleCourseClick(TEACH_WITH_TECH_COURSE)} className="w-full sm:w-auto bg-white text-slate-900 px-10 py-4 rounded-2xl font-extrabold hover:bg-emerald-50 transition shadow-2xl text-lg">Enroll Now</button>
          </div>
          <div className="flex-1 w-full aspect-video sm:aspect-auto sm:h-[400px] bg-slate-800 rounded-3xl overflow-hidden relative shadow-2xl group">
             <img src="https://picsum.photos/seed/tech/1000/800" className="w-full h-full object-cover opacity-50 transition duration-700 group-hover:scale-105" alt="Technology in Classroom" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-110 transition active:scale-95">
                  <span className="text-xl sm:text-2xl">▶</span>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderCourses = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <GlobalBackButton />
      <div className="mb-12 mt-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Explore Courses</h1>
        <p className="text-slate-500 text-base sm:text-lg">Professional upskilling tailored for every educator level.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
        {MOCK_COURSES.map(course => (
          <div key={course.id} onClick={() => handleCourseClick(course)} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer flex flex-col h-full">
            <div className="h-48 sm:h-56 bg-slate-100 relative overflow-hidden">
              <img src={`https://picsum.photos/seed/${course.id}/800/600`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={course.title} />
              <div className="absolute top-4 right-4 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">{course.price === 'Free' ? 'Free' : `$${course.price}`}</div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">{course.category}</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition leading-snug">{course.title}</h3>
              <div className="mt-auto flex items-center justify-between text-slate-400 text-sm font-medium">
                 <span className="flex items-center gap-2">⏱ {course.duration}</span>
                 <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">Learn More →</span>
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
      <div className="bg-white min-h-screen pb-20">
        <GlobalBackButton />
        <div className="bg-slate-900 py-12 sm:py-24 text-white mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
               <div className="flex-[3]">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-8 leading-[1.1]">{selectedCourse.title}</h1>
                  <p className="text-lg sm:text-2xl text-slate-300 mb-10 leading-relaxed font-light">{selectedCourse.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white/10 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10">{selectedCourse.level}</div>
                    <div className="bg-white/10 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10">{selectedCourse.duration}</div>
                  </div>
               </div>
               <div className="flex-[2] w-full">
                 <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 text-slate-900 shadow-2xl relative">
                    <div className="h-48 sm:h-64 bg-slate-100 rounded-3xl mb-8 overflow-hidden shadow-inner">
                        <img src={`https://picsum.photos/seed/${selectedCourse.id}/600/400`} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                    <button onClick={() => startLearning(selectedCourse)} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl text-lg transform hover:-translate-y-0.5 active:translate-y-0">Enroll Now</button>
                    <div className="mt-8 space-y-4 text-sm sm:text-base text-slate-500 font-medium">
                        <p className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Full lifetime access</p>
                        <p className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Verifiable certificate</p>
                        <p className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Peer discussion support</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLogin = () => (
    <div className="min-h-[85vh] flex flex-col bg-slate-50 px-4">
      <GlobalBackButton />
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Teacher Access</h2>
              <p className="text-slate-500 font-medium">Join our community of professional educators.</p>
          </div>
          <div className="space-y-4">
              <button onClick={handleLogin} className="w-full bg-white border-2 border-slate-100 text-slate-800 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:border-emerald-200 transition shadow-sm flex items-center justify-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-xs">G</span> Continue with Google
              </button>
              <button onClick={handleLogin} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg">Login with OTP</button>
          </div>
          <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-10 leading-relaxed font-medium">
            Protected by professional data standards.<br/>Only verified educators can access full course materials.
          </p>
        </div>
      </div>
    </div>
  );

  // Fix: Implemented renderDashboard
  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-slate-100 mb-12 flex flex-col sm:flex-row items-center gap-8">
        <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-full border-4 border-emerald-50 shadow-lg" />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-slate-500 font-medium">{user?.subject} Teacher • {user?.experience} Experience</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 px-2">Your Progress</h2>
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">{TEACH_WITH_TECH_COURSE.title}</h3>
              <span className="text-emerald-600 font-bold">20%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }}></div>
            </div>
            <button 
              onClick={() => startLearning(TEACH_WITH_TECH_COURSE)}
              className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
            >
              Continue Learning
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 px-2 pt-4">Explore New Skills</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {MOCK_COURSES.slice(1).map(c => (
              <div key={c.id} onClick={() => handleCourseClick(c)} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition cursor-pointer">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-2">{c.category}</span>
                <h4 className="font-bold text-slate-900 mb-4">{c.title}</h4>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>⏱ {c.duration}</span>
                  <span className="text-emerald-600 font-bold">View →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">AI Teaching Coach</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Ask anything about classroom management, lesson planning, or tech tools.</p>
              <textarea 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g., How do I keep my students engaged during a long science lecture?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition mb-4 min-h-[100px]"
              />
              <button 
                onClick={handleAiAdvice}
                disabled={isAiLoading}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isAiLoading ? "Consulting Coach..." : "Get Advice"}
              </button>
              
              {aiResponse && (
                <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl text-sm leading-relaxed animate-in fade-in slide-in-from-top-4">
                  <span className="text-emerald-500 font-bold block mb-2">Coach Advice:</span>
                  <p className="text-slate-300">{aiResponse}</p>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Fix: Implemented renderPlayer
  const renderPlayer = () => {
    if (!selectedCourse || !activeLesson) return null;
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-[3]">
            <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl mb-8 border-4 border-white">
              <video 
                key={activeLesson.videoUrl} 
                controls 
                className="w-full h-full"
                autoPlay
              >
                <source src={activeLesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="bg-white rounded-[2rem] p-8 sm:p-12 border border-slate-100 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">{activeLesson.title}</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <section>
                  <h3 className="font-bold text-emerald-600 mb-4 uppercase tracking-widest text-xs">Lesson Takeaways</h3>
                  <ul className="space-y-3">
                    {activeLesson.takeaways.map((t, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 text-sm">
                        <span className="text-emerald-500 font-bold">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-bold text-emerald-600 mb-4 uppercase tracking-widest text-xs">Hands-on Task</h3>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-emerald-800 text-sm italic shadow-inner">
                    "{activeLesson.task}"
                  </div>
                </section>
              </div>
              <div className="mt-12 pt-8 border-t border-slate-50">
                 <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">Quick Reflection</h3>
                 <p className="text-slate-500 text-sm leading-relaxed">{activeLesson.reflection}</p>
              </div>
            </div>
          </div>

          <div className="flex-[1] space-y-6">
            <h3 className="text-xl font-bold text-slate-900 px-2">Course Modules</h3>
            <div className="space-y-4">
              {selectedCourse.modules.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 text-sm">{m.title}</div>
                  <div className="p-2 space-y-1">
                    {m.lessons.map(l => (
                      <button 
                        key={l.id} 
                        onClick={() => setActiveLesson(l)}
                        className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center gap-3 ${
                          activeLesson.id === l.id ? 'bg-emerald-600 text-white font-bold shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeLesson.id === l.id ? 'bg-white/20' : 'bg-slate-100'}`}>▶</span>
                        <span className="flex-1 truncate">{l.title}</span>
                      </button>
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

  // Fix: Implemented renderCommunity
  const renderCommunity = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Educator Community</h1>
          <p className="text-slate-500">Connect with peers, share challenges, and grow together.</p>
        </div>
        <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg">Start a Discussion</button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Categories</h3>
              <div className="space-y-2">
                 {['Classroom Challenges', 'Subject-specific', 'Pedagogy Tips', 'Digital Tools', 'Mental Wellness'].map(cat => (
                   <button key={cat} className="block w-full text-left p-3 rounded-xl text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition font-medium">{cat}</button>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {MOCK_DISCUSSIONS.map(post => (
            <div key={post.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition group cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-emerald-600">{post.author[0]}</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{post.author}</h4>
                  <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide">{post.role}</p>
                </div>
                <span className="ml-auto text-xs text-slate-300">{post.timestamp}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition">{post.title}</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">{post.content}</p>
              <div className="flex items-center justify-between border-t pt-6">
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{post.category}</span>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <span className="flex items-center gap-1.5 hover:text-emerald-500 transition">💬 {post.replies} Replies</span>
                  <span className="hover:text-emerald-500 transition">▲ 24 Votes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Fix: Implemented renderProfile
  const renderProfile = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="h-48 bg-emerald-600 relative">
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
             <img src={user?.avatar} alt={user?.name} className="w-32 h-32 rounded-[2rem] border-8 border-white shadow-xl" />
          </div>
        </div>
        <div className="pt-24 pb-16 px-8 sm:px-16 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{user?.name}</h1>
          <p className="text-slate-500 font-medium mb-8">{user?.subject} Educator • Verified Professional</p>
          
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-2xl font-bold text-emerald-600">1</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Ongoing</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-2xl font-bold text-emerald-600">0</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Completed</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-2xl font-bold text-emerald-600">3h</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Learned</span>
            </div>
          </div>

          <div className="space-y-6 text-left max-w-md mx-auto">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-emerald-500">📧</span>
               <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</label>
                  <p className="text-slate-700 font-medium">{user?.email}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-emerald-500">🏢</span>
               <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expertise</label>
                  <p className="text-slate-700 font-medium">{user?.experience} in {user?.subject}</p>
               </div>
            </div>
          </div>

          <button className="mt-12 w-full max-w-md bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg">
            Edit Professional Profile
          </button>
        </div>
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
        {currentPage === 'business-plan' && <div className="py-6 sm:py-12"><GlobalBackButton /><BusinessPlan /></div>}
        {currentPage === 'login' && renderLogin()}
        {currentPage === 'dashboard' && isLoggedIn && renderDashboard()}
        {currentPage === 'player' && isLoggedIn && renderPlayer()}
        {currentPage === 'community' && isLoggedIn && renderCommunity()}
        {currentPage === 'profile' && isLoggedIn && renderProfile()}
      </main>
      <footer className="bg-white border-t border-slate-100 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex items-center cursor-pointer" onClick={() => { setCurrentPage('portal'); window.scrollTo(0, 0); }}>
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg">E</div>
              <span className="text-3xl font-bold text-slate-900 tracking-tight">EduElevate</span>
           </div>
           <div className="flex flex-wrap justify-center gap-10 text-sm sm:text-base text-slate-500 font-bold">
              <button onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }} className="hover:text-emerald-600 transition">Our Mission</button>
              <button className="hover:text-emerald-600 transition">Compliance</button>
              <button className="hover:text-emerald-600 transition">Support</button>
           </div>
           <p className="text-xs sm:text-sm text-slate-400 text-center md:text-right font-medium">
             © 2024 EduElevate Platform.<br/>Built for the future of global teaching.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;