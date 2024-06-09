import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";

const ImageWithFallback = ({
  fallbackSrc,
  ...props
}: {
  fallbackSrc: string | StaticImageData;
} & React.ComponentProps<typeof Image>) => {
  const [imgSrc, setImgSrc] = useState(props.src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={props.alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
