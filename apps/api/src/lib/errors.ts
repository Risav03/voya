export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export const notImplemented = (feature: string) =>
  new AppError('not_implemented', `${feature} is scaffolded behind a production interface.`, 501);
