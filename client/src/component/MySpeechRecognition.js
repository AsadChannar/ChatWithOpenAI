import React from 'react';
import SpeechRecognition from 'react-speech-recognition';

class MySpeechRecognition extends React.Component {
  render() {
    const { transcript, startListening, stopListening, resetTranscript } = this.props;

    return (
      <div>
        <p>{transcript}</p>
        <button onClick={startListening}>Start</button>
        <button onClick={stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
      </div>
    );
  }
}

export default SpeechRecognition(MySpeechRecognition);
