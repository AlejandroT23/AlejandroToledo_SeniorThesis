'use strict'

import { useState } from 'react'
import { supabase } from './supabaseClient'

import './styles/login.css';

function LoginPage() {

    const [error, setError] = useState(null);

    const handleGoogleLogin = async () => {
        const {data, error} = await supabase.auth.signInWithOAuth(
            {
                provider: 'google',
                options: {
                    scopes: 'https://www.googleapis.com/auth/drive.file',
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            }
        )

        if (error) {
            setError("Sorry, please try again")
        }
    }

    return (
        <div className="main_div">
            <p className="title">DESIGN FLOW</p>
            <h1>
                Login Page
            </h1>
            <button onClick={handleGoogleLogin}>
                Sign in with Google
            </button>

            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    )
}

export default LoginPage