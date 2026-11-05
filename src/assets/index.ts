export const icons = {
  // menu: require('./menu.png'),
  // search: require('./search.png'),
  more: require('./icons/more.png'),
  // plus: require('./plus.png'),
  file: require('./icons/file.png'),
  back: require('./icons/back.png'),
 alignLeft: require('./icons/align-left.png'),
  alignCenter: require('./icons/align-center.png'),
  alignRight: require('./icons/align-right.png'),
  alignJustify: require('./icons/align-justify.png'),
} as const;

export type IconName = keyof typeof icons;