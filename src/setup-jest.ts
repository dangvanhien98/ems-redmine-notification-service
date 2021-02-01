jest.mock("bunyan", () => {
  return {
    createLogger: () => {
      return {
        trace: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        fatal: jest.fn(),
      };
    },
  };
});

// tslint:disable:no-console
console.info = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();
console.log = jest.fn();
console.debug = jest.fn();
console.trace = jest.fn();
