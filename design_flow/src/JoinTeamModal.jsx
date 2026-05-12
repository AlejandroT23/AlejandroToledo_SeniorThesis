import { useState } from 'react';
import { getTeamByInviteCode, getMembers } from './database';
import { addMemberAndShareDrive } from './functions/teamDriveService';
import useDriveToken from './operations/hooks/useDriveToken';
import './styles/createTeamModal.css';

function JoinTeamModal({ isOpen, onClose, userId, userEmail, onTeamJoined }) {
    const { getToken } = useDriveToken();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmed = code.trim().toUpperCase();
        if (!trimmed) {
            setError('Please enter an invite code.');
            return;
        }

        setIsLoading(true);
        try {
            const { data: team, error: lookupError } = await getTeamByInviteCode(trimmed);

            if (lookupError) throw new Error('Something went wrong. Please try again.');
            if (!team) {
                setError('Invalid invite code. Please check and try again.');
                setIsLoading(false);
                return;
            }

            const { data: members } = await getMembers(team.id);
            if (members?.some(m => m.user_id === userId)) {
                setError('You are already a member of this team.');
                setIsLoading(false);
                return;
            }

            const driveToken = await getToken();
            await addMemberAndShareDrive(team.id, userId, userEmail, driveToken);

            if (onTeamJoined) onTeamJoined(team);
            setCode('');
            onClose();
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Join Team</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="inviteCode">Invite Code</label>
                        <input
                            id="inviteCode"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="e.g. AB3XY7KM"
                            maxLength={12}
                            autoFocus
                        />
                    </div>
                    {error && <div className="form-error">{error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-create" disabled={isLoading}>
                            {isLoading ? 'Joining...' : 'Join Team'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default JoinTeamModal;
