import "./PictureCropper.css";

import { Button } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

interface PictureCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImage: string) => void;
  hideSelf: () => void;
}

const PictureCropper: React.FC<PictureCropperProps> = ({
  imageUrl,
  onCropComplete,
  hideSelf,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = async (imageSrc: string, crop: Area) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedImageURL = URL.createObjectURL(blob);
          resolve(croppedImageURL);
        }
      }, "image/png");
    });
  };

  const handleCropClick = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await createImage(imageUrl, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    }
  };

  return (
    <div className="picture-crop-container">
      <div className="crop-container">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          zoomWithScroll={true}
          minZoom={1}
          maxZoom={3}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>
      <br />
      <div>
        <Button
          size="lg"
          variant="outline"
          className="button-secondary-style picture-crop-button"
          onClick={() => {
            handleCropClick();
            hideSelf();
          }}
        >
          Bild zuschneiden
        </Button>
      </div>
    </div>
  );
};

export default PictureCropper;
