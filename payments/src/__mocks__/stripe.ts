export const stripe = {
  // mock resolvedvalue here bc the real create implementation returns a promise
  charges: { create: jest.fn().mockResolvedValue({}) },
};
