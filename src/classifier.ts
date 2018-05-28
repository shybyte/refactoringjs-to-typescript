export type LabeledSong = [string, string[]];

interface LabelNumberMap {
  [label: string]: number;
}

export class ClassifierBuilder {
  private songCount = 0;
  private labelCounts: LabelNumberMap = {};
  private chordCountsInLabels: { [label: string]: LabelNumberMap } = {};

  public train(chords: string[], label: string) {
    this.songCount += 1;

    this.labelCounts[label] = (this.labelCounts[label] || 0) + 1;

    const chordCountsInLabel = this.chordCountsInLabels[label] || {};
    chords.forEach(j => {
      chordCountsInLabel[j] = (chordCountsInLabel[j] || 0) + 1;
    });
    this.chordCountsInLabels[label] = chordCountsInLabel;
  }

  public build() {
    const labelProbabilities: LabelNumberMap = {};
    Object.keys(this.labelCounts).forEach((label) => {
      labelProbabilities[label] = this.labelCounts[label] / this.songCount;
    });

    const probabilityOfChordsInLabels: { [label: string]: LabelNumberMap } = {};
    Object.keys(this.chordCountsInLabels).forEach(label => {
      probabilityOfChordsInLabels[label] = {};
      Object.keys(this.chordCountsInLabels[label]).forEach(chord => {
        probabilityOfChordsInLabels[label][chord] = this.chordCountsInLabels[label][chord] / this.songCount;
      });
    });

    return new Classifier(labelProbabilities, probabilityOfChordsInLabels);
  }
}

export class Classifier {
  constructor(private labelProbabilities: LabelNumberMap,
              private probabilityOfChordsInLabels: { [label: string]: LabelNumberMap }) {
  }

  public classify(chords: string[]) {
    const probabilityOfLabels: LabelNumberMap = {};
    Object.keys(this.labelProbabilities).forEach(label => {
      probabilityOfLabels[label] = chords
        .map(chord => this.probabilityOfChordsInLabels[label][chord])
        .filter(chordProb => chordProb !== undefined) // TODO: Ignore undefined?
        .reduce((probProduct, chordProb) => probProduct * (chordProb + 1.01), this.labelProbabilities[label] + 1.01);
    });
    return probabilityOfLabels;
  }
}
