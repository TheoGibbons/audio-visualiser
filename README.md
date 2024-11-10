# Audio Visualiser

Audio Visualiser is a simple tool to visualize audio being recorded in real-time. It provides a visual representation of the audio input using various visual styles.

## Features

- Real-time audio visualization
- Multiple visual styles
- Extremely Easy to integrate

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/TheoGibbons/audio-visualiser.git
```

## Usage

To use the Audio Visualiser, include the following files in your HTML:

```html
<link rel="stylesheet" href="audio-visualiser.css">
<script src="audio-visualiser.js"></script>
<script src="audio-visualiser-visuals.js"></script>
```

## Demo

A demo is provided in the [demo.html](https://theogibbons.github.io/audio-visualiser/demo.html) file. You can open this file in your browser to see the Audio Visualiser in action.

### Example

Here is an example of how to set up the Audio Visualiser in your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Visualise Audio Demo</title>
    <link rel="stylesheet" href="audio-visualiser.css">
</head>
<body>

<canvas id="visualiser" style="display: none"></canvas>

<script src="audio-visualiser.js"></script>
<script src="audio-visualiser-visuals.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {

    // Initialize the visualizer with your canvas
    AudioVisualiser.init({
        canvas: document.getElementById('visualiser'),
        theme: 'bar'        // DEFAULT
        // theme: 'border'
        // theme: 'bezier'
        // theme: 'bezier2'
        // theme: 'circle'
        // theme: 'circle2'
        // theme: 'circle3'
        // theme: 'circle4'
    });
    
    // Call visualiseAudio to start/stop
    AudioVisualiser.visualiseAudio(true/false);

  });
</script>
</body>
</html>
```

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
