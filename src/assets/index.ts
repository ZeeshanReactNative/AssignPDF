export const icons = {
  menu: require('./icons/menu.png'),
  logo: require('./icons/logo.png'),
  more: require('./icons/more.png'),
  plus: require('./icons/plus.png'),
  file: require('./icons/file.png'),
  filepdf: require('./icons/file-pdf.png'),
  back: require('./icons/back.png'),
 alignLeft: require('./icons/align-left.png'),
  alignCenter: require('./icons/align-center.png'),
  alignRight: require('./icons/align-right.png'),
  alignJustify: require('./icons/align-justify.png'),
} as const;

export type IconName = keyof typeof icons;