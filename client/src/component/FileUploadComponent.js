import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileUploadComponent = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Reset state for a new file upload
    setUploadedFile(null);
    setUploadProgress(0);

    // Simulate file upload with progress
    await uploadFile(file);

    // Once upload is complete, update the state to display the uploaded file
    setUploadedFile({
      file,
      preview: URL.createObjectURL(file),
    });
  }, []);

  const uploadFile = async (file) => {
    const totalSize = file.size;
    let loaded = 0;

    // Calculate progress update interval based on file size
    const interval = totalSize <= 1000000 ? 20 : 4;

    const progressInterval = setInterval(() => {
      loaded += Math.random() * 10000; // Simulating progress
      const progress = (loaded / totalSize) * 100;

      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, interval); // Vary the progress update interval based on file size

    // Simulate a 20-second upload time for small files, 4-second for larger files
    setTimeout(() => {
      clearInterval(progressInterval);
    }, totalSize <= 10000000 ? 200000 : 40000);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,application/pdf,.zip,.rar,.doc,.docx', // Add or customize accepted file types
  });

  return (
    <div className='container'>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={progressBarContainer}>
          <ProgressBar
            variant="success" 
            animated
            now={uploadProgress}
            label={`${uploadProgress.toFixed(2)}%`}
          />
        </div>
      )}

      {uploadedFile && uploadProgress >= 100 && (
        <div className='p-3 text-center'>
          <p>Uploaded File Name: {uploadedFile.file.name} </p>
          {uploadedFile.file.type.startsWith('image/') ? (
            <img src={uploadedFile.preview} alt="Uploaded File" style={previewStyles}  className=''/>
          ) : (
            <p>This is a {uploadedFile.file.type} file. <a href={uploadedFile.preview} target="_blank" rel="noopener noreferrer">Download or View</a></p>
          )}
        </div>
      )}
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

const previewStyles = {
  maxWidth: '100%',
  maxHeight: '200px',
  marginTop: '10px',
};

const progressBarContainer = {
  marginTop: '10px',
};

export default FileUploadComponent;
