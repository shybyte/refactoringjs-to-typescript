export type LabeledSong = [string, string[]];

interface NumberMap {
  [key: string]: number;
}

export class Classifier {
  private songs: LabeledSong[] = [];
  private labelCounts: NumberMap = {};
  private labelProbabilities: NumberMap = {};
  private chordCountsInLabels: { [label: string]: NumberMap } = {};
  private probabilityOfChordsInLabels: { [label: string]: NumberMap } = {};

  public train(chords: string[], label: string) {
    this.songs.push([label, chords]);
    if (!!(Object.keys(this.labelCounts).includes(label))) {
      this.labelCounts[label] = this.labelCounts[label] + 1;
    } else {
      this.labelCounts[label] = 1;
    }
  }

  public makeReady() {
    this.setLabelProbabilities();
    this.setChordCountsInLabels();
    this.setProbabilityOfChordsInLabels();
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

  private setLabelProbabilities() {
    Object.keys(this.labelCounts).forEach((label) => {
      this.labelProbabilities[label] = this.labelCounts[label] / this.songs.length;
    });
  }

  private setChordCountsInLabels() {
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
