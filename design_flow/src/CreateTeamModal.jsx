// src/CreateTeamModal.jsx
import { useState } from 'react';
import { createTeamWithDrive } from './functions/teamDriveService';
import useDriveToken from './operations/hooks/useDriveToken';
// import './styles/CreateTeamModal.css';

const COLOR_OPTIONS = [
  '#FF5733', '#E74C3C', '#9B59B6', '#8E44AD',
  '#3498DB', '#2980B9', '#1ABC9C', '#16A085',
  '#2ECC71', '#27AE60', '#F39C12', '#E67E22',
  '#34495E', '#7F8C8D', '#E84393', '#6C5CE7',
];

function CreateTeamModal({ isOpen, onClose, userId, onTeamCreated }) {
  const { getToken } = useDriveToken();

  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [icon, setIcon] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    setIsLoading(true);

    try {
      const driveToken = await getToken();

      if (!driveToken) {
        setError('Could not get Google Drive access. Please log out and log back in.');
        setIsLoading(false);
        return;
      }

      const { team, driveFolders } = await createTeamWithDrive(
        {
          team_name: teamName.trim(),
          deadline: deadline || null,
          desc: description.trim() || null,
          icon: icon || null,
          color: selectedColor,
        },
        userId,
        driveToken
      );

      console.log('Team created:', team);
      console.log('Drive folders:', driveFolders);

      // Reset form
      setTeamName('');
      setDescription('');
      setDeadline('');
      setSelectedColor(COLOR_OPTIONS[0]);
      setIcon('');

      // Notify parent so it can refresh the team list
      if (onTeamCreated) {
        onTeamCreated(team);
      }

      onClose();
    } catch (err) {
      console.error('Failed to create team:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    // Close when clicking the overlay background, not the modal itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>Create Team</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Team Name */}
          <div className="form-group">
            <label htmlFor="teamName">Team Name *</label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Spring Campaign"
              maxLength={100}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this team or project..."
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Deadline */}
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Color Picker */}
          <div className="form-group">
            <label>Color</label>
            <div className="color-grid">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Icon / Emoji */}
          <div className="form-group">
            <label htmlFor="icon">Icon (emoji or text)</label>
            <input
              id="icon"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. 🎨 or 🚀"
              maxLength={4}
            />
          </div>

          {/* Error message */}
          {error && <div className="form-error">{error}</div>}

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeamModal;