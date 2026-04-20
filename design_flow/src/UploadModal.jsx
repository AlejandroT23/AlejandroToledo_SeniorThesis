import {useState, useRef} from 'react';
import {createVersionWithDrive} from './functions/teamDriveService';
import useDriveToken from './operations/hooks/useDriveToken'
import { getNextVersionNumber } from './database';

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
        <div>
            {/* file display */}
            <div onClick={() => fileInputRef.current.click()}>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                />
                {files.length === 0 ? (
                    <p>Click to upload files</p>
                ) : (
                    files.map((file, index) => (
                        <div key={index}>
                            <p>{file.name}</p>
                        </div>
                    ))
                )}
            </div>
            {/* upload desc. hub */}
            <div>
                {/* title */}
                <div>

                </div>
                {/* desc. */}
                <div>

                </div>
                {/* submit button*/}
                <button onClick={handleUpload}> Submit </button>
            </div>
        </div>
    </>)
}