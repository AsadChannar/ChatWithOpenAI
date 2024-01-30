// VoiceRecorder.js
import React, { useState, useRef, useEffect } from 'react';
import { ReactMic } from 'react-mic';
import ReactPlayer from 'react-player';

const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const playerRef = useRef(null);
    const [textToSpeech, setTextToSpeech] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [textFromVoice, setTextFromVoice] = useState('');
    const [isConvertingToText, setIsConvertingToText] = useState(false);
    const [showButtons, setShowButtons] = useState(false);

    const handleStartRecording = () => {
        setIsRecording(true);
    };

    const handleStopRecording = () => {
        setIsRecording(false);
    };

    const handleSend = () => {
        if (isRecording) {
            // Stop recording if it's in progress
            setIsRecording(false);
        } else {
            // Send the recorded audio or perform any desired action
            console.log(audioBlob);
            // Display both "Play Audio" and "Voice to Text" buttons
            setShowButtons(true);
        }
    };

    const handlePlayback = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(0);
            playerRef.current.getInternalPlayer().play();
        }
    };

    const handleAudioCapture = (recordedBlob) => {
        setAudioBlob(recordedBlob.blob);
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);

        utterance.onend = () => {
            setIsSpeaking(false);
        };
    };

    const convertVoiceToText = async () => {
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);

        try {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setTextFromVoice(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };

            audio.addEventListener('loadedmetadata', () => {
                recognition.start();
                audio.play();
            });
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
        }
    };

    const handleTextToVoice = () => {
        speakText(textToSpeech);
    };

    const handleVoiceToText = () => {
        convertVoiceToText();
        setIsConvertingToText(true); // Set the flag to indicate text conversion
    };

    useEffect(() => {
        if (isSpeaking) {
            // Handle any actions you want while speech is in progress
        }

        if (isConvertingToText) {
            // Handle any actions after text conversion
            setIsConvertingToText(false); // Reset the flag after conversion
        }
    }, [isSpeaking, isConvertingToText]);

    return (
        <div className='container'>
            <input
                type="text"
                placeholder="Type your message"
                value={textToSpeech}
                onChange={(e) => setTextToSpeech(e.target.value)}
            />
            {textToSpeech && (
                <div>
                    <button onClick={handleTextToVoice}>Text to Voice</button>
                </div>
            )}
            <ReactMic
                record={isRecording}
                className="sound-wave"
                onStop={handleAudioCapture}
                onData={console.log}
                strokeColor="#000000"
                backgroundColor="#FF4081"
            />
            <button onClick={handleStartRecording}>Start Recording</button>
            <button onClick={handleStopRecording}>Stop Recording</button>
            <button onClick={handleSend}>Send</button>
            {showButtons && (
                <>
                    <button onClick={handlePlayback}>Play Audio</button>
                    <button onClick={handleVoiceToText}>Voice to Text</button>
                </>
            )}
            {textFromVoice && <div>Text from voice: {textFromVoice}</div>}

            {audioBlob && (
                <div>
                    <ReactPlayer ref={playerRef} url={URL.createObjectURL(audioBlob)} />
                </div>
            )}
        </div>
    );
};

export default VoiceRecorder;
