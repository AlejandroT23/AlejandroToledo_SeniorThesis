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
        
        supabase.auth.getSession().then(async ({data: {session}}) => {
            setSession(session);

            if (session?.provider_token) {
                setProviderToken(session.provider_token);
            }

            if (session) {
                const {data: userData} = await getUser(session.user.id);
                setUser(userData);
            }

            console.log("Setting loading to false");
            setLoading(false);
        });
        
        const {data: {subscription} } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            setSession(newSession);
    
            if (newSession?.provider_token) {
                setProviderToken(newSession.provider_token);
            }

            if (newSession) {
                const exists = await userExists(newSession.user.id);

                if (!exists) {
                    const metaData = newSession.user.user_metadata

                    await createUser({
                        id: newSession.user.id,
                        first_name: metaData.full_name?.split(' ')[0] || '',
                        last_name: metaData.full_name?.split(' ').slice(1).join(' ') || '',
                        avatar: metaData.avatar_url || '',
                        google_drive_token: null, // can set this up later
                    });
                }
      
                const {data: userData} = await getUser(newSession.user.id);
                setUser(userData);
      
            } else {
                setUser(null);
            }
        })

        //Maybe remove?
        return () => subscription.unsubscribe();
    }, []);


    // We need to find a way to say can't log in or log in failed
    // if (loading) {return (<div> Loading... </div>);}
    if (!session) {return (<LoginPage />);}
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
