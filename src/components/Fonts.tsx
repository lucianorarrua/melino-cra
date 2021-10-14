import { Global } from '@emotion/react';
const Fonts = () => (
  <Global
    styles={`
    @font-face {
      font-family: 'Proxima Nova';
      font-weight: 300;
      font-display: swap;
      font-style: light;
      src: url(${process.env.PUBLIC_URL}/fonts/proxima-nova/proximanova-light.woff2)
          format('woff2'),
        url(${process.env.PUBLIC_URL}/fonts/proxima-nova/proximanova-light.woff)
          format('woff'),
        url(${process.env.PUBLIC_URL}/fonts/proxima-nova/proximanova-light.ttf)
          format('truetype');
    }
    @font-face {
      font-family: 'Proxima Nova';
      font-weight: 400;
      font-display: swap;
      font-style: normal;
      src: url(${process.env.PUBLIC_URL}/fonts/proxima-nova/proximanova-regular.woff2)
          format('woff2'),
        url(${process.env.PUBLIC_URL}/fonts/proxima-nova/proximanova-regular.woff)
          format('woff'),
        url(${process.env.PUBLIC_URL}/fonts/proxima-nova/proximanova-regular.ttf)
          format('truetype');
    }
    @font-face {
      font-family: 'Proxima Nova';
      font-weight: 600;
      font-display: swap;
      font-style: bold;
      src: url(${process.env.PUBLIC_URL}/fonts/proxima-nova/proximanova-semibold.woff2)
          format('woff2'),
        url(${process.env.PUBLIC_URL}/fonts/proxima-nova/proximanova-semibold.woff)
          format('woff'),
        url(${process.env.PUBLIC_URL}/fonts/proxima-nova/proximanova-semibold.ttf)
          format('truetype');
    }
      `}
  />
);
export default Fonts;
