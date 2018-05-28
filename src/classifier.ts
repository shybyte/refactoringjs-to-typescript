export type LabeledSong = [string, string[]];

interface NumberMap {
  [key: string]: number;
}

export class ClassifierBuilder {
  private songs: LabeledSong[] = [];
  private labelCounts: NumberMap = {};
  private labelProbabilities: NumberMap = {};
  private chordCountsInLabels: { [label: string]: NumberMap } = {};
  private probabilityOfChordsInLabels: { [label: string]: NumberMap } = {};

  public train(chords: string[], label: string) {
    this.songs.push([label, chords]);
    this.labelCounts[label] = (this.labelCounts[label] || 0) + 1;
  }

  public build() {
    this.setLabelProbabilities();
    this.setChordCountsInLabels();
    this.setProbabilityOfChordsInLabels();
    return new Classifier(this.labelProbabilities, this.probabilityOfChordsInLabels);
  }

  private setLabelProbabilities() {
    Object.keys(this.labelCounts).forEach((label) => {
      this.labelProbabilities[label] = this.labelCounts[label] / this.songs.length;
    });
  }

  private setChordCountsInLabels() {
    this.songs.forEach(([label, chords]) => {
      const chordCountsInLabel = this.chordCountsInLabels[label] || {};
      chords.forEach(j => {
        chordCountsInLabel[j] = (chordCountsInLabel[j] || 0) + 1;
      });
      this.chordCountsInLabels[label] = chordCountsInLabel;
    });
  }

  private setProbabilityOfChordsInLabels() {
    this.probabilityOfChordsInLabels = this.chordCountsInLabels;
    Object.keys(this.probabilityOfChordsInLabels).forEach(i => {
      Object.keys(this.probabilityOfChordsInLabels[i]).forEach(j => {
        this.probabilityOfChordsInLabels[i][j] =
          this.probabilityOfChordsInLabels[i][j] * 1.0 / this.songs.length;
      });
    });
  }
}

export class Classifier {
  constructor(private labelProbabilities: NumberMap,
              private probabilityOfChordsInLabels: { [label: string]: NumberMap }) {
  }

  public classify(chords: string[]) {
    const classified: NumberMap = {};
    Object.keys(this.labelProbabilities).forEach(obj => {
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
