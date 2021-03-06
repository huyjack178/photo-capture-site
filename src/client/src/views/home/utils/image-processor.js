import moment from 'moment';

export default class ImageProcessor {
  processImage = (imageFile, imageMaxSizes, callbackImageElement, callBackImageFile) => {
    const reader = new FileReader();
    reader.onload = async readerEvent => {
      const imageElement = new Image();

      imageElement.onload = () => {
        const lowImage = resizeImage(imageElement, imageMaxSizes.low, false);
        const highImage = resizeImage(imageElement, imageMaxSizes.high, true);
        callBackImageFile(lowImage.blog, highImage.blog);

        const image = new Image();
        image.src = lowImage.dataUrl;
        callbackImageElement(image);
      };

      imageElement.src = readerEvent.target.result;
    };

    reader.readAsDataURL(imageFile);
  };
}

const resizeImage = (imageElement, maxSize, isHigh) => {
  const canvas = generateCanvas(imageElement, maxSize);
  writeTextOnCanvas(canvas, isHigh, imageElement);
  const dataUrl = canvas.toDataURL('image/jpeg');
  const blog = dataURLToBlob(dataUrl);

  return { blog, dataUrl };
};

const generateCanvas = (imageElement, maxSize) => {
  const canvas = document.createElement('canvas');

  let width = imageElement.width;
  let height = imageElement.height;

  if (width > height) {
    if (width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }
  }

  canvas.width = width;
  canvas.height = height;

  return canvas;
};

const writeTextOnCanvas = (canvas, isHigh, imageElement) => {
  const ctx = canvas.getContext('2d');
  let fontSize;
  const isLandscape = canvas.width > canvas.height;

  if (isMobile()) {
    if (isHigh) {
      fontSize = isLandscape ? 7 : 15;
    } else {
      fontSize = isLandscape ? 3 : 6;
    }
  } else {
    if (isHigh) {
      fontSize = isLandscape ? 2 : 5;
    } else {
      fontSize = isLandscape ? 1 : 2;
    }
  }

  const textY = isHigh ? 120 : 50;
  const textX = isHigh ? 100 : 50;
  ctx.font = `bold ${fontSize}vw Courier`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ab240c';
  const text = moment().format('YYYY.MM.DD HH:mm');
  ctx.fillText(text, canvas.width - (ctx.measureText(text).width + textX), canvas.height - textY);
};

const dataURLToBlob = dataURL => {
  const BASE64_MARKER = ';base64,';

  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = parts[1];

    return new Blob([raw], { type: contentType });
  }

  parts = dataURL.split(BASE64_MARKER);
  contentType = parts[0].split(':')[1];
  raw = window.atob(parts[1]);
  const rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};
