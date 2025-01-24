import thumbnail000 from './000-hello-world/thumbnail.png';
import thumbnail001 from './001-subdivision/thumbnail.png';

const sketches = [
  {
    id: '000-hello-world',
    thumbnail: thumbnail000,
    load: () => import('./000-hello-world/index.js')
  },
  {
    id: '001-subdivision',
    thumbnail: thumbnail001,
    load: () => import('./001-subdivision/index.js')
  }
];

export { sketches };