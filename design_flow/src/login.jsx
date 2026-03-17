'use strict'

import { useState } from 'react'
import { supabase } from './supabaseClient'

function LoginPage() {

    const [error, setError] = useState(null);

    const handleGoogleLogin = async () => {
        const {error} = await supabase.auth.signInWithOAuth(
            {
                provider: 'google'
            }
        )

        if (error) {
            setError("Sorry, please try again")
        }
    }

    return (
        <div>
            <p>Temporary Page</p>
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