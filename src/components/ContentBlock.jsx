import React from 'react';
import { StructuredText, Image } from 'react-datocms';

export default function ContentBlock({ content } ) {
  return (<div>
      <StructuredText data={content}
       renderBlock={({ record }) => {
          switch (record.__typename) {
            case 'ImageBlockRecord':
              return (
               <div>
                 <Image data={record.image.responsiveImage} />
               </div>
              );
            default:
              return <div>:D</div>;
          }
        }}/>
  </div>)
}
