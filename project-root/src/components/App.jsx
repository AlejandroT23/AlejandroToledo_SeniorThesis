import {useState, useEffect} from 'react';
import TeamButton from './TeamButton';


function App() {
    const [teams, setTeams] = useState([])

    // Enables side effects after the component renders
    useEffect(() => {
        getTeams();
    }, []);

    // Extracts teams from database, Stores in array
    const getTeams = async () => {

    };
}

export default App;