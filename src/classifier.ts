export type LabeledSong = [string, string[]];

interface NumberMap {
  [key: string]: number;
}

const songs: LabeledSong[] = [];
const labels: string[] = [];
const allChords: string[] = [];
const labelCounts: NumberMap = {};
const labelProbabilities: NumberMap = {};
const chordCountsInLabels: { [label: string]: NumberMap } = {};
let probabilityOfChordsInLabels: { [label: string]: NumberMap } = {};

export function train(chords: string[], label: string) {
  songs.push([label, chords]);
  labels.push(label);
  for (const chord of chords) {
    if (!allChords.includes(chord)) {
      allChords.push(chord);
    }
  }
  if (!!(Object.keys(labelCounts).includes(label))) {
    labelCounts[label] = labelCounts[label] + 1;
  } else {
    labelCounts[label] = 1;
  }
}

function getNumberOfSongs() {
  return songs.length;
}

function setLabelProbabilities() {
  Object.keys(labelCounts).forEach((label) => {
    const numberOfSongs = getNumberOfSongs();
    labelProbabilities[label] = labelCounts[label] / numberOfSongs;
  });
}

function setChordCountsInLabels() {
  songs.forEach(i => {
    if (chordCountsInLabels[i[0]] === undefined) {
      chordCountsInLabels[i[0]] = {};
    }
    i[1].forEach(j => {
      if (chordCountsInLabels[i[0]][j] > 0) {
        chordCountsInLabels[i[0]][j] =
          chordCountsInLabels[i[0]][j] + 1;
      } else {
        chordCountsInLabels[i[0]][j] = 1;
      }
    });
  });
}

function setProbabilityOfChordsInLabels() {
  probabilityOfChordsInLabels = chordCountsInLabels;
  Object.keys(probabilityOfChordsInLabels).forEach(i => {
    Object.keys(probabilityOfChordsInLabels[i]).forEach(j => {
      probabilityOfChordsInLabels[i][j] =
        probabilityOfChordsInLabels[i][j] * 1.0 / songs.length;
    });
  });
}


export function makeReady() {
  setLabelProbabilities();
  setChordCountsInLabels();
  setProbabilityOfChordsInLabels();
}

export function classify(chords: string[]) {
  const ttal = labelProbabilities;
  // console.log(ttal);
  const classified: NumberMap = {};
  Object.keys(ttal).forEach(obj => {
    let first = labelProbabilities[obj] + 1.01;
    chords.forEach(chord => {
      const probabilityOfChordInLabel =
        probabilityOfChordsInLabels[obj][chord];
      if (probabilityOfChordInLabel === undefined) {
        // TODO: Why ?
        // first + 1.01;
      } else {
        first = first * (probabilityOfChordInLabel + 1.01);
      }
    });
    classified[obj] = first;
  });
  return classified;
}
