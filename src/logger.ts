import { Log, styler } from '@sorg/log';

export const colors = {
  info: '#f64',
  yellow: '#fc2',
  blue: '#08f',
  gray: '#aaa',
  error: '#f00'
};

const loggers = {
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
    ]
  }
};

const nodeHelpMessage = (preset: any, data: any) => {
  if (preset.text) {
    const lines = preset.text.split(/\n/g);
    preset.text = undefined;
    let output = '';
    output += nodeHelpMessage(preset, {
      ...data,
      rawMessages: ['\n ', ' ']
    });
    for (const line of lines) {
      output += nodeHelpMessage(preset, {
        ...data,
        rawMessages: '\n'.concat(line).split(preset.splitter)
      });
    }
    output += nodeHelpMessage(preset, {
      ...data,
      rawMessages: ['\n ', '']
    });
    return output.replace(/^\n/, '');
  } else {
    const messages = [];
    for (let i = 0; i < data.rawMessages.length; i++) {
      messages.push({ message: data.rawMessages[i] });
    }

    const lastIndex = messages.length - 1;
    if (messages.length > 1) {
      const space = preset.firstColumnWidth - messages[0].message.length;
      if (space >= 0) {
        messages[0].message = messages[0].message
          .replace(/^(\n)?/, '$1 ')
          .concat(' '.repeat(space));
      }

      let concatenatedMessages: string = '';
      for (let i = 1; i < messages.length; i++) {
        concatenatedMessages += messages[i].message;
      }
      const endingSpace =
        preset.secondColumnWidth - (concatenatedMessages.length + (messages.length - 1) * 2);
      if (endingSpace >= 0) {
        messages[lastIndex].message = messages[lastIndex].message.concat(' '.repeat(endingSpace));
      }
    }
    let output = '';
    for (let i = 0; i < messages.length; i++) {
      messages[i].message = messages[i].message.replace(/^(\n)?/, '$1 ');
      output += styler(messages[i].message.concat('  '), data.styles[i]);
    }
    return output;
  }
};

export const logger = {
  Log: (type: keyof typeof loggers, ...messages: string[]) => {
    if (type !== 'help') {
      Log(...messages.map((msg, i) => styler(msg, loggers[type].styles[i])));
    } else {
      console.log(
        nodeHelpMessage(
          {
            text: `    INFO: All arguments can start with - or --, but i would recommend to just use letters.
    a | all: Calls all modules.
    b | badges: Calls the badges module.
    t | ts | d.ts | docs: Calls the tsDoc module.
    l | licence: Calls the license module.
    h | help: Displays this Message.`,
            splitter: ':',
            firstColumnWidth: 25,
            secondColumnWidth: 90
          },
          {
            styles: [
              { color: '#72a', background: '#111' },
              { color: '#f23', background: '#222' },
              { color: '#2af', background: '#222' }
            ],
            rawMessages: []
          }
        )
      );
    }
  }
};
