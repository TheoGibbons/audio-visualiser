const AudioVisualiser = (function () {

  let inited = false;
  let canvas;
  let theme;
  let canvasCtx;
  let audioCtx;
  let analyser;
  let bufferLength;
  let dataArray;
  let source;
  let stream;
  let animationFrameId;
  let isVisualising = false;

  /**
   * Adjust the canvas resolution to match its displayed size
   */
  const resizeCanvas = function () {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  // Function to draw the bars based on audio input
  const draw = function () {
    animationFrameId = requestAnimationFrame(draw);

    // Get the audio data
    analyser.getByteFrequencyData(dataArray);

    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (theme === 'border') {
      AudioVisualiserVisualsBorderGradient.draw(canvas, canvasCtx, bufferLength, dataArray);
    } else if (theme === 'bezier') {
      AudioVisualiserVisualsBezier.draw(canvas, canvasCtx, bufferLength, dataArray);
    } else if (theme === 'bezier2') {
      AudioVisualiserVisualsBezier2.draw(canvas, canvasCtx, bufferLength, dataArray);
    } else if (theme === 'circle') {
      AudioVisualiserVisualsCircle.draw(canvas, canvasCtx, bufferLength, dataArray);
    } else if (theme === 'circle2') {
      AudioVisualiserVisualsCircle2.draw(canvas, canvasCtx, bufferLength, dataArray);
    } else if (theme === 'circle3') {
      AudioVisualiserVisualsCircle3.draw(canvas, canvasCtx, bufferLength, dataArray);
    } else if (theme === 'circle4') {
      AudioVisualiserVisualsCircle4.draw(canvas, canvasCtx, bufferLength, dataArray);
    } else {
      AudioVisualiserVisualsBars.draw(canvas, canvasCtx, bufferLength, dataArray);
    }
  };

  // Initialize audio and start visualization
  const startVisualiser = function () {
    resizeCanvas();

    // Set up the analyser
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256; // Determines the precision/resolution
    bufferLength = analyser.frequencyBinCount; // Half of fftSize
    dataArray = new Uint8Array(bufferLength); // Array to hold audio data

    // Ask for microphone access
    navigator.mediaDevices.getUserMedia({audio: true})
      .then((mediaStream) => {
        stream = mediaStream;
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        draw(); // Start drawing the visualization
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });
  }

  const init = function (props) {
    if (!inited) {
      canvas = props.canvas;
      theme = props.theme;
      canvasCtx = canvas.getContext('2d');
      window.addEventListener('resize', resizeCanvas);
      inited = true;
    }
  }

  const visualiseAudio = function (recording) {

    console.log('Start recording audio visualization');

    if (recording) {
      if (!isVisualising) {
        isVisualising = true;

        // Create the audio context here
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Resume the audio context if it's suspended
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        canvas.style.display = 'block';
        startVisualiser();
      }
    } else {
      if (isVisualising) {
        isVisualising = false;

        // Stop the visualizer
        cancelAnimationFrame(animationFrameId);

        if (source) {
          source.disconnect();
          source = null;
        }

        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          stream = null;
        }

        if (audioCtx) {
          audioCtx.close().then(() => {
            audioCtx = null;
          });
        }

        canvas.style.display = 'none';
      }
    }
  };

  return {
    init: init,
    visualiseAudio: visualiseAudio,
  };
})();
