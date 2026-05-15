import React from 'react';
import { User, Bell, Shield, Moon, Globe, Info, LogOut } from 'lucide-react';

export default function Settings() {
  const sections = [
    {
      title: 'Profile',
      items: [
        { icon: <User size={20} />, label: 'Student Information', value: 'Muzammil' },
        { icon: <Globe size={20} />, label: 'Language', value: 'English (Kannada available)' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell size={20} />, label: 'Daily Reminders', toggle: true, checked: true },
        { icon: <Moon size={20} />, label: 'Dark Mode', toggle: true, checked: false },
      ]
    },
    {
      title: 'Security',
      items: [
        { icon: <Shield size={20} />, label: 'Offline Mode', badge: 'Active' },
      ]
    },
    {
      title: 'About',
      items: [
        { icon: <Info size={20} />, label: 'App Version', value: '1.2.0-beta' },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <section>
        <h2 className="text-2xl font-black text-slate-900 leading-none">Settings</h2>
        <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-wider">Configure your experience</p>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">
            {section.title}
          </h3>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            {section.items.map((item, idx) => (
              <div 
                key={item.label}
                className={`flex items-center justify-between p-4 px-6 ${
                  idx !== section.items.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-500">
                    {item.icon}
                  </div>
                  <span className="font-bold text-slate-700">{item.label}</span>
                </div>
                
                {item.value && (
                  <span className="text-slate-400 font-bold text-sm">{item.value}</span>
                )}
                
                {item.toggle && (
                  <div className={`w-11 h-6 rounded-full p-1 transition-all ${item.checked ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.checked ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                )}

                {item.badge && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <button className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3">
        <LogOut size={20} /> Logout
      </button>
      
      <div className="text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase">Made with ❤️ for SSLC Students</p>
      </div>
    </div>
  );
}
