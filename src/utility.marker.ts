import { existsSync, readFileSync } from 'fs';

type Marker = {
  marker: string;
  regex: RegExp;
};

export const insertionMarker: Marker = {
  marker: 'SUF_CLI_DOC_INSERTION_MARKER',
  regex: /SUF_CLI_DOC_INSERTION_MARKER/g,
};

interface MarkerTypes {
  tsDoc: Marker;
  badges: Marker;
  license: Marker;
}

const Markers: MarkerTypes = {
  tsDoc: {
    regex: /<span id="DOC_GENERATION_MARKER_0"><\/span>[\S\s]*<span id="DOC_GENERATION_MARKER_1"><\/span>/,
    marker:
      '<span id="DOC_GENERATION_MARKER_0"></span>\n__INSERT_GENERATED__\n_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**\n<span id="DOC_GENERATION_MARKER_1"></span>',
  },
  badges: {
    regex: /<span id="BADGE_GENERATION_MARKER_0"><\/span>[\S\s]*<span id="BADGE_GENERATION_MARKER_1"><\/span>/,
    marker:
      '<span id="BADGE_GENERATION_MARKER_0"></span>\n__INSERT_GENERATED__\n<span id="BADGE_GENERATION_MARKER_1"></span>',
  },
  license: {
    regex: /<span id="LICENSE_GENERATION_MARKER_0"><\/span>[\S\s]*<span id="LICENSE_GENERATION_MARKER_1"><\/span>/,
    marker:
      '<span id="LICENSE_GENERATION_MARKER_0"></span>\n__INSERT_GENERATED__\n<span id="LICENSE_GENERATION_MARKER_1"></span>',
  },
};

export function readFileAndAddMarker(file: string, type: keyof MarkerTypes) {
  let input = insertionMarker.marker;
  if (existsSync(file)) {
    const inputFile = readFileSync(file).toString();
    input = inputFile.replace(Markers[type].regex, insertionMarker.marker);
    if (!insertionMarker.regex.test(input)) {
      input += `\n${insertionMarker.marker}`;
    }
  }
  return input;
}

export function insertGenerated(generatedText: string, type: keyof MarkerTypes) {
  return Markers[type].marker.replace(/__INSERT_GENERATED__/, generatedText);
}
