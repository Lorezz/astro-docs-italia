import { Image } from "@datocms/astro";
export default function ImageBlock({ record } ) {

  console.log(record?.image.responsiveImage);
  return <Image data={record?.image.responsiveImage} />
}
