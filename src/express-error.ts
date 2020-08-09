export class ExpressError extends Error {
  constructor(
    public status: number, 
    message: string
    ) {
    super(message);
  }
}
