// songs
import {LabeledSong} from './classifier';

const imagine = ['c', 'cmaj7', 'f', 'am', 'dm', 'g', 'e7'];
const somewhereOverTheRainbow = ['c', 'em', 'f', 'g', 'am'];
const tooManyCooks = ['c', 'g', 'f'];
const iWillFollowYouIntoTheDark = ['f', 'dm', 'bb', 'c', 'a', 'bbm'];
const babyOneMoreTime = ['cm', 'g', 'bb', 'eb', 'fm', 'ab'];
const creep = ['g', 'gsus4', 'b', 'bsus4', 'c', 'cmsus4', 'cm6'];
const paperBag = ['bm7', 'e', 'c', 'g', 'b7', 'f', 'em', 'a', 'cmaj7', 'em7', 'a7', 'f7', 'b'];
const toxic = ['cm', 'eb', 'g', 'cdim', 'eb7', 'd7', 'db7', 'ab', 'gmaj7', 'g7'];
const bulletproof = ['d#m', 'g#', 'b', 'f#', 'g#m', 'c#'];

export const labeledSongs: LabeledSong[] = [
  ['easy',imagine],
  ['easy',somewhereOverTheRainbow],
  ['easy',tooManyCooks],
  ['medium',iWillFollowYouIntoTheDark],
  ['medium',babyOneMoreTime],
  ['medium',creep],
  ['hard',paperBag],
  ['hard',toxic],
  ['hard',bulletproof],
];