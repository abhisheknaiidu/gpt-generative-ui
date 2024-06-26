import LoadingGIF from "@/assets/loading.gif";
import classNames from "classnames";
import { motion } from "framer-motion";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { Props } from "./tc.types";

const Image = (props: React.ComponentProps<typeof NextImage>) => {
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [imgSrc, setImgSrc] = useState<string | StaticImport | null>(null);

  useEffect(() => {
    const loadImageURL = async () => {
      if (typeof props.src === "string") {
        const res = await fetch(props.src);
        const data = await res.json();

        setImgSrc(data.url);
      } else {
        setImgSrc(props.src);
      }
    };
    loadImageURL();
  }, [props.src]);

  return (
    <>
      <NextImage
        {...props}
        src={LoadingGIF}
        className={classNames(
          props.className,
          "transition-all duration-500 ease-out",
          {
            invisible: !loaderVisible,
          }
        )}
      />
      {imgSrc && (
        <NextImage
          {...props}
          src={imgSrc}
          className={classNames(
            props.className,
            "transition-all duration-200 ease-out",
            {
              invisible: loaderVisible,
            }
          )}
          onLoad={() => setLoaderVisible(false)}
        />
      )}
    </>
  );
};

export const TopicCard1 = ({ title, description, image, size }: Props) => {
  return (
    <div
      className="bg-white p-3 rounded-3xl flex flex-col gap-0 sm:p-2.5"
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
      }}
    >
      <div
        className="w-full relative rounded-xl rounded-b-none overflow-hidden"
        style={{
          aspectRatio: "1792/1024",
        }}
      >
        <Image fill src={image} alt={title} objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        <p className="text-black absolute bottom-3 left-4 z-20 text-xl font-bold sm:bottom-1 sm:left-2 sm:text-lg">
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-3 p-3 sm:p-1.5 sm:gap-0">
        {description.map((desc, index) => (
          <p key={index} className="text-gray-500 text-sm sm:text-sm">
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

export const TopicCard2 = ({ title, description, image, size }: Props) => {
  return (
    <div
      className="bg-white p-3 rounded-3xl flex flex-col gap-0"
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
      }}
    >
      <div
        className="w-full relative rounded-xl rounded-b-none overflow-hidden"
        style={{
          aspectRatio: "1792/1024",
        }}
      >
        <Image fill src={image} alt={title} objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        <p className="text-black absolute bottom-4 right-4 z-20 text-xl font-bold text-right">
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-3 p-3">
        {description.map((desc, index) => (
          <p key={index} className="text-gray-500 text-sm">
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

export const TopicCard3 = ({ title, description, image, size }: Props) => {
  return (
    <div
      className="bg-white p-3 rounded-3xl flex flex-col gap-0"
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
      }}
    >
      <div
        className="w-full relative rounded-xl rounded-l-none overflow-hidden"
        style={{
          aspectRatio: "1792/1024",
        }}
      >
        <Image fill src={image} alt={title} objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white" />
        <p className="text-black absolute top-4 left-4 z-20 text-2xl font-bold text-left max-w-32">
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-3 p-3">
        {description.map((desc, index) => (
          <p key={index} className="text-gray-500 text-sm">
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

export const TopicCard4 = ({ title, description, image, size }: Props) => {
  return (
    <div
      className="bg-white p-3 rounded-3xl flex flex-col gap-0"
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
      }}
    >
      <div
        className="w-full relative rounded-xl rounded-r-none overflow-hidden"
        style={{
          aspectRatio: "1792/1024",
        }}
      >
        <Image fill src={image} alt={title} objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white" />
        <p className="text-black absolute top-4 right-4 z-20 text-2xl font-bold text-right max-w-[50%]">
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-3 p-3">
        {description.map((desc, index) => (
          <p key={index} className="text-gray-500 text-sm">
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

export const TopicCard5 = ({ title, description, image, size }: Props) => {
  // limit description to 3 lines
  description = description.slice(0, 3);
  return (
    <div
      className="bg-white p-3 rounded-3xl flex flex-row gap-0 sm:p-2.5"
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
      }}
    >
      <div
        className="h-full relative rounded-xl rounded-b-none overflow-hidden flex-shrink-0"
        style={{
          aspectRatio: "1024/1992",
        }}
      >
        <Image fill src={image} alt={title} objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        <p className="text-black absolute bottom-5 left-5 z-20 text-xl font-bold w-3/4 sm:bottom-2 sm:left-2 sm:text-lg">
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-5 px-4 py-2 sm:px-3 sm:py-1.5  sm:gap-2">
        {description.map((desc, index) => (
          <p key={index} className="text-gray-600 text-sm sm:text-sm">
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

export const TopicCard6 = ({ title, description, image, size }: Props) => {
  // limit description to 3 lines
  description = description.slice(0, 3);
  return (
    <div
      className="bg-white p-3 rounded-3xl flex flex-col sm:p-2.5 gap-0"
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
      }}
    >
      <div className="w-full grid grid-cols-2 gap-6 p-2 sm:p-0 sm:gap-3">
        <div
          className="w-full relative rounded-xl overflow-hidden"
          style={{
            aspectRatio: "1/1",
          }}
        >
          <Image fill src={image} alt={title} objectFit="cover" />
        </div>
        <p className="text-black text-2xl font-bold text-left mt-2 sm:text-lg">
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-5 p-3 sm:gap-2">
        {description.map((desc, index) => (
          <p key={index} className="text-gray-500 text-sm sm:text-sm">
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

export const TopicCard7 = ({ title, description, image, size }: Props) => {
  return (
    <div
      className="bg-white p-1 rounded-3xl flex flex-col gap-0"
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
      }}
    >
      <div className="w-full grid grid-cols-2 gap-6 p-4">
        <div
          className="w-full relative rounded-xl rounded-r-none overflow-hidden"
          style={{
            aspectRatio: "1/1",
          }}
        >
          <Image fill src={image} alt={title} objectFit="cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white" />
        </div>
        <p className="text-black text-2xl font-bold text-right mt-2 mr-4">
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-3 px-4">
        {description.map((desc, index) => (
          <p key={index} className="text-gray-500 text-sm">
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

export const TopicCard8 = ({ title, description, image, size }: Props) => {
  return (
    <div
      className="bg-white p-3 relative rounded-3xl flex flex-col gap-0"
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
      }}
    >
      <div
        className="w-full relative rounded-xl rounded-b-none overflow-hidden"
        style={{
          aspectRatio: "1/0.9",
        }}
      >
        <Image fill src={image} alt={title} objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffffffaa] to-white" />
      </div>
      <div className="absolute bottom-4 flex flex-col gap-3 p-3">
        <p className="text-black text-xl font-bold text-center">{title}</p>
        {description.map((desc, index) => (
          <p key={index} className="text-gray-500 text-sm">
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

export const TopicCard9 = ({ title, description, image, size }: Props) => {
  return (
    <div
      className="bg-white p-3 relative rounded-3xl flex flex-col gap-0 sm:p-2"
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
      }}
    >
      <div
        className="w-full relative rounded-xl rounded-t-none overflow-hidden"
        style={{
          aspectRatio: "1/1",
        }}
      >
        <Image fill src={image} alt={title} objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ffffffbb] to-white" />
      </div>
      <div className="absolute top-10 flex flex-col items-center gap-6 justify-center p-3 sm:top-6 sm:px-3 sm:py-2 sm:gap-3">
        <p className="text-black text-xl font-bold text-center sm:text-lg">
          {title}
        </p>
        {description.map((desc, index) => (
          <p
            key={index}
            className="text-gray-500 text-sm text-center sm:text-sm"
          >
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

const CardMappingBasedOnImageDimensions: {
  [key: string]: ((props: Props) => JSX.Element)[];
} = {
  "1792x1024": [TopicCard1, TopicCard2, TopicCard3, TopicCard4],
  "1024x1792": [TopicCard5],
  "512x512": [TopicCard6, TopicCard7],
  "1024x1024": [TopicCard9, TopicCard8],
};

export const TopicCard = ({
  cardType,
  cardIndex,
  cardProps,
}: {
  cardType: keyof typeof CardMappingBasedOnImageDimensions;
  cardIndex: number;
  cardProps: {
    title: string;
    description: string[];
    image: {
      prompt: string;
      size: string;
    };
    size: number;
  };
}) => {
  cardProps.description = cardProps.description.slice(0, 4);
  const Card =
    CardMappingBasedOnImageDimensions[cardType][
      cardIndex % CardMappingBasedOnImageDimensions[cardType].length
    ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          title={cardProps.title}
          description={cardProps.description}
          image={`/api/image?prompt=${encodeURIComponent(
            cardProps.image.prompt
          )}&size=${encodeURIComponent(cardProps.image.size)}`}
          size={cardProps.size}
        />
      </motion.div>
    </>
  );
};

export default TopicCard;
