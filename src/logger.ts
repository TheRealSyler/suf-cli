import { Logger, LoggerType, PresetNodeHelp } from '@sorg/log';
export const colors = {
  info: '#f64',
  yellow: '#fc2',
  blue: '#08f',
  gray: '#aaa',
  error: '#f00'
};
export const logger = new Logger<{
  info: LoggerType;
  error: LoggerType;
  help: LoggerType;
}>({
  info: {
    styles: [colors.info, colors.yellow]
  },
  error: {
    styles: [{ color: colors.error, bold: true }]
  },
  help: {
    styles: [
      { color: '#72a', background: '#111' },
      { color: '#f23', background: '#222' },
      { color: '#2af', background: '#222' }
    ],
    preset: new PresetNodeHelp(
      `INFO: All arguments can start with - or --, but i would recommend to just use letters.
a | all: Calls all modules.
b | badges: Calls the badges module.
t | ts | d.ts | docs: Calls the tsDoc module.
l | licence: Calls the license module.
h | help: Displays this Message.`,
      ':',
      25,
      90
    )
  }
});
