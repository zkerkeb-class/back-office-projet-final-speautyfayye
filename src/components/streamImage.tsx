'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Text from './textLocale';

interface IProps {
  imageId?: string;
  customClasses?: string;
  thumbnail?: boolean;
  width?: number;
  height?: number;
  size: 200 | 400 | 800;
  alt?: string;
  locale?: string;
}

export default function StreamImage(props: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (props.imageId) {
      let imageUrl = '';

      const fetchImageStream = async () => {
        try {
          const url = `${process.env.NEXT_PUBLIC_URL_API}file/${props.imageId}/${props.size}/webp`;

          const response = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          // if (!response.ok || response.status === 204) {
          //   throw new Error('Failed to fetch the image stream');
          // }
          const blob = await response.blob();
          imageUrl = URL.createObjectURL(blob);
          setImageSrc(imageUrl);
        } finally {
          setIsLoading(false);
        }
      };

      fetchImageStream();

      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    }
    setIsLoading(false);
  }, [props.imageId, props.thumbnail, props.size]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : props.imageId && imageSrc ? (
        <Image
          className={`${props.customClasses ? props.customClasses : ''} h-full w-full`}
          src={imageSrc}
          alt={props.alt ?? 'Image'}
          width={props.width ? props.width : 100}
          height={props.height ? props.height : 100}
        />
      ) : (
        <Text locale={props.locale || 'fr'} text="global.noImage" />
      )}
    </>
  );
}
