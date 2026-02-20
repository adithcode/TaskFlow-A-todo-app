import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await axios.get('/auth/me');
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        setUser(res.data.user);
        return res.data;
    };

    const register = async (name, email, password, confirmPassword) => {
        const res = await axios.post('/auth/register', { name, email, password, confirmPassword });
        return res.data;
    };

    const logout = async () => {
        await axios.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
