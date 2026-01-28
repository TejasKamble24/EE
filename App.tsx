
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BusinessPlan } from './components/BusinessPlan';
import { MOCK_COURSES, MOCK_DISCUSSIONS, TEACH_WITH_TECH_COURSE } from './constants';
import { Course, CourseLevel, User, Module, Lesson } from './types';
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

  // Authentication Mock
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
  };

  const startLearning = (course: Course) => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    setSelectedCourse(course);
    // Auto-select first lesson
    if (course.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(course.modules[0].lessons[0]);
    }
    setCurrentPage('player');
  };

  const handleAskAI = async (prompt: string) => {
    setIsAiLoading(true);
    const advice = await getTeachingAdvice(prompt);
    setAiResponse(advice || "");
    setIsAiLoading(false);
  };

  // PIN Handling
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

  const BackButton = () => (
    <div className="max-w-7xl mx-auto px-6 pt-6">
      <button 
        onClick={() => {
            setShowPinModal(false);
            setCurrentPage('portal');
        }}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold transition group"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
        Back to Portal
      </button>
    </div>
  );

  const PinModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] p-10 shadow-2xl max-w-sm w-full mx-6 transform transition-all scale-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-slate-900">Protected Access</h3>
          <p className="text-slate-500 mt-2">Enter the 4-digit PIN to continue to {pinTarget === 'home' ? 'Teacher Platform' : 'Business Roadmap'}.</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-12 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                pinError ? 'border-red-500 bg-red-50 text-red-600 animate-shake' : 
                pinInput.length > i ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              {pinInput.length > i ? '•' : ''}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((key) => (
            <button
              key={key.toString()}
              onClick={() => {
                if (key === 'C') setPinInput('');
                else if (key === '←') setPinInput(prev => prev.slice(0, -1));
                else handlePinInput(key.toString());
              }}
              className="h-14 rounded-xl font-bold text-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-md active:scale-95 transition-all text-slate-700"
            >
              {key}
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            setShowPinModal(false);
            setCurrentPage('portal');
          }}
          className="w-full mt-6 text-emerald-600 font-bold hover:text-emerald-700 transition flex items-center justify-center gap-2"
        >
          <span>←</span> Back to Portal
        </button>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );

  // Views
  const renderPortal = () => (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-12">
      <div className="text-center mb-16 max-w-2xl">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl">E</div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">EduElevate Ecosystem</h1>
        <p className="text-xl text-slate-600">Select your destination to explore our professional educator platform or deep dive into our business strategy.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Course Platform Path */}
        <div 
          onClick={() => triggerPinCheck('home')}
          className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">🎓</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">I am a Teacher</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">Upgrade your skills, earn certifications, and join the global educator community.</p>
          <button className="mt-auto bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-lg transition transform group-hover:-translate-y-1">
            Explore Courses
          </button>
        </div>

        {/* Business Path */}
        <div 
          onClick={() => triggerPinCheck('business-plan')}
          className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-slate-200 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">💼</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">For Stakeholders</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">View our problem statement, 3-year revenue plan, and long-term business vision.</p>
          <button className="mt-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-black shadow-lg transition transform group-hover:-translate-y-1">
            Explore Business Opportunities
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-20 pb-20">
      <BackButton />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-white pt-12 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Upgrade Your Teaching Skills.<br/>
            <span className="text-emerald-600">Teach with Confidence.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Practical, bite-sized courses designed for the modern educator. Join 50,000+ teachers transforming their classrooms today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setCurrentPage('login')} className="bg-emerald-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 shadow-lg transition transform hover:-translate-y-1">Start Free</button>
            <button onClick={() => setCurrentPage('courses')} className="bg-white text-slate-700 border-2 border-slate-200 px-10 py-4 rounded-full text-lg font-semibold hover:bg-slate-50 transition">Explore Courses</button>
          </div>
        </div>
      </section>

      {/* Featured Free Course */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Featured Free Course</span>
            <h2 className="text-3xl font-bold text-white mt-4 mb-4">Teach with Tech</h2>
            <p className="text-slate-300 mb-6 text-lg">Master the essential digital tools to create an engaging classroom environment in just 2.5 hours.</p>
            <div className="flex items-center gap-6 text-slate-400 mb-8">
              <span className="flex items-center gap-2">⏱ 2.5 Hours</span>
              <span className="flex items-center gap-2">🎓 Beginner</span>
              <span className="flex items-center gap-2">📜 Certificate Included</span>
            </div>
            <button onClick={() => handleCourseClick(TEACH_WITH_TECH_COURSE)} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition">Enroll Now</button>
          </div>
          <div className="flex-1 w-full h-64 bg-slate-800 rounded-2xl overflow-hidden relative">
             <img src="https://picsum.photos/seed/tech/800/600" className="w-full h-full object-cover opacity-70" alt="Tech" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 transition">▶</div>
             </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        {[
          { title: "Practical Learning", desc: "Classroom-ready tasks in every lesson.", icon: "🛠" },
          { title: "Self-Paced", desc: "Learn whenever you have a 15-minute break.", icon: "⏱" },
          { title: "Certifications", desc: "Shareable certificates for your professional CV.", icon: "📜" },
          { title: "Teacher-Led", desc: "Courses created by expert educators.", icon: "👩‍🏫" }
        ].map((b, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-md transition">
            <div className="text-4xl mb-4">{b.icon}</div>
            <h3 className="font-bold text-lg mb-2">{b.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* How it Works */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How it Works</h2>
          <div className="flex flex-col md:flex-row justify-between gap-12 relative">
             {[
               { n: "1", t: "Sign Up", d: "Create your teacher profile" },
               { n: "2", t: "Learn", d: "Bite-sized video lessons" },
               { n: "3", t: "Practice", d: "Practical classroom tasks" },
               { n: "4", t: "Get Certified", d: "Download your certificate" }
             ].map((s, i) => (
               <div key={i} className="flex-1 relative z-10">
                 <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.n}</div>
                 <h4 className="font-bold text-lg mb-2">{s.t}</h4>
                 <p className="text-slate-500 text-sm">{s.d}</p>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderCourses = () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <BackButton />
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 mt-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Explore Courses</h1>
            <p className="text-slate-500">Pick a skill and start upgrading today.</p>
          </div>
          {!isLoggedIn && (
            <button 
              onClick={() => setCurrentPage('login')} 
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg h-fit"
            >
              Start Free
            </button>
          )}
        </div>
        <div className="flex gap-4">
           <select className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
             <option>All Categories</option>
             <option>EdTech</option>
             <option>Pedagogy</option>
             <option>Soft Skills</option>
           </select>
           <select className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
             <option>Price: All</option>
             <option>Free</option>
             <option>Paid</option>
           </select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {MOCK_COURSES.map(course => (
          <div 
            key={course.id} 
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition group cursor-pointer"
            onClick={() => handleCourseClick(course)}
          >
            <div className="h-48 bg-slate-100 relative">
              <img src={`https://picsum.photos/seed/${course.id}/600/400`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={course.title} />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-800">{course.level}</span>
              <span className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">{course.price === 'Free' ? 'Free' : `$${course.price}`}</span>
            </div>
            <div className="p-6">
              <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">{course.category}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3 leading-tight group-hover:text-emerald-600 transition">{course.title}</h3>
              <div className="flex items-center justify-between text-slate-400 text-sm">
                 <span className="flex items-center gap-1">⏱ {course.duration}</span>
                 <span className="text-emerald-600 font-semibold group-hover:underline">View Details →</span>
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
        <BackButton />
        <div className="bg-slate-900 py-16 text-white mt-6">
          <div className="max-w-7xl mx-auto px-6">
            <button onClick={() => setCurrentPage('courses')} className="text-slate-400 hover:text-white mb-8">← Back to Courses</button>
            <div className="flex flex-col md:flex-row gap-12">
               <div className="flex-[2]">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">{selectedCourse.title}</h1>
                  <p className="text-xl text-slate-300 mb-8">{selectedCourse.description}</p>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex flex-col"><span className="text-slate-500 uppercase font-bold text-[10px] tracking-widest">Level</span><span className="font-semibold">{selectedCourse.level}</span></div>
                    <div className="flex flex-col"><span className="text-slate-500 uppercase font-bold text-[10px] tracking-widest">Duration</span><span className="font-semibold">{selectedCourse.duration}</span></div>
                    <div className="flex flex-col"><span className="text-slate-500 uppercase font-bold text-[10px] tracking-widest">Price</span><span className="font-semibold">{selectedCourse.price === 'Free' ? 'Free' : `$${selectedCourse.price}`}</span></div>
                  </div>
               </div>
               <div className="flex-1">
                 <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-2xl">
                    <img src={`https://picsum.photos/seed/${selectedCourse.id}/400/250`} className="w-full h-40 object-cover rounded-xl mb-6" alt="Preview" />
                    <button 
                        onClick={() => startLearning(selectedCourse)} 
                        className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg mb-4"
                    >
                      Enroll Now
                    </button>
                    <p className="text-center text-xs text-slate-400">7-Day Money Back Guarantee</p>
                    <div className="mt-8 border-t pt-6">
                       <h4 className="font-bold mb-4">What's included:</h4>
                       <ul className="space-y-3 text-sm text-slate-600">
                          <li className="flex items-center gap-2">✅ Full lifetime access</li>
                          <li className="flex items-center gap-2">✅ Access on mobile and TV</li>
                          <li className="flex items-center gap-2">✅ Certificate of completion</li>
                          <li className="flex items-center gap-2">✅ Downloadable resources</li>
                       </ul>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-20">
           <div className="grid md:grid-cols-3 gap-16">
              <div className="md:col-span-2 space-y-12">
                 <section>
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">Learning Outcomes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {selectedCourse.outcomes.map((out, i) => (
                         <div key={i} className="flex gap-3 text-slate-600">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{out}</span>
                         </div>
                       ))}
                    </div>
                 </section>

                 <section>
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">Curriculum</h2>
                    <div className="space-y-4">
                       {selectedCourse.modules.map((mod, i) => (
                         <div key={mod.id} className="border border-slate-100 rounded-xl overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 flex justify-between items-center font-bold text-slate-800">
                               <span>Module {i+1}: {mod.title}</span>
                               <span className="text-xs text-slate-400">{mod.lessons.length} Lesson(s)</span>
                            </div>
                            <div className="p-4 space-y-2">
                               {mod.lessons.map(les => (
                                 <div key={les.id} className="flex items-center justify-between text-sm text-slate-500 hover:text-emerald-600 cursor-pointer p-2 rounded hover:bg-emerald-50 transition">
                                    <div className="flex items-center gap-3">
                                       <span className="text-emerald-600 text-lg">▶</span>
                                       <span>{les.title}</span>
                                    </div>
                                    <span>{les.duration}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                       ))}
                       {selectedCourse.modules.length === 0 && <p className="text-slate-400 italic">Curriculum details coming soon.</p>}
                    </div>
                 </section>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Instructor</h2>
                <div className="flex items-center gap-4 mb-4">
                   <img src={selectedCourse.instructor.avatar} className="w-16 h-16 rounded-full" alt={selectedCourse.instructor.name} />
                   <div>
                      <h4 className="font-bold">{selectedCourse.instructor.name}</h4>
                      <p className="text-slate-500 text-sm">{selectedCourse.instructor.role}</p>
                   </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">"Passionate about empowering the next generation of educators through technology and modern pedagogy."</p>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderLogin = () => (
    <div className="min-h-[80vh] flex flex-col bg-slate-50">
      <BackButton />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500">Sign in to continue your teaching journey.</p>
          </div>
          <div className="space-y-4">
              <button onClick={handleLogin} className="w-full flex items-center justify-center gap-4 border border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition">
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                <span className="font-semibold text-slate-700">Continue with Google</span>
              </button>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-slate-400 text-sm">or email</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
              <div className="space-y-4">
                <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500" />
                <button onClick={handleLogin} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">Login with OTP</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <BackButton />
      <div className="mb-12 mt-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Hello, {user?.name} 👋</h1>
        <p className="text-slate-500">You're making great progress! Keep going.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8 mb-16">
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">In Progress</p>
            <h4 className="text-3xl font-bold">1 Course</h4>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Completed</p>
            <h4 className="text-3xl font-bold">0</h4>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Certificates</p>
            <h4 className="text-3xl font-bold">0</h4>
         </div>
         <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-emerald-200 shadow-xl">
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">Learning Streak</p>
            <h4 className="text-3xl font-bold">3 Days 🔥</h4>
         </div>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
         <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center">
               <img src="https://picsum.photos/seed/c1/300/200" className="w-full md:w-48 h-32 rounded-xl object-cover" alt="Teach with Tech" />
               <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Teach with Tech</h3>
                  <div className="w-full h-2 bg-slate-100 rounded-full mb-4 overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: '20%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-500">20% Complete</span>
                     <button onClick={() => startLearning(TEACH_WITH_TECH_COURSE)} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition">Resume</button>
                  </div>
               </div>
            </div>

            <h2 className="text-2xl font-bold mt-16 mb-6">Recommended for You</h2>
            <div className="grid md:grid-cols-2 gap-6">
               {MOCK_COURSES.filter(c => c.id !== 'c1').map(course => (
                 <div key={course.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer" onClick={() => handleCourseClick(course)}>
                    <img src={`https://picsum.photos/seed/${course.id}/600/400`} className="w-full h-32 object-cover" alt={course.title} />
                    <div className="p-4">
                       <h4 className="font-bold text-slate-900 line-clamp-1">{course.title}</h4>
                       <p className="text-xs text-slate-500 mt-1">{course.duration} • {course.level}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div>
            <h2 className="text-2xl font-bold mb-6">Teaching Community</h2>
            <div className="space-y-4">
               {MOCK_DISCUSSIONS.map(disc => (
                 <div key={disc.id} className="bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                    <h5 className="font-bold text-sm mb-1 leading-tight">{disc.title}</h5>
                    <p className="text-xs text-slate-500 mb-2">{disc.author} • {disc.timestamp}</p>
                    <div className="flex justify-between items-center">
                       <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">{disc.category}</span>
                       <span className="text-[10px] font-bold text-emerald-600">{disc.replies} replies</span>
                    </div>
                 </div>
               ))}
               <button onClick={() => setCurrentPage('community')} className="w-full text-emerald-600 font-bold text-sm py-3 border-2 border-emerald-50 rounded-xl hover:bg-emerald-50 transition">Join Discussions</button>
            </div>
         </div>
      </div>
    </div>
  );

  const renderPlayer = () => {
    if (!selectedCourse || !activeLesson) return null;
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        <div className="bg-white border-b border-slate-100">
            <BackButton />
        </div>
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative">
                    <video src={activeLesson.videoUrl} controls className="w-full h-full" poster={`https://picsum.photos/seed/${activeLesson.id}/1280/720`} />
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">{activeLesson.title}</h1>
                        <div className="prose-calm">
                        <h3 className="text-lg font-bold mb-3 text-emerald-700">Key Takeaways</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-8">
                            {activeLesson.takeaways.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                        
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-8">
                            <h3 className="text-lg font-bold mb-2 text-emerald-800">Practical Classroom Task</h3>
                            <p className="text-emerald-700">{activeLesson.task}</p>
                        </div>

                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                            <h3 className="text-lg font-bold mb-2 text-amber-800">Reflection Question</h3>
                            <p className="text-amber-700 italic">{activeLesson.reflection}</p>
                            <textarea className="w-full mt-4 p-4 rounded-xl border border-amber-200 outline-none focus:ring-2 focus:ring-amber-400 min-h-[100px]" placeholder="Type your reflection here..."></textarea>
                        </div>
                        </div>
                    </div>

                    {/* AI Teaching Assistant */}
                    <div className="w-full md:w-80 space-y-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
                            <h4 className="font-bold">Teaching Coach</h4>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">Ask me anything about this lesson or your classroom challenges.</p>
                        <input 
                            onKeyDown={(e) => e.key === 'Enter' && handleAskAI((e.target as HTMLInputElement).value)}
                            type="text" 
                            placeholder="e.g. How do I adapt this for grade 3?" 
                            className="w-full px-4 py-2 text-sm rounded-lg border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 mb-4" 
                        />
                        {isAiLoading && <div className="text-center py-2"><span className="animate-pulse text-xs text-emerald-600 font-bold">Thinking...</span></div>}
                        {aiResponse && (
                            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed border border-slate-100">
                                {aiResponse}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-80 bg-white border-l border-slate-100 overflow-y-auto">
            <div className="p-6 border-b">
                <h2 className="font-bold text-lg mb-1">{selectedCourse.title}</h2>
                <p className="text-xs text-slate-400">Your progress: 20%</p>
            </div>
            <div className="p-2">
                {selectedCourse.modules.map((mod, mi) => (
                    <div key={mod.id} className="mb-2">
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400">Module {mi+1}: {mod.title}</div>
                    {mod.lessons.map(les => (
                        <div 
                            key={les.id} 
                            onClick={() => setActiveLesson(les)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${activeLesson.id === les.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${activeLesson.id === les.id ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200'}`}>
                            {activeLesson.id === les.id ? '▶' : '✓'}
                            </div>
                            <span className="text-sm line-clamp-1">{les.title}</span>
                        </div>
                    ))}
                    </div>
                ))}
            </div>
            </div>
        </div>
      </div>
    );
  };

  const renderCommunity = () => (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <BackButton />
      <div className="flex justify-between items-center mb-12 mt-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Teacher Community</h1>
          <p className="text-slate-500">Connect, share, and solve classroom challenges together.</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg">+ New Post</button>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
         {['All Topics', 'Classroom Challenges', 'Subject-specific', 'Teaching Tips', 'EdTech Help'].map(cat => (
           <button key={cat} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition ${cat === 'All Topics' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {cat}
           </button>
         ))}
      </div>

      <div className="space-y-6">
         {MOCK_DISCUSSIONS.map(disc => (
           <div key={disc.id} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/${disc.id}/100/100`} className="w-10 h-10 rounded-full" alt={disc.author} />
                    <div>
                       <h5 className="font-bold text-slate-800">{disc.author}</h5>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{disc.role}</p>
                    </div>
                 </div>
                 <span className="text-xs text-slate-400">{disc.timestamp}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition">{disc.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{disc.content}</p>
              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                 <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{disc.category}</span>
                 <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <span className="flex items-center gap-1">💬 {disc.replies} Replies</span>
                    <span className="flex items-center gap-1">👍 24 Likes</span>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <BackButton />
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm mt-6">
         <div className="h-32 bg-emerald-600 relative">
            <div className="absolute -bottom-12 left-12">
               <img src={user?.avatar} className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg" alt="Profile" />
            </div>
         </div>
         <div className="pt-16 px-12 pb-12">
            <div className="flex justify-between items-start mb-12">
               <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">{user?.name}</h1>
                  <p className="text-slate-500">{user?.subject} Teacher • {user?.experience}</p>
               </div>
               <button className="border-2 border-slate-100 px-6 py-2 rounded-xl font-bold hover:bg-slate-50 transition">Edit Profile</button>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
               <div>
                  <h3 className="font-bold text-lg mb-4">Account Settings</h3>
                  <div className="space-y-4">
                     <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600">Email Notifications</span>
                        <div className="w-10 h-6 bg-emerald-500 rounded-full relative"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div></div>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600">Mobile Alerts</span>
                        <div className="w-10 h-6 bg-slate-200 rounded-full relative"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div></div>
                     </div>
                  </div>
               </div>
               <div>
                  <h3 className="font-bold text-lg mb-4">My Subscription</h3>
                  <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl">
                     <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">Free Plan</h4>
                     <p className="text-sm text-slate-300 mb-6">Upgrade to EduElevate Pro to unlock premium courses and advanced certifications.</p>
                     <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">Upgrade to Pro</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <BackButton />
      <div className="mt-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-4xl mb-8 mx-auto shadow-xl">👋</div>
        <h1 className="text-5xl font-bold text-slate-900 mb-6">Get in Touch</h1>
        <div className="text-3xl font-extrabold text-emerald-600 bg-emerald-50 px-8 py-4 rounded-2xl border border-emerald-100 shadow-sm inline-block">
          Connect TSK
        </div>
        <p className="text-slate-500 mt-8 max-w-md mx-auto leading-relaxed">
          Have questions or need support with your professional development journey? Our team is here to help you succeed.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
      />
      
      {showPinModal && <PinModal />}

      <main className="transition-all duration-300">
        {currentPage === 'portal' && renderPortal()}
        {currentPage === 'home' && renderHome()}
        {currentPage === 'courses' && renderCourses()}
        {currentPage === 'course-detail' && renderCourseDetail()}
        {currentPage === 'business-plan' && (
          <div className="py-12">
            <BackButton />
            <BusinessPlan />
          </div>
        )}
        {currentPage === 'contact' && renderContact()}
        {currentPage === 'login' && renderLogin()}
        {currentPage === 'dashboard' && isLoggedIn && renderDashboard()}
        {currentPage === 'player' && isLoggedIn && renderPlayer()}
        {currentPage === 'community' && isLoggedIn && renderCommunity()}
        {currentPage === 'profile' && isLoggedIn && renderProfile()}
      </main>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('portal')}>
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-2">E</div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">EduElevate</span>
           </div>
           
           <div className="flex gap-8 text-sm text-slate-500">
              <button 
                onClick={() => setCurrentPage('contact')} 
                className="hover:text-emerald-600 transition font-medium"
              >
                Contact
              </button>
           </div>

           <p className="text-xs text-slate-400">© 2024 EduElevate Platform. Built for Teachers, by Educators.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
