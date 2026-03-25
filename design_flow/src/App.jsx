// import * as db from './db';
import { supabase } from './supabaseClient'
import Test from './testpage.jsx';
import LoginPage from './login.jsx';
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

    if (loading) {return (<div> Loading... </div>);}
    if (!session) {return (<LoginPage />);}
    return (<Test />);
}

export default App


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   // const [count, setCount] = useState(0)

//   // return (
//   //   <>
//   //     <div>
//   //       <a href="https://vite.dev" target="_blank">
//   //         <img src={viteLogo} className="logo" alt="Vite logo" />
//   //       </a>
//   //       <a href="https://react.dev" target="_blank">
//   //         <img src={reactLogo} className="logo react" alt="React logo" />
//   //       </a>
//   //     </div>
//   //     <h1>Vite + React</h1>
//   //     <div className="card">
//   //       <button onClick={() => setCount((count) => count + 1)}>
//   //         count is {count}
//   //       </button>
//   //       <p>
//   //         Edit <code>src/App.jsx</code> and save to test HMR
//   //       </p>
//   //     </div>
//   //     <p className="read-the-docs">
//   //       Click on the Vite and React logos to learn more
//   //     </p>
//   //   </>
//   // )


// }