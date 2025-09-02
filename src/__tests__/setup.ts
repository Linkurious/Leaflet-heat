// Mock canvas and its context
const getContext = () => ({
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
});

const mockElement = (_tagName: string) => {
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
    appendChild: (_child: unknown) => {},
    insertBefore: (_child: unknown, _ref: unknown) => {},
    removeChild: (_child: unknown) => {},
    className: "",
    addEventListener: (_type: string, _listener: unknown) => {},
    removeEventListener: (_type: string, _listener: unknown) => {},
    getElementById: (id: string) => mockElement(id),
    getAttribute: (_attr: string) => "",
    setAttribute: (_attr: string, _value: string) => {},
    removeAttribute: (_attr: string) => {},
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
      element.getContext = getContext;
      // @ts-expect-error mockCanvas is a mock
      element.tagName = "CANVAS";
    }
    return element;
  },
  getElementById: (_id: string) => mockElement("div"),
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

const mockNavigator = {
  userAgent:
    "Mozilla/5.0 (Test Browser) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  platform: "MacIntel",
  maxTouchPoints: 0,
  hardwareConcurrency: 8,
  language: "en-US",
  languages: ["en-US", "en"],
  webdriver: false,
  onLine: true,
  cookieEnabled: true,
  doNotTrack: null,
  geolocation: {
    getCurrentPosition: () => {},
    watchPosition: () => {},
    clearWatch: () => {},
  },
};

// Mock window
const mockWindow = {
  document: mockDocument,
  devicePixelRatio: 1,
  addEventListener: (_type: string, _listener: unknown) => {},
  removeEventListener: (_type: string, _listener: unknown) => {},
  navigator: mockNavigator,
};

// Replace global objects with mocks
// @ts-expect-error mockWindow is a mock on different environments
global["window"] = mockWindow;
// @ts-expect-error mockDocument is a mock on different environments
global["document"] = mockDocument;
if (typeof navigator === "undefined") {
  // @ts-expect-error mockNavigator is a mock on different environments
  globalThis.navigator = mockNavigator;
}
