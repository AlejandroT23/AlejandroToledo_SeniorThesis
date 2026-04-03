// import * as db from './db';
import { supabase } from './supabaseClient'
import AuthContext from './AuthContext.jsx'

import Test from './testpage.jsx';
import LoginPage from './login.jsx';
import MainMenu from './MainMenu.jsx';
import TeamHomePage from './TeamHomePage.jsx';
// import MainMenu from './main.jsx';
import {useState, useEffect} from 'react';
import {createUser, userExists, getUser, getSession} from './database.js'
//--
import {BrowserRouter, Routes, Route} from 'react-router-dom';

// Helper function to extract and format user data from Supabase auth session
function extractUserFromSession(session) {
    if (!session || !session.user) return null;

    const { user } = session;
    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name || '';
    const [firstName, ...lastNameParts] = fullName.split(' ');

    return {
        id: user.id,
        first_name: firstName || '',
        last_name: lastNameParts.join(' ') || '',
        avatar: metadata.avatar_url || '',
        email: user.email || '',
        google_drive_token: null, // Will be updated separately if needed
    };
}

function App() {
  
    const [error, setError] = useState(null);
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [providerToken, setProviderToken] = useState(null);
  
    // Take state variables above and figure out what true and falses are needed to allow which pages to display

    useEffect(() => {
        console.log("App.jsx useEffect started");

        supabase.auth.getSession().then(({data: {session}}) => {
            console.log("getSession resolved, session:", session);
            setSession(session);

            if (session?.provider_token) {
                console.log("Setting provider token:", session.provider_token);
                setProviderToken(session.provider_token);
            }

            if (session) {
                console.log("Session exists, extracting user data");
                const userData = extractUserFromSession(session);
                console.log("User data extracted:", userData);
                setUser(userData);
            } else {
                console.log("No session found");
            }

            console.log("Setting loading to false");
            setLoading(false);
        });
        
        const {data: {subscription} } = supabase.auth.onAuthStateChange((event, newSession) => {
            console.log("onAuthStateChange fired, event:", event, "newSession:", newSession);
            setSession(newSession);

            if (newSession?.provider_token) {
                console.log("Auth state change: Setting provider token");
                setProviderToken(newSession.provider_token);
            }

            // Only extract user data on login or initial session load (page refresh)
            // Skip TOKEN_REFRESHED and other events to avoid unnecessary updates
            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && newSession) {
                console.log("Login/page refresh detected, extracting user data from session");
                const userData = extractUserFromSession(newSession);
                console.log("User data extracted:", userData);
                setUser(userData);

            } else if (!newSession) {
                console.log("Session ended, clearing user");
                setUser(null);
            }
        })

        // Cleanup function: unsubscribe from auth changes when component unmounts
        return () => subscription.unsubscribe();
    }, [user]);


    // We need to find a way to say can't log in or log in failed
    console.log("App render - loading:", loading, "session:", session, "user:", user);
    // if (loading) {return (<div> Loading... </div>);}
    if (!session) {
        console.log("No session, showing LoginPage");
        return (<LoginPage />);
    }
    console.log("Session exists, rendering MainMenu");
    return (
        <AuthContext.Provider value={user}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainMenu />} />
                    <Route path="/team/:teamId" element={<Test />} />
                    <Route path="/team/:teamId/home" element={<TeamHomePage />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App
