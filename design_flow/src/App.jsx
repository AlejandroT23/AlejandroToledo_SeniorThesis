// import * as db from './db';
import { supabase } from './supabaseClient'
import AuthContext from './AuthContext.jsx'
import Test from './testpage.jsx';
import LoginPage from './login.jsx';
import MainMenu from './MainMenu.jsx';
// import MainMenu from './main.jsx';
import {useState, useEffect} from 'react';
import {createUser, userExists, getUser, getSession} from './database.js'

function App() {
  
    const [error, setError] = useState(null);
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
  
    // Take state variables above and figure out what true and falses are needed to allow which pages to display

    useEffect(() => {
        
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);

            if (session) {
                getUser(session.user.id).then(({data}) => {
                    setUser(data);
                })
            }

            console.log("Setting loading to false");
            setLoading(false);
        });
        
        const {data: {subscription} } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            setSession(newSession);
    
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
      
                const {data} = await getUser(newSession.user.id);
                setUser(data);
      
            } else {
            setUser(null);
            }
        })

        //Maybe remove?
        return () => subscription.unsubscribe();
    }, []);


    // We need to find a way to say can't log in or log in failed
    if (loading) {return (<div> Loading... </div>);}
    if (!session) {return (<LoginPage />);}
    return (
        <AuthContext.Provider value={user}>
            <MainMenu />
        </AuthContext.Provider>
    );
}

export default App
