const colors = [
  'white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'crimson',
  'cyan', 'magenta', 'lime', 'gold', 'aqua', 'teal', 'indigo', 'violet', 'coral',
  'salmon', 'chartreuse', 'turquoise', 'orchid', 'hotpink', 'steelblue', 'goldenrod',
  'maroon', 'navy', 'darkorange', 'darkgreen', 'darkblue', 'firebrick', 'olive',
  'deepskyblue', 'tomato', 'lightcoral', 'plum', 'springgreen', 'mediumvioletred',
  'royalblue', 'darkkhaki', 'mediumorchid', 'sienna', 'lightseagreen', 'dodgerblue',
  'forestgreen', 'slateblue', 'lawngreen', 'darkslategray', 'mediumaquamarine',
  'mediumseagreen', 'mediumpurple', 'darkred', 'slategray', 'darkorchid', 'lightpink'
];

const MAX_SIZE = 50;
const MIN_SIZE = 3;
const DEFAULT_SIZE = 24;
const DEFAULT_STAY_TIME = 250;
const DEFAULT_DECAY_TIME = 20000;
const MAX_RANDOM_ROTATION = 60;
const MIN_RANDOM_ROTATION = -60;

// function listFontFamilies() {
//   const fontFaces = [...document.fonts.values()];
//   const families = fontFaces.map(font => font.family);
//
//   // converted to set then to array to remove duplicates
//   return [...new Set(families)];
// }

const fonts = ['none'];

export class WordData {
  name: string;
  font: string;
  size: number;
  color: string;
  stayTime: number;
  decayTime: number;
  rotation: number;

  constructor(name: string, font: string | null, size: number | string | null, color: string | null, stayTime: number | null, decayTime: number | null, rotation: number | null) {
    this.name = name;
    if (font == "random") {
      this.font = fonts[Math.floor(Math.random() * fonts.length)];
    } else {
      this.font = font ?? "QuadSans";
    }
    if (size == "random") {
      this.size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
    } else if (typeof size === "number") {
      this.size = size;
    } else {
      this.size = DEFAULT_SIZE;
    }
    this.color = color ?? colors[Math.floor(Math.random() * colors.length)];
    this.stayTime = stayTime ?? DEFAULT_STAY_TIME;
    this.decayTime = decayTime ?? DEFAULT_DECAY_TIME;
    this.rotation = rotation ?? Math.random() * (MAX_RANDOM_ROTATION - MIN_RANDOM_ROTATION) + MIN_RANDOM_ROTATION;
  }
}

/**
  * Configures words visualization to render in the container, periodically consuming data from newWordsQueue to draw new words
  *
  * @param container container element for rendering the words into
  * @param newWordsQueue queue with new words data - this one is expected to be updated from the outside, since this component will periodically take new words from it and draw them
  */
export function setupWordsVisualization(container: HTMLElement, newWordsQueue: WordData[]) {
  // Function to create and animate a word
  function createWord(word: WordData) {
    const wordElement = document.createElement('div');
    wordElement.className = 'word';
    wordElement.textContent = word.name;

    // Random position within the container frame
    const x = Math.random() * container.clientWidth;
    const y = Math.random() * container.clientHeight;
    wordElement.style.left = `${x}px`;
    wordElement.style.top = `${y}px`;

    const rotation = word.rotation;
    wordElement.style.transform = `rotate(${rotation}deg)`;
    wordElement.style.fontFamily = word.font;

    wordElement.style.color = word.color;

    container.appendChild(wordElement);

    // Remove the word after the animation ends
    setTimeout(() => {
      container.removeChild(wordElement);
    }, word.decayTime);
  }

  // Process the newWordsQueue at a constant rate
  function processQueue() {
    if (newWordsQueue.length > 0) {
      const word = newWordsQueue.shift(); // Get the next word from the queue
      if (word) {
        createWord(word);
      }
    }
    setTimeout(processQueue, 20); // Process a word every 20ms
  }

  // Start processing the newWordsQueue
  processQueue();
}
