// theme.ts
// 1. import `extendTheme` function
import { extendTheme, ThemeConfig } from '@chakra-ui/react';
// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors: any = {
  meli: {
    50: '#fdffdc',
    100: '#ffffaf',
    200: '#fff87e',
    300: '#fff159',
    400: '#fffb1f',
    500: '#dce608',
    600: '#9fb300',
    700: '#698000',
    800: '#3a4d00',
    900: '#151b00',
  },
  gray: {
    meli: '#ededed',
  },
};
// 3. extend the theme
const theme = extendTheme({ config, colors });
export default theme;
