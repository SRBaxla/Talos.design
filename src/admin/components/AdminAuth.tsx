import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { Hexagon, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminAuth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-sm bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <Hexagon className="text-accent-orange mb-3 mx-auto" size={40} />
                    <h1 className="font-display text-2xl font-bold mb-1 text-primary">Talos Admin</h1>
                    <p className="text-secondary text-sm">Sign in to manage projects & case studies</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3.5 py-2.5 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-widest">Email</label>
                        <input
                            type="email"
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-primary text-sm focus:border-accent-orange focus:ring-1 focus:ring-accent-orange/30 outline-none transition-all w-full placeholder:text-muted"
                            placeholder="admin@talos.design"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-primary text-sm focus:border-accent-orange focus:ring-1 focus:ring-accent-orange/30 outline-none transition-all w-full placeholder:text-muted pr-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors p-1"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent-orange text-bg-base font-semibold text-sm rounded-lg hover:bg-accent-orange-hover hover:shadow-[0_0_16px_rgba(210,193,182,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link to="/" className="inline-flex items-center justify-center gap-1.5 text-sm text-muted hover:text-primary transition-colors">
                        <ArrowLeft size={14} /> Back to Website
                    </Link>
                </div>
            </div>
        </div>
    );
}
