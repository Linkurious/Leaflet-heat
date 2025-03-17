// Mock canvas and its context
const mockCanvas = {
  getContext: () => ({
    // Add any canvas context methods you need
    fillRect: () => {},
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    fill: () => {},
    arc: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    width: 0,
    height: 0,
    style: {},
  }),
  width: 0,
  height: 0,
  style: {},
};

// Mock document
const mockDocument = {
  createElement: (tagName: string) => {
    if (tagName === "canvas") {
      return mockCanvas;
    }
    return {};
  },
  documentElement: {
    style: {
      transform: "",
      WebkitTransform: "",
      msTransform: "",
      transformOrigin: "",
      WebkitTransformOrigin: "",
      msTransformOrigin: "",
    },
  },
};

// Mock window
const mockWindow = {
  document: mockDocument,
  devicePixelRatio: 1,
};

// Replace global objects with mocks
(global as any).window = mockWindow;
(global as any).document = mockDocument;
