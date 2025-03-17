// Mock canvas and its context
const mockCanvas = {
  getContext: () => ({
    // Add any canvas context methods you need
    fillRect: () => {},
    clearRect: () => {},
    beginPath: () => {},
    closePath: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
    getImageData: () => ({
      data: new Uint8ClampedArray(0),
    }),
    putImageData: () => {},
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

const mockElement = (tagName: string) => {
  return {
    style: {
      transform: "",
      WebkitTransform: "",
      msTransform: "",
      transformOrigin: "",
      WebkitTransformOrigin: "",
      msTransformOrigin: "",
      position: "",
      left: "",
      top: "",
      width: "",
      height: "",
    },
    appendChild: (child: any) => {},
    insertBefore: (child: any, ref: any) => {},
    removeChild: (child: any) => {},
    className: "",
    addEventListener: (type: string, listener: Function) => {},
    removeEventListener: (type: string, listener: Function) => {},
    getElementById: (id: string) => mockElement(id),
    getAttribute: (attr: string) => "",
    setAttribute: (attr: string, value: string) => {},
    removeAttribute: (attr: string) => {},
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
    }),
    scrollTop: 0,
    scrollLeft: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  };
};

// Mock document
const mockDocument = {
  createElement: (tagName: string) => {
    const element = mockElement(tagName);
    if (tagName === "canvas") {
      // @ts-expect-error mockCanvas is a mock
      element.getContext = mockCanvas.getContext;
      // @ts-expect-error mockCanvas is a mock
      element.tagName = "CANVAS";
    }
    return element;
  },
  getElementById: (id: string) => mockElement("div"),
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
  addEventListener: (type: string, listener: Function) => {},
  removeEventListener: (type: string, listener: Function) => {},
};

// Replace global objects with mocks
(global as any).window = mockWindow;
(global as any).document = mockDocument;
