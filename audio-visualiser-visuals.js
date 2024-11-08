const AudioVisualiserVisualsBars = (function () {

  return {

    draw: function (canvas, canvasCtx, bufferLength, dataArray) {
      const barWidth = (canvas.width / bufferLength) * 1.0;
      let barHeight;
      let x = 0;

      // Draw the bars
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2.4;

        const r = barHeight + 25;
        const g = 50;
        const b = 255 - barHeight;

        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    },

  };
})();

const AudioVisualiserVisualsBorderGradient = (function () {

  return {

    draw: function (canvas, canvasCtx, bufferLength, dataArray) {
      const totalSegments = bufferLength;
      const segmentsPerSide = Math.floor(totalSegments / 4);
      const remainder = totalSegments % 4;
      const barWidth = 50;
      const colorStart = "#04AA6D";
      const colorMiddle = "#04aa6d8f";
      const colorEnd = "white";
      let idx = 0;

      // Top edge
      const topSegments = segmentsPerSide + (remainder > 0 ? 1 : 0);
      const segmentWidthTop = Math.ceil(canvas.width / topSegments);
      let x = 0;
      for (let i = 0; i < topSegments && idx < bufferLength; i++, idx++) {
        const value = dataArray[idx];
        const grad = canvasCtx.createLinearGradient(0, 0, 0, barWidth);
        grad.addColorStop(0, colorStart);
        grad.addColorStop(0.3, colorMiddle);
        grad.addColorStop(1, colorEnd);
        canvasCtx.fillStyle = grad;
        canvasCtx.fillRect(x, 0, segmentWidthTop, (barWidth / 255) * value);
        x += segmentWidthTop;
      }

      // Right edge
      const rightSegments = segmentsPerSide + (remainder > 1 ? 1 : 0);
      const segmentHeightRight = Math.ceil(canvas.height / rightSegments);
      let y = 0;
      for (let i = 0; i < rightSegments && idx < bufferLength; i++, idx++) {
        const value = dataArray[idx];
        const grad = canvasCtx.createLinearGradient(canvas.width, y, canvas.width - barWidth, y);
        grad.addColorStop(0, colorStart);
        grad.addColorStop(0.3, colorMiddle);
        grad.addColorStop(1, colorEnd);
        canvasCtx.fillStyle = grad;
        canvasCtx.fillRect(
          canvas.width - (barWidth / 255) * value,
          y,
          (barWidth / 255) * value,
          segmentHeightRight
        );
        y += segmentHeightRight;
      }

      // Bottom edge
      const bottomSegments = segmentsPerSide + (remainder > 2 ? 1 : 0);
      const segmentWidthBottom = Math.ceil(canvas.width / bottomSegments);
      x = canvas.width;
      for (let i = 0; i < bottomSegments && idx < bufferLength; i++, idx++) {
        const value = dataArray[idx];
        // const grad = canvasCtx.createLinearGradient(0, canvas.height - barWidth, 0, canvas.height);
        const grad = canvasCtx.createLinearGradient(0, canvas.height, 0, canvas.height - barWidth);
        grad.addColorStop(0, colorStart);
        grad.addColorStop(0.3, colorMiddle);
        grad.addColorStop(1, colorEnd);
        canvasCtx.fillStyle = grad;
        x -= segmentWidthBottom;
        canvasCtx.fillRect(x, canvas.height - (barWidth / 255) * value, segmentWidthBottom, (barWidth / 255) * value);
      }

      // Left edge
      const leftSegments = segmentsPerSide;
      const segmentHeightLeft = Math.ceil(canvas.height / leftSegments);
      y = canvas.height;
      for (let i = 0; i < leftSegments && idx < bufferLength; i++, idx++) {
        const value = dataArray[idx];
        y -= segmentHeightLeft;
        const grad = canvasCtx.createLinearGradient(0, y, barWidth, y);
        grad.addColorStop(0, colorStart);
        grad.addColorStop(0.3, colorMiddle);
        grad.addColorStop(1, colorEnd);
        canvasCtx.fillStyle = grad;
        canvasCtx.fillRect(0, y, (barWidth / 255) * value, segmentHeightLeft);
      }
    },

  };
})();

const AudioVisualiserVisualsBezier = (function () {

  return {

    draw: function (canvas, canvasCtx, bufferLength, dataArray) {
      const width = canvas.width;
      const height = canvas.height;
      const sliceWidth = width / bufferLength;
      let x = 0;

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = height - (v * height / 2);

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          const cp1x = x - sliceWidth / 2;
          const cp1y = height;
          const cp2x = x - sliceWidth / 2;
          const cp2y = y;
          canvasCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height);
      canvasCtx.stroke();
    },

  };
})();


const AudioVisualiserVisualsBezier2 = (function () {

  return {

    draw: function (canvas, canvasCtx, bufferLength, dataArray) {
      const width = canvas.width;
      const height = canvas.height;
      const sliceWidth = width / bufferLength;
      let x = 0;

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      let prevY = height

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = height - (v * height / 2);

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          const cp1x = x - sliceWidth / 2;
          const cp1y = prevY;
          const cp2x = x - sliceWidth / 2;
          const cp2y = y;
          canvasCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }

        prevY = y;
        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height);
      canvasCtx.stroke();
    },

  };
})();