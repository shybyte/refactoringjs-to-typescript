import {assert} from 'chai';
import {classify, makeReady, train} from '../src/classifier';
import {labeledSongs} from '../src/training-data';

describe('original output', () => {
  before(() => {
    labeledSongs.forEach(([label, song]) => train(song, label));
    makeReady();
  })

  it('classifies example 1', () => {
    assert.deepEqual(classify(['d', 'g', 'e', 'dm']), {
      easy: 2.023094827160494,
      medium: 1.855758613168724,
      hard: 1.855758613168724,
    });
  });

  it('classifies example 2', () => {
    assert.deepEqual(classify(['f#m7', 'a', 'dadd9', 'dmaj7', 'bm', 'bm7', 'd', 'f#m']), {
      easy: 1.3433333333333333,
      medium: 1.5060259259259259,
      hard: 1.6884223991769547,
    });
  });
});
