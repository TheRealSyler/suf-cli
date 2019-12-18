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
      `--out: OUTPUT_FILE:Relative path to the output file with extension.
--dir: DIR:        Relative path to the input dir.
--name: NAME:       Header name.
--exclude: FILES:      Comma separated list of files to exclude, cannot be used with --include
--include: FILES:      Comma separated list of files to include, cannot be used with --exclude
-h: :           Displays this Message.`,
      ':',
      11,
      90
    )
  }
});
