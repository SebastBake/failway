export type Maybe<DATA, STATUS> = Readonly<{
  status: STATUS;
  data: DATA;
}>;

export type Ok<D> = Maybe<D, "OK">;
export type Err<D, E> = Maybe<D, E>;

export function err<E extends Readonly<string>>(error: E, data?: undefined): Maybe<undefined, E>;
export function err<E extends Readonly<string>, E_D>(error: E, data: E_D): Maybe<E_D, E>;
export function err<E extends Readonly<string>>(error: E, data: any): any {
  return Object.freeze({ status: error, data });
}

export function isOk(maybe: any): maybe is { status: "OK" } {
  return maybe.status === "OK";
}

export const ok = <D>(data: D): Maybe<D, "OK"> => Object.freeze({ status: "OK", data });

export type OkData<T> = T extends Maybe<infer D, "OK"> ? D : never;

export type ExcludeOk<T> = T extends Maybe<any, "OK"> ? never : T;
