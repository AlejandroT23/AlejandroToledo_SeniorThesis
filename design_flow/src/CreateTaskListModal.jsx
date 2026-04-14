import { useState } from 'react';
import { createTasks } from './database.js';

function CreateTaskModal({ isOpen, onClose, assignmentId, onTaskCreated }) {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('Task title is required');
            return;
        }

        setIsLoading(true);

        const { data, error } = await createTasks(title.trim(), assignmentId);

        if (error) {
            setError('Failed to create task. Please try again.');
            setIsLoading(false);
            return;
        }

        setTitle('');

        if (onTaskCreated) {
            onTaskCreated(data);
        }

        onClose();
        setIsLoading(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Add Task</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Task Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Write introduction"
                            maxLength={200}
                            autoFocus
                        />
                    </div>

                    {error && <div className="form-error">{error}</div>}

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
                            {isLoading ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTaskModal;
