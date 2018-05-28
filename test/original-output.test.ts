import {assert} from 'chai';
import {Classifier, ClassifierBuilder} from '../src/classifier';
import {labeledSongs} from '../src/training-data';

describe('original output', () => {
  let classifier: Classifier;

  before(() => {
    const classifierBuilder = new ClassifierBuilder();
    labeledSongs.forEach(([label, song]) => classifierBuilder.train(song, label));
    classifier = classifierBuilder.build();
  });

  it('classifies example 1', () => {
    assert.deepEqual(classifier.classify(['d', 'g', 'e', 'dm']), {
      easy: 2.023094827160494,
      medium: 1.855758613168724,
      hard: 1.855758613168724,
    });
  });

  it('classifies example 2', () => {
    assert.deepEqual(classifier.classify(['f#m7', 'a', 'dadd9', 'dmaj7', 'bm', 'bm7', 'd', 'f#m']), {
      easy: 1.3433333333333333,
      medium: 1.5060259259259259,
      hard: 1.6884223991769547,
    });
  });
});
