'use client';
import Image from "next/image";

interface Props {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  width: number;
  height: number;
  style?:React.StyleHTMLAttributes<HTMLImageElement>['style'];
  onMouseEnter?: React.MouseEventHandler<HTMLImageElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLImageElement>;
}


export const ProductImage = ({src,alt,className,width,height,style, onMouseEnter,onMouseLeave}:Props) => {
  const localSrc = (src) ? src.startsWith('http') ? src : `/products/${src}` : '/imgs/placeholder.jpg'

  return (
    <Image src={localSrc} width={width} style={style} height={height} alt={alt} className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
  )
}
