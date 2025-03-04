const AudioVisualiserVisualsBars = (function () {

  return {

    draw: function (canvas, canvasCtx, bufferLength, dataArray, options) {
      const barWidth = (canvas.width / bufferLength) * 1.0;
      let barHeight;
      let x = 0;

      // Draw the bars
      for (let i = 0; i < bufferLength; i++) {
        const dataStrength = dataArray[i];    // Number between 0 and 255

        barHeight = canvas.height / 255 * dataStrength;
        console.log(dataArray[i]);

        let r, g, b;
        if (options?.coloriser) {
          [r, g, b] = options.coloriser(barHeight);
        } else {
          const barGreyColorMin = 230
          const barGreyColorMax = 100
          let barGreyColor = (((barGreyColorMax - barGreyColorMin) / 255) * dataStrength) + barGreyColorMin
          r = barGreyColor;
          g = r;
          b = r;
        }

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
        const v = dataArray[i] / bufferLength;
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
        const v = dataArray[i] / bufferLength;
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

const AudioVisualiserVisualsCircle = (function () {

  return {

    draw: function (canvas, canvasCtx, bufferLength, dataArray) {
      const width = canvas.width;
      const height = canvas.height;

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const mapOntoRange = (value, inMin, inMax, outMin, outMax) => {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
      }

      const getPoints = (dataArray, radiusMin, radiusMax, centerX, centerY, segments) => {
        const points = [];

        for (let i = 0; i < segments * 2; i++) {

          const valueI = i > segments ? segments - (i - segments) : i;
          const value = dataArray[valueI];
          const radius = mapOntoRange(value / segments, 0, 1, radiusMin, radiusMax);

          points.push({
            x: centerX + (Math.sin(2 * Math.PI / (segments * 2) * i) * radius),
            y: centerY + (Math.cos(2 * Math.PI / (segments * 2) * i) * radius)
          });
        }

        // Draw the line back to the first point
        points.push(points[0]);

        return points;
      }

      const points = getPoints(dataArray, 100, 300, width / 2, height / 2, bufferLength);

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (i === 0) {
          canvasCtx.moveTo(point.x, point.y);
        } else {
          canvasCtx.lineTo(point.x, point.y);
        }
      }

      canvasCtx.stroke();
    },

  };
})();

const AudioVisualiserVisualsCircle2 = (function () {

  let drawCount = 0;

  return {

    draw: function (canvas, canvasCtx, bufferLength, dataArray) {
      const width = canvas.width;
      const height = canvas.height;

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const mapOntoRange = (value, inMin, inMax, outMin, outMax) => {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
      }

      const getPoints = (dataArray, radiusMin, radiusMax, centerX, centerY, segments) => {
        const points = [];

        for (let i = 0; i < segments * 2; i++) {

          let valueI = i > segments ? segments - (i - segments) : i;
          valueI = (valueI + drawCount) % segments;
          const value = dataArray[valueI];
          const radius = mapOntoRange(value / segments, 0, 1, radiusMin, radiusMax);

          points.push({
            x: centerX + (Math.sin(2 * Math.PI / (segments * 2) * i) * radius),
            y: centerY + (Math.cos(2 * Math.PI / (segments * 2) * i) * radius)
          });
        }

        // Draw the line back to the first point
        points.push(points[0]);

        return points;
      }

      const points = getPoints(dataArray, 100, 300, width / 2, height / 2, bufferLength);

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (i === 0) {
          canvasCtx.moveTo(point.x, point.y);
        } else {
          canvasCtx.lineTo(point.x, point.y);
        }
      }

      canvasCtx.stroke();

      drawCount++;
    },

  };
})();

const AudioVisualiserVisualsCircle3 = (function () {

  let startTime = Date.now();
  let spinSpeed = 1.0;

  return {

    draw: function (canvas, canvasCtx, bufferLength, dataArray) {
      const width = canvas.width;
      const height = canvas.height;
      const segments = bufferLength;

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const mapOntoRange = (value, inMin, inMax, outMin, outMax) => {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
      }

      const getPoints = (dataArray, radiusMin, radiusMax, centerX, centerY, segments) => {
        const points = [];

        for (let i = 0; i < segments * 2; i++) {

          let valueI = i > segments ? segments - (i - segments) : i;
          const value = dataArray[valueI];
          const radius = mapOntoRange(value / segments, 0, 1, radiusMin, radiusMax);

          let spinIncrement = (((Date.now() - startTime + 1) / 1000) * spinSpeed) % (2 * Math.PI);

          points.push({
            x: centerX + (Math.sin(2 * Math.PI / (segments * 2) * i + spinIncrement) * radius),
            y: centerY + (Math.cos(2 * Math.PI / (segments * 2) * i + spinIncrement) * radius)
          });
        }

        // Draw the line back to the first point
        points.push(points[0]);

        return points;
      }

      const points = getPoints(dataArray, 100, 300, width / 2, height / 2, segments);

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (i === 0) {
          canvasCtx.moveTo(point.x, point.y);
        } else {
          canvasCtx.lineTo(point.x, point.y);
        }
      }

      canvasCtx.stroke();

    },

  };
})();

const AudioVisualiserVisualsCircle4 = (function () {

  let startTime = Date.now();

  return {

    draw: function (canvas, canvasCtx, bufferLength, dataArray, options) {
      const width = canvas.width;
      const height = canvas.height;
      const segments = bufferLength;
      const spinSpeed = options?.spinSpeed || 1.0;
      const radiusModifier = options?.radiusModifier || 0.75;

      canvasCtx.lineWidth = options?.lineWidth || 2;
      canvasCtx.beginPath();

      const mapOntoRange = (value, inMin, inMax, outMin, outMax) => {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
      }

      const getPoints = (dataArray, radiusMin, radiusMax, centerX, centerY, segments) => {
        const points1 = [];
        const points2 = [];

        for (let i = 0; i < segments * 2; i++) {

          let valueI = i > segments ? segments - (i - segments) : i;
          const value = dataArray[valueI];
          const radius = mapOntoRange(value / segments, 0, 1, radiusMin, radiusMax);
          const radius2 = mapOntoRange(value / segments, 0, 1, radiusMin, (radiusMax - radiusMin) * radiusModifier + radiusMin);

          let spinIncrement = (((Date.now() - startTime + 1) / 1000) * spinSpeed) % (2 * Math.PI);

          points1.push({
            x: centerX + (Math.sin(2 * Math.PI / (segments * 2) * i + spinIncrement) * radius),
            y: centerY + (Math.cos(2 * Math.PI / (segments * 2) * i + spinIncrement) * radius)
          });

          points2.push({
            x: centerX + (Math.sin(2 * Math.PI / (segments * 2) * i + spinIncrement) * radius2),
            y: centerY + (Math.cos(2 * Math.PI / (segments * 2) * i + spinIncrement) * radius2)
          });
        }

        // Draw the line back to the first point
        points1.push(points1[0]);
        points2.push(points2[0]);

        return [points1, points2];
      }

      const getPrimaryLineColour = options?.getPrimaryLineColour || ((canvasCtx, width, height) => {
        return 'rgb(0, 0, 0)';
      })

      const getSecondLineColour = options?.getSecondLineColour || ((canvasCtx, width, height) => {
        // return '#aaa';
        // return '#00f9ff';

        // Create gradient
        const gradient = canvasCtx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop("0", "#ffafff");
        gradient.addColorStop("0.4", "#a9ffcc");
        gradient.addColorStop("0.5", "#00f9ff");
        gradient.addColorStop("0.6", "#ffa9c0");
        gradient.addColorStop("1.0", "#ffb1b1");
        return gradient;
      })

      const points = getPoints(
        dataArray,
        options?.radiusMin || 100,
        options?.radiusMax || 300,
        options?.getCenterX ? options?.getCenterX(width) : width / 2,
        options?.getCenterY ? options?.getCenterX(height) : height / 2,
        segments
      );

      canvasCtx.strokeStyle = getSecondLineColour(canvasCtx, width, height);

      for (let i = 0; i < points[1].length; i++) {
        const point = points[1][i];
        if (i === 0) {
          canvasCtx.moveTo(point.x, point.y);
        } else {
          canvasCtx.lineTo(point.x, point.y);
        }
      }

      canvasCtx.stroke();
      canvasCtx.strokeStyle = getPrimaryLineColour(canvasCtx, width, height);
      canvasCtx.beginPath();

      for (let i = 0; i < points[0].length; i++) {
        const point = points[0][i];
        if (i === 0) {
          canvasCtx.moveTo(point.x, point.y);
        } else {
          canvasCtx.lineTo(point.x, point.y);
        }
      }

      canvasCtx.stroke();

    },

  };
})();