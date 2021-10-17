const getW = (size: string) => Number(size.split('x')[0]);

const getH = (size: string) => Number(size.split('x')[1]);

const isPortrait = (size: string) => getH(size) > getW(size);

export { getW, getH, isPortrait };
