
import React from 'react';

export const BusinessPlan: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-white shadow-sm rounded-2xl my-12 border border-slate-100">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Business Strategic Roadmap</h1>
        <p className="text-slate-500 max-w-2xl mx-auto italic">"Empowering those who empower the future: A scalable professional development ecosystem for educators."</p>
      </div>
      
      {/* Section 1 & 2 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-red-500">🚩</span> 1. Problem Statement
          </h2>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li className="flex gap-2"><strong>•</strong> <span>Lack of continuous, practical professional development.</span></li>
            <li className="flex gap-2"><strong>•</strong> <span>Affordable upskilling options are virtually non-existent.</span></li>
            <li className="flex gap-2"><strong>•</strong> <span>Low confidence in modern methods & technology.</span></li>
            <li className="flex gap-2"><strong>•</strong> <span>Existing training is one-time and theoretical.</span></li>
          </ul>
        </section>

        <section className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-emerald-600">💡</span> 2. Solution
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">
            A dedicated online learning platform offering short, practical, classroom-ready courses with self-paced + live options.
          </p>
          <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-800 text-center">
            🎯 Entry point: Free course – “Teach with Tech”
          </div>
        </section>
      </div>

      {/* Section 3 & 4 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-2">3. Market & Offering</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-emerald-700 mb-2">Target Market</h3>
            <p className="text-sm text-slate-600 mb-4">Focus on 9 million teachers in India (Classes 1-10). 1% adoption = 90,000 users.</p>
            <h3 className="font-bold text-emerald-700 mb-2">Product Categories</h3>
            <p className="text-xs text-slate-500">Teaching Skills, Pedagogy, Tech for Teachers, Assessment.</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span>Paid Courses</span>
              <span className="font-bold">₹499 – ₹1,999</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span>Subscription</span>
              <span className="font-bold">₹399/month</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span>Certifications</span>
              <span className="font-bold">₹2,999 – ₹5,999</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7 - Revenue Plan */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-2">💰 3-Year Revenue Plan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-slate-100 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">Phase</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">Users (Free/Paid)</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">Projected Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4">
                  <span className="font-bold block">Year 1</span>
                  <span className="text-xs text-slate-500 italic">Validation</span>
                </td>
                <td className="px-6 py-4 text-sm">10k Free / 500 Paid (5%)</td>
                <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹7.8 Lakhs</td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <span className="font-bold block">Year 2</span>
                  <span className="text-xs text-slate-500 italic">Growth</span>
                </td>
                <td className="px-6 py-4 text-sm">50k Free / 3,000 Paid (6%)</td>
                <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹95 Lakhs</td>
              </tr>
              <tr className="bg-emerald-50">
                <td className="px-6 py-4">
                  <span className="font-bold block">Year 3</span>
                  <span className="text-xs text-slate-500 italic">Scale</span>
                </td>
                <td className="px-6 py-4 text-sm">150k Free / 12,000 Paid (8%)</td>
                <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹5.2 Crores</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Strategy Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">Go-To-Market</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Year 1: WhatsApp Groups, Free Webinars.</li>
            <li>• Year 2: Influencer Teachers, School Partnerships.</li>
            <li>• Year 3: B2B School tie-ups, Govt Partnerships.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-slate-900 pl-3">Long-Term Vision</h2>
          <p className="text-sm text-slate-600 italic">"Becoming the global gold standard for teacher certification, creating clear career pathways and train-the-trainer ecosystems."</p>
        </section>
      </div>

      {/* Cost Structure */}
      <section className="bg-slate-900 p-8 rounded-3xl text-white">
        <h2 className="text-xl font-bold mb-4">🧮 Cost Structure</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">Content Creation</div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">Platform Hosting</div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">Marketing</div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">Instructor Payouts</div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">Operations</div>
        </div>
      </section>
    </div>
  );
};
