import {useState, useRef} from 'react';
import {createVersionWithDrive} from './functions/teamDriveService';
import useDriveToken from './operations/hooks/useDriveToken'
import { getNextVersionNumber } from './database';

import "./styles/uploadModal.css"

function UploadModal({assignment_id, assignmentDriveFolder_id, userId, onUpload_complete}) {
    const {getToken} = useDriveToken();
    const fileInputRef = useRef(null)
    
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState("");
    // const [version_num, setVersionNum] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const handleUpload = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('Upload requires a title')
            return;
        }

        if (!description.trim()) {
            setError('Upload requires a description')
            return;
        }

        if (files.length === 0) {
            setError('Please select at least one file')
            return;
        }

        setLoading(true);

        try {
            const driveToken = await getToken();

            if (!driveToken) {
                setError('Could not retrieve Google Drive Access. Please log out and try again');
                setLoading(false);
                return;
            }

            const {data: version_number} = await getNextVersionNumber(assignment_id)

            // Figure out status
            const {version, driveFolder} = await createVersionWithDrive(
                {
                    assignment_id: assignment_id,
                    uploaded_by: userId,
                    title: title.trim(),
                    description: description.trim(),
                    type: 'upload',
                    version_number: version_number,
                    // status
                    file_name: files.map(f => f.name)
                },
                assignmentDriveFolder_id,
                driveToken,
                files
            )

            console.log('Version created: ', version);
            console.log('Folder created: ', driveFolder);

            setTitle('');
            setDescription('');
            setFiles([]);

            if (onUpload_complete) {
                onUpload_complete(version)
            }
        
        } catch(err) {
            console.error('Failed to upload: ', err)
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false);
        }        
    }

    return(<>
        <div className="uploadModal_container">
            {/* file display */}
            <div className="fileDisplaySection" onClick={() => fileInputRef.current.click()}>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={(e) => {
                        const newFiles = Array.from(e.target.files);
                        console.log('New files: ', newFiles);
                        setFiles(prev => {
                            const merged = [...prev, ...newFiles];
                            console.log('Merged files: ', merged);
                            return merged
                        })}
                    }
                />
                {files.length === 0 ? (
                    <p>Click to upload files</p>
                ) : (
                    files.map((file, index) => (
                        <div className="fileItem" key={index}>
                            <p>{file.name}</p>
                        </div>
                    ))
                )}
            </div>
            {/* upload desc. hub */}
            <div className="fileUploadSection">
                {/* title */}
                <div className="titleSection">
                    <label htmlFor="title">Upload Title</label>
                    <input
                        id = "title"
                        type = "text"
                        value = {title}
                        onChange = {(e) => setTitle(e.target.value)}
                        placeholder = "Title Here"
                        maxLength = {100}
                        autoFocus
                    />
                </div>
                {/* desc. */}
                <div className="descSection">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id = "description"
                        value = {description}
                        onChange = {(e) => setDescription(e.target.value)}
                        placeholder = "Brief description of this upload"
                        row = {3}
                        maxLength = {500}
                    />
                </div>
                {/* submit button*/}
                <div className="uploadButtonSection">
                    <button onClick={handleUpload}> Submit </button>
                </div>
            </div>
        </div>
    </>)
}

export default UploadModal;