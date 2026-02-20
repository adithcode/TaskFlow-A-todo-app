import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <CheckSquare className="brand-icon" />
                    <span>TaskFlow</span>
                </div>
                {user && (
                    <div className="navbar-menu">
                        <span className="welcome-text">Hi, {user.name.split(' ')[0]}</span>
                        <button onClick={handleLogout} className="btn-logout">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
