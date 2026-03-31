import {useParams} from 'react-router-dom';
import { getTeam } from './database';
// Add logout button

function Test() {
    const {teamId} = useParams();
    
    return (
        <div>
            <p>Logged In</p>
            <p>Team ID: {teamId}</p>
        </div>
        
    );
}

export default Test;