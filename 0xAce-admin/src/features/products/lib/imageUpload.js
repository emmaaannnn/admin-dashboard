const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

export const PRODUCT_IMAGE_MAX_BYTES = 500 * 1024;
export const PRODUCT_IMAGE_MAX_DIMENSION = 1400;

function getMimeType(file) {
  if (file?.type && SUPPORTED_IMAGE_TYPES.has(file.type)) {
    return file.type;
  }

  const fileName = file?.name?.toLowerCase() ?? "";

  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (fileName.endsWith(".png")) {
    return "image/png";
  }

  return "";
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to prepare the optimized image preview."));
    reader.readAsDataURL(blob);
  });
}

function loadImageElement(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load the selected image."));
    image.src = source;
  });
}

async function loadRasterImage(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fallback to HTMLImageElement below.
    }
  }

  const source = await fileToDataUrl(file);
  return loadImageElement(source);
}

function drawToCanvas(image, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: true });

  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  context.drawImage(image, 0, 0, width, height);

  return canvas;
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to encode the optimized image."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality
    );
  });
}

function getTargetDimensions(width, height, maxDimension) {
  const longestEdge = Math.max(width, height);

  if (longestEdge <= maxDimension) {
    return {
      width,
      height,
    };
  }

  const scale = maxDimension / longestEdge;

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function getOutputName(fileName) {
  const sanitizedName = fileName?.trim() || "product-image";
  return sanitizedName.replace(/\.[^.]+$/, "") + ".webp";
}

export async function optimizeProductImage(file, options = {}) {
  const maxBytes = options.maxBytes ?? PRODUCT_IMAGE_MAX_BYTES;
  const maxDimension = options.maxDimension ?? PRODUCT_IMAGE_MAX_DIMENSION;
  const mimeType = getMimeType(file);

  if (!mimeType) {
    throw new Error("Only PNG, JPG, and JPEG images are supported.");
  }

  const image = await loadRasterImage(file);
  const naturalWidth = image.width ?? image.naturalWidth;
  const naturalHeight = image.height ?? image.naturalHeight;

  if (!naturalWidth || !naturalHeight) {
    throw new Error("Unable to determine the image dimensions.");
  }

  let { width, height } = getTargetDimensions(naturalWidth, naturalHeight, maxDimension);
  let bestBlob = null;
  const qualitySteps = [0.82, 0.76, 0.7, 0.64, 0.58, 0.52, 0.46];

  while (width >= 240 && height >= 240) {
    const canvas = drawToCanvas(image, width, height);

    for (const quality of qualitySteps) {
      const nextBlob = await canvasToBlob(canvas, quality);

      if (!bestBlob || nextBlob.size < bestBlob.size) {
        bestBlob = nextBlob;
      }

      if (nextBlob.size <= maxBytes) {
        const previewUrl = await blobToDataUrl(nextBlob);

        return {
          fileName: getOutputName(file.name),
          mimeType: "image/webp",
          fileSize: nextBlob.size,
          width,
          height,
          previewUrl,
        };
      }
    }

    width = Math.max(1, Math.round(width * 0.85));
    height = Math.max(1, Math.round(height * 0.85));
  }

  if (bestBlob) {
    throw new Error(
      `This image could not be reduced under ${Math.round(maxBytes / 1024)} KB. Try a smaller source image.`
    );
  }

  throw new Error("Unable to optimize the selected image.");
}