import LoginPage from './login.jsx'
import { useState } from 'react';

function App() {
  
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  
  // Take state variables above and figure out what true and falses are needed to allow which pages to display

  // useEffect(() => {}, [];)

  // onAuthStateChange((session) => {
  //   if (session) {
      
  //     // Get the user ID - Possible from index.js route that calls for user data
      
  //     if (!db.userExist(user)) {
  //       firstAccountSetup()
  //     } else {
  //       return (<MainMenu />)
  //     }
  //   } else {
  //     return (<LoginPage />)
  //   }
  // })





  return (
    <LoginPage />
  )
}

function firstAccountSetup() {

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