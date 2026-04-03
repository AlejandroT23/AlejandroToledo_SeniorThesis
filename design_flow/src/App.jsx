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


function App() {
  
    const [error, setError] = useState(null);
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [providerToken, setProviderToken] = useState(null);
  
    // Take state variables above and figure out what true and falses are needed to allow which pages to display

    useEffect(() => {
        console.log("App.jsx useEffect started");

        supabase.auth.getSession().then(async ({data: {session}}) => {
            console.log("getSession resolved, session:", session);
            setSession(session);

            if (session?.provider_token) {
                console.log("Setting provider token:", session.provider_token);
                setProviderToken(session.provider_token);
            }

            if (session) {
                console.log("Session exists, fetching user data for ID:", session.user.id);
                const {data: userData} = await getUser(session.user.id);
                console.log("getUser completed, userData:", userData);
                setUser(userData);
            } else {
                console.log("No session found");
            }

            console.log("Setting loading to false");
            setLoading(false);
        });
        
        const {data: {subscription} } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            console.log("onAuthStateChange fired, event:", _event, "newSession:", newSession);
            setSession(newSession);

            if (newSession?.provider_token) {
                console.log("Auth state change: Setting provider token");
                setProviderToken(newSession.provider_token);
            }

            if (newSession) {
                console.log("New session exists, checking if user exists");
                const exists = await userExists(newSession.user.id);
                console.log("User exists:", exists);

                if (!exists) {
                    console.log("User doesn't exist, creating new user");
                    const metaData = newSession.user.user_metadata

                    await createUser({
                        id: newSession.user.id,
                        first_name: metaData.full_name?.split(' ')[0] || '',
                        last_name: metaData.full_name?.split(' ').slice(1).join(' ') || '',
                        avatar: metaData.avatar_url || '',
                        google_drive_token: null, // can set this up later
                    });
                }

                console.log("Fetching user data after auth state change");
                const {data: userData} = await getUser(newSession.user.id);
                console.log("User data fetched:", userData);
                setUser(userData);

            } else {
                console.log("No session in auth state change, clearing user");
                setUser(null);
            }
        })

        //Maybe remove?
        return () => subscription.unsubscribe();
    }, []);


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
