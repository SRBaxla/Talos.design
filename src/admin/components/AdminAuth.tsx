import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { Hexagon, Eye, EyeOff } from 'lucide-react';

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
        <div className="admin-auth-wrapper">
            <div className="admin-auth-card">
                <div className="admin-auth-header">
                    <Hexagon className="admin-auth-logo" size={40} />
                    <h1 className="admin-auth-title">Talos Admin</h1>
                    <p className="admin-auth-subtitle">Sign in to manage projects & case studies</p>
                </div>

                <form onSubmit={handleLogin} className="admin-auth-form">
                    {error && <div className="admin-auth-error">{error}</div>}

                    <div className="admin-field">
                        <label className="admin-label">Email</label>
                        <input
                            type="email"
                            className="admin-input"
                            placeholder="admin@talos.design"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Password</label>
                        <div className="admin-input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="admin-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="admin-input-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="admin-btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
