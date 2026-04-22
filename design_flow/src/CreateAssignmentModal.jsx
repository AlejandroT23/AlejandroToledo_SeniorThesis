import {useState} from 'react';
import {createAssignmentWithDrive} from './functions/teamDriveService';
import useDriveToken from './operations/hooks/useDriveToken';
import {getTeamDriveFolderLocation} from './database.js'
import './styles/createAssignmentModal.css';

function CreateAssignmentModal({isOpen, onClose, teamId, onAssignmentCreated}) {
    const {getToken} = useDriveToken();

    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('')
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) {
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null)

        if (!name.trim()) {
            setError('Team name is required');
            return;
        }

        if (!deadline.trim()) {
            setError('Deadline is required');
            return;
        }

        setLoading(true);

        try {
            const driveToken = await getToken();

            if (!driveToken) {
                setError('Could not get Google Drive access. Please log out and log back in.')
                setLoading(false);
                return;
            }

            const {data: teamFolder} = await getTeamDriveFolderLocation(teamId);

            const {assignment, driveFolder} = await createAssignmentWithDrive(
                {
                    name: name.trim(),
                    deadline: deadline,
                    desc: description.trim() || null,
                    team_id: teamId,
                },
                teamFolder,
                driveToken 
            )

            console.log('Assignment Created: ', assignment)
            console.log('Drive folders: ', driveFolder)

            setName('');
            setDeadline('');
            setDescription('');

            if (onAssignmentCreated) {
                onAssignmentCreated(assignment);
            }

            onClose();
        } catch(err) {
            console.error('Failed to create assignment: ', err)
            setError(err.message || 'Something went wrong. Please try again')
        } finally {
            setLoading(false);
        }
    }
    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return(
        <div className="cam-overlay" onClick={handleOverlayClick}>
            {/* Container */}
            <div className="cam-container">
                {/* Header */}
                <div className="cam-header">
                    <h2>Create Assignment</h2>
                    <button className="cam-close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="cam-form">
                    {/* Assignment Name */}
                    <div className="cam-form-group">
                        <label htmlFor="name">Assignment Name *</label>
                        <input
                            id = "name"
                            type = "text"
                            value = {name}
                            onChange = {(e) => setName(e.target.value)}
                            placeholder = "e.g. Social Media Graphics"
                            maxLength = {100}
                            autoFocus
                        />
                    </div>
                    {/* Description */}
                    <div className="cam-form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id = "description"
                            value = {description}
                            onChange = {(e) => setDescription(e.target.value)}
                            placeholder = "Brief description of this assignment"
                            row = {3}
                            maxLength = {500}
                        />
                    </div>
                    {/* Deadline */}
                    <div className="cam-form-group">
                        <label htmlFor="deadline">Deadline</label>
                        <input
                            id = "deadline"
                            type = "date"
                            value = {deadline}
                            onChange = {(e) => setDeadline(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    {error && <div className="cam-form-error">{error}</div>}
                    {/* Actions */}
                    <div className="cam-actions">
                        <button
                            type = "button"
                            className="cam-btn-cancel"
                            onClick = {onClose}
                            disabled = {isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cam-btn-create"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>)
}

export default CreateAssignmentModal;