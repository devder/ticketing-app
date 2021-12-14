// mock file
export const natsWrapper = {
  // client: { publish: (subject: string, data: string, cb: () => void) => cb() },
  client: {
    publish: jest.fn().mockImplementation((subject: string, data: string, cb: () => void) => {
      cb();
    }),
  },
};
