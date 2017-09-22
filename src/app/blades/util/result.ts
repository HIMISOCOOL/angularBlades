class ResultCommonLogic {
  public readonly isFailure: boolean;
  public get isSuccess() {
      return !this.isFailure;
  }

  private readonly _error: string;

  public get error() {
      if (this.isSuccess) throw new TypeError('There is no error message for success');
      return this._error;
  }

  constructor(
      isFailure: boolean,
      error: string
  ) {
      if (isFailure) {
          if (!error) {
              throw new TypeError(`error: ${error} must be a string message`);
          }
      } else {
          if (error !== null) {
              throw new TypeError('There should be no error message for success');
          }
      }
      this.isFailure = isFailure;
      this._error = error;
  }
}

export class Result {
  private static readonly okResult: Result = new Result(false, null);

  private readonly _logic: ResultCommonLogic;

  public get isFailure() {
      return this._logic.isFailure;
  }

  public get isSuccess() {
      return this._logic.isSuccess;
  }

  public get error() {
      return this._logic.error;
  }

  constructor(
      isFailure: boolean,
      error: string
  ) {
      this._logic = new ResultCommonLogic(isFailure, error);
  }

  public static ok = () => Result.okResult;

  public static err = (error: string) => new Result(true, error);

  public static okT = <T>(value: T) => new ResultT<T>(false, value, null);

  public static errT = <T>(error: string) => new ResultT<T>(true, null, error);

  public static firstErrOrOk = (...results: Result[]) => {
      for (const result of results) {
          if (result.isFailure) return Result.err(result.error);
      }
      return Result.ok();
  }

  public static from = <T>(value: T): ResultT<T> => value ? ok(value) : err<T>('value was null');

  public static combine = (errorMessagesSeparator = ',', ...results: Result[]) => {
      const failedResults = results.filter(x => x.isFailure);
      if (!failedResults.length) return Result.ok();

      const errorMessage = failedResults.map(x => x.error).join(errorMessagesSeparator);
      return Result.err(errorMessage);
  }
}

export const ok = Result.okT;
export const err = Result.errT;

export class ResultT<T> extends Result {

  private readonly _value: T;

  public get value() {
      if (this.isFailure) {
          throw new TypeError('There is no value for failure.');
      }
      return this._value;
  }

  constructor(
      isFailure: boolean,
      value: T,
      error: string
  ) {
      super(isFailure, error);
      if (!isFailure && value == null) {
          throw new TypeError(`value: ${value} must not be undefined or null for successes`);
      }
      this._value = value;
  }

  public static combine = <T>(errorMessagesSeparator = ',', ...results: ResultT<T>[]) => {
      const untyped = results.map(r => r as Result);
      return Result.combine(errorMessagesSeparator, ...untyped);
  }
}
