export type LabeledSong = [string, string[]];

interface NumberMap {
  [key: string]: number;
}

export class Classifier {
  private songs: LabeledSong[] = [];
  private labels: string[] = [];
  private allChords: string[] = [];
  private labelCounts: NumberMap = {};
  private labelProbabilities: NumberMap = {};
  private chordCountsInLabels: { [label: string]: NumberMap } = {};
  private probabilityOfChordsInLabels: { [label: string]: NumberMap } = {};


  train(chords: string[], label: string) {
    this.songs.push([label, chords]);
    this.labels.push(label);
    for (const chord of chords) {
      if (!this.allChords.includes(chord)) {
        this.allChords.push(chord);
      }
    }
    if (!!(Object.keys(this.labelCounts).includes(label))) {
      this.labelCounts[label] = this.labelCounts[label] + 1;
    } else {
      this.labelCounts[label] = 1;
    }
  }

  getNumberOfSongs() {
    return this.songs.length;
  }

  setLabelProbabilities() {
    Object.keys(this.labelCounts).forEach((label) => {
      const numberOfSongs = this.getNumberOfSongs();
      this.labelProbabilities[label] = this.labelCounts[label] / numberOfSongs;
    });
  }

  setChordCountsInLabels() {
    this.songs.forEach(i => {
      if (this.chordCountsInLabels[i[0]] === undefined) {
        this.chordCountsInLabels[i[0]] = {};
      }
      i[1].forEach(j => {
        if (this.chordCountsInLabels[i[0]][j] > 0) {
          this.chordCountsInLabels[i[0]][j] =
            this.chordCountsInLabels[i[0]][j] + 1;
        } else {
          this.chordCountsInLabels[i[0]][j] = 1;
        }
      });
    });
  }

  setProbabilityOfChordsInLabels() {
    this.probabilityOfChordsInLabels = this.chordCountsInLabels;
    Object.keys(this.probabilityOfChordsInLabels).forEach(i => {
      Object.keys(this.probabilityOfChordsInLabels[i]).forEach(j => {
        this.probabilityOfChordsInLabels[i][j] =
          this.probabilityOfChordsInLabels[i][j] * 1.0 / this.songs.length;
      });
    });
  }


  makeReady() {
    this.setLabelProbabilities();
    this.setChordCountsInLabels();
    this.setProbabilityOfChordsInLabels();
  }

  classify(chords: string[]) {
    const ttal = this.labelProbabilities;
    // console.log(ttal);
    const classified: NumberMap = {};
    Object.keys(ttal).forEach(obj => {
      let first = this.labelProbabilities[obj] + 1.01;
      chords.forEach(chord => {
        const probabilityOfChordInLabel = this.probabilityOfChordsInLabels[obj][chord];
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

}
