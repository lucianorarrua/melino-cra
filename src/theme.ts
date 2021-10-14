// theme.ts
// 1. import `extendTheme` function
import { extendTheme, ThemeConfig } from '@chakra-ui/react';
// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors: any = {
  yellow: {
    meli: '#fff159',
  },
  gray: {
    meli: '#ededed',
  },
};

const fonts: any = {
  heading: 'Proxima Nova',
  body: 'Proxima Nova',
};

// 3. extend the theme
const theme = extendTheme({ config, colors, fonts });
export default theme;
