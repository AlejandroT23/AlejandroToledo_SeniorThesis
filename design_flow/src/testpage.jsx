import {useParams, useNavigate} from 'react-router-dom';
import { getTeam } from './database';

// Add logout button

function Test() {
    const {teamId} = useParams();
    const navigate = useNavigate();
    
    return (
        <div>
            <p>Logged In</p>
            <p>Team ID: {teamId}</p>
            <button onClick = {() => navigate(`/team/${teamId}/home`)}>
                Go to Home Page
            </button>
        </div>
        
    );
}

export default Test;