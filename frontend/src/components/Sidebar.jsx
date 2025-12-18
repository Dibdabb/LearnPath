import React from 'react';
import { AcademicCapIcon, TrophyIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import WolfMascot from './WolfMascot';
import XPBar from './XPBar';

export default function Sidebar({ user }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-4 sticky top-6">
      <div className="flex items-center gap-3">
        <WolfMascot size={72} />
        <div>
          <p className="text-xs uppercase text-amber-200/80">LearnPath</p>
          <p className="font-semibold text-lg">{user?.profile?.displayName || 'Explorer'}</p>
          <p className="text-xs text-slate-400">Streak {user?.streak ?? 0} • Gems {user?.gems ?? 0}</p>
        </div>
      </div>
      <XPBar currentXP={user?.xp || 0} goalXP={(user?.xp || 0) + 100} />
      <nav className="space-y-2">
        <NavItem icon={<AcademicCapIcon className="w-5 h-5" />} label="Learn" active />
        <NavItem icon={<TrophyIcon className="w-5 h-5" />} label="Leagues" />
        <NavItem icon={<UserCircleIcon className="w-5 h-5" />} label="Profile" />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
        active ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40' : 'text-slate-200 border border-transparent'
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
