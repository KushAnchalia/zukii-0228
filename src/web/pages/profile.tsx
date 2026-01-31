import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/store';
import AnimatedBackground from '@/components/animated-background';
import { toast } from 'sonner';

const Profile = () => {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
  }, [user?.name]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSaveName = async () => {
    if (!newName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update user in localStorage (simulated)
    const authData = localStorage.getItem('zukii-auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      parsed.state.user.name = newName;
      localStorage.setItem('zukii-auth', JSON.stringify(parsed));
    }
    
    toast.success('Name updated successfully');
    setIsEditingName(false);
    setIsSaving(false);
    
    // Force reload to update the state
    window.location.reload();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSaving(false);
  };

  const handleDeleteAccount = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    logout();
    localStorage.removeItem('zukii-auth');
    localStorage.removeItem('zukii-websites');
    toast.success('Account deleted successfully');
    setLocation('/');
  };

  const userInitial = user.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#050208] relative overflow-hidden">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={() => setLocation('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <svg 
                className="w-5 h-5 transition-transform group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/')}>
              <img
                src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
                alt=""
                className="h-8 w-auto logo-glow"
              />
              <span className="text-lg font-bold text-white font-display gradient-text">Zukii</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="animate-fade-in-up">
          {/* Profile Header */}
          <div className="text-center mb-10">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 p-[3px]">
                <div className="w-full h-full rounded-full bg-[#0a0612] flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">{userInitial}</span>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 blur-xl opacity-30" />
            </div>
            
            {/* User Info */}
            <h1 className="text-3xl font-bold text-white mb-1 font-display">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>

          {/* Profile Cards Grid */}
          <div className="space-y-6">
            {/* Edit Profile Section */}
            <div className="glass-card gradient-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              
              <h2 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Edit Profile
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                  {isEditingName ? (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 h-12 px-4 bg-[rgba(30,25,50,0.8)] border border-[rgba(139,92,246,0.3)] rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                        placeholder="Your name"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={isSaving}
                        className="px-6 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setNewName(user.name);
                        }}
                        className="px-4 h-12 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-[rgba(30,25,50,0.5)] border border-[rgba(139,92,246,0.2)] rounded-xl px-4 h-12">
                      <span className="text-white">{user.name}</span>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="flex items-center justify-between bg-[rgba(30,25,50,0.5)] border border-[rgba(139,92,246,0.2)] rounded-xl px-4 h-12">
                    <span className="text-gray-400">{user.email}</span>
                    <span className="text-xs text-gray-500">Cannot be changed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="glass-card gradient-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              
              <h2 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Change Password
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-[rgba(30,25,50,0.8)] border border-[rgba(139,92,246,0.3)] rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-[rgba(30,25,50,0.8)] border border-[rgba(139,92,246,0.3)] rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-[rgba(30,25,50,0.8)] border border-[rgba(139,92,246,0.3)] rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-12 bg-gradient-to-r from-cyan-600 to-violet-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Subscription Section */}
            <div className="glass-card gradient-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              
              <h2 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                Subscription Plan
              </h2>

              <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-white">Free Plan</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                        Current
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Perfect for getting started with voice AI</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">$0</div>
                    <div className="text-gray-400 text-sm">/month</div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {['1 website', '100 conversations/month', 'Basic analytics', 'Email support'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setLocation('/#pricing')}
                  className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-rose-500/20">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
              
              <h2 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                Danger Zone
              </h2>

              {showDeleteConfirm ? (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6">
                  <p className="text-white mb-4">
                    Are you sure you want to delete your account? This action cannot be undone. All your data, websites, and agents will be permanently deleted.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isSaving}
                      className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 rounded-xl text-white font-semibold transition-all disabled:opacity-50"
                    >
                      {isSaving ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 h-12 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">Delete Account</h3>
                    <p className="text-gray-400 text-sm">Permanently delete your account and all associated data</p>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 h-10 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-medium hover:bg-rose-500/20 transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
