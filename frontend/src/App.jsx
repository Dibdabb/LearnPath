import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import LearnPath from './components/LearnPath';
import QuestList from './components/QuestList';
import ShopPanel from './components/ShopPanel';
import XPBar from './components/XPBar';
import WolfMascot from './components/WolfMascot';
import './styles/tailwind.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const getStoredTokens = () => {
  const raw = localStorage.getItem('learnpath_tokens');
  return raw ? JSON.parse(raw) : null;
};

const storeTokens = (tokens) => {
  if (tokens) localStorage.setItem('learnpath_tokens', JSON.stringify(tokens));
  else localStorage.removeItem('learnpath_tokens');
};

export default function App() {
  const [tokens, setTokens] = useState(getStoredTokens());
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quests, setQuests] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeBoosts, setActiveBoosts] = useState([]);
  const [message, setMessage] = useState('');
  const isAuthed = Boolean(tokens?.accessToken);

  useEffect(() => {
    if (tokens?.accessToken) {
      hydrateState();
    }
  }, [tokens?.accessToken]);

  async function hydrateState() {
    try {
      const [me, lessonData, questData, shopData, inventoryData, boostData] = await Promise.all([
        apiRequest('/api/auth/me', { token: tokens.accessToken }),
        apiRequest('/api/lessons', { token: tokens.accessToken }),
        apiRequest('/api/quests', { token: tokens.accessToken }),
        apiRequest('/api/shop/items', { token: tokens.accessToken }),
        apiRequest('/api/inventory', { token: tokens.accessToken }),
        apiRequest('/api/boosts/active', { token: tokens.accessToken })
      ]);
      setUser(me.user);
      setLessons(lessonData.lessons);
      setSelectedLesson((prev) => prev || lessonData.lessons[0]);
      setQuests(questData.quests);
      setShopItems(shopData.items);
      setInventory(inventoryData.inventory);
      setActiveBoosts(boostData.boosts);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  async function handleSignup(credentials) {
    try {
      const data = await apiRequest('/api/auth/signup', { method: 'POST', body: credentials });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      storeTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setUser(data.user);
      setMessage('Welcome to LearnPath!');
      await hydrateState();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleLogin(credentials) {
    try {
      const data = await apiRequest('/api/auth/login', { method: 'POST', body: credentials });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      storeTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setUser(data.user);
      setMessage('Logged in');
      await hydrateState();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleCompleteLesson(lessonId) {
    if (!tokens?.accessToken) return;
    try {
      const res = await apiRequest(`/api/lessons/${lessonId}/complete`, { method: 'POST', token: tokens.accessToken });
      setUser(res.user);
      setMessage(`+${res.xpEarned} XP (${res.multiplier}x) +${res.gemEarned} gems`);
      await Promise.all([refreshLessons(), refreshQuests(), refreshBoosts(), refreshInventory()]);
    } catch (err) {
      setMessage(err.message);
    }
  }

  const refreshLessons = async () => {
    if (!tokens?.accessToken) return;
    const data = await apiRequest('/api/lessons', { token: tokens.accessToken });
    setLessons(data.lessons);
  };

  const refreshQuests = async () => {
    if (!tokens?.accessToken) return;
    const data = await apiRequest('/api/quests', { token: tokens.accessToken });
    setQuests(data.quests);
  };

  const refreshInventory = async () => {
    if (!tokens?.accessToken) return;
    const data = await apiRequest('/api/inventory', { token: tokens.accessToken });
    setInventory(data.inventory);
  };

  const refreshBoosts = async () => {
    if (!tokens?.accessToken) return;
    const data = await apiRequest('/api/boosts/active', { token: tokens.accessToken });
    setActiveBoosts(data.boosts);
  };

  async function handleBuy(itemId) {
    try {
      await apiRequest('/api/shop/buy', { method: 'POST', token: tokens.accessToken, body: { itemId } });
      setMessage('Purchased boost');
      const me = await apiRequest('/api/auth/me', { token: tokens.accessToken });
      setUser(me.user);
      await refreshInventory();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleActivate(itemId) {
    try {
      const res = await apiRequest('/api/boosts/activate', {
        method: 'POST',
        token: tokens.accessToken,
        body: { itemId }
      });
      setActiveBoosts(res.boosts);
      await refreshInventory();
      setMessage('Boost activated');
    } catch (err) {
      setMessage(err.message);
    }
  }

  const boostText = useMemo(() => {
    if (!activeBoosts.length) return undefined;
    const top = activeBoosts.reduce((acc, b) => (b.multiplier > acc ? b.multiplier : acc), 1);
    return `${top}x XP boost active`;
  }, [activeBoosts]);

  if (!isAuthed) {
    return <AuthGate onSignup={handleSignup} onLogin={handleLogin} message={message} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <DnaBackdrop />
      <div className="max-w-7xl mx-auto grid md:grid-cols-[260px_1fr_320px] gap-5 p-4 md:p-8 relative">
        <Sidebar user={user} />
        <main className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-amber-200/80">Welcome back</p>
              <h1 className="text-2xl font-bold">{user?.profile?.displayName || 'Learner'}</h1>
              <p className="text-sm text-slate-300">Streak {user?.streak ?? 0} • Gems {user?.gems ?? 0} • Weekly XP {user?.weeklyXp?.xp ?? 0}</p>
              {message && <p className="text-xs text-emerald-300 mt-1">{message}</p>}
            </div>
            <WolfMascot size={96} />
          </div>
          <XPBar currentXP={user?.xp || 0} goalXP={(user?.xp || 0) + 100} boostText={boostText} />
          <LearnPath lessons={lessons} onSelect={setSelectedLesson} selectedLessonId={selectedLesson?.id} />
          {selectedLesson && (
            <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-amber-200/80">Lesson</p>
                  <h2 className="text-xl font-semibold">{selectedLesson.title}</h2>
                  <p className="text-sm text-slate-300">{selectedLesson.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-amber-300">{selectedLesson.xp} XP</p>
                  <p className="text-xs text-slate-400">Complete to earn XP & gems</p>
                </div>
              </div>
              <button
                onClick={() => handleCompleteLesson(selectedLesson.id)}
                disabled={selectedLesson.locked}
                className="self-start px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 disabled:opacity-50"
              >
                {selectedLesson.locked ? 'Locked' : 'Complete lesson'}
              </button>
            </div>
          )}
        </main>
        <aside className="space-y-4">
          <QuestList quests={quests} />
          <ShopPanel
            items={shopItems}
            inventory={inventory}
            onBuy={handleBuy}
            onActivate={handleActivate}
            activeBoosts={activeBoosts}
          />
        </aside>
      </div>
    </div>
  );
}

function AuthGate({ onSignup, onLogin, message }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });

  const submit = (e) => {
    e.preventDefault();
    if (mode === 'signup') {
      onSignup(form);
    } else {
      onLogin(form);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-900 text-slate-100 relative overflow-hidden">
      <DnaBackdrop />
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-amber-200/80">LearnPath Biology</p>
            <h1 className="text-2xl font-bold">Golden Wolf Coach</h1>
          </div>
          <WolfMascot size={88} />
        </div>
        <p className="text-sm text-slate-300">Sign up or log in to save your XP, gems, streaks, and boosts.</p>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <input
              required
              className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2"
              placeholder="Display name"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            />
          )}
          <input
            required
            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full bg-amber-400 text-slate-900 font-semibold rounded-lg py-2 hover:bg-amber-300" type="submit">
            {mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>
        <button
          onClick={() => setMode((prev) => (prev === 'signup' ? 'login' : 'signup'))}
          className="text-xs text-amber-200 underline"
        >
          {mode === 'signup' ? 'Have an account? Log in' : "New here? Create an account"}
        </button>
        {message && <p className="text-xs text-emerald-300">{message}</p>}
      </div>
    </div>
  );
}

function DnaBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        className="helix-spin absolute -right-12 top-10 w-96 h-96 text-amber-200"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
      >
        <path d="M60 10 C120 40 80 160 140 190" strokeLinecap="round" />
        <path d="M120 10 C60 40 100 160 40 190" strokeLinecap="round" />
        <circle cx="100" cy="40" r="6" fill="currentColor" />
        <circle cx="100" cy="100" r="6" fill="currentColor" />
        <circle cx="100" cy="160" r="6" fill="currentColor" />
      </svg>
    </div>
  );
}
