export declare type Maybe<DATA, STATUS> = Readonly<{
    status: STATUS;
    data: DATA;
}>;
export declare type Ok<D> = Maybe<D, "OK">;
export declare type Err<D, E> = Maybe<D, E>;
export declare function err<E extends Readonly<string>>(error: E, data?: undefined): Maybe<undefined, E>;
export declare function err<E extends Readonly<string>, E_D>(error: E, data: E_D): Maybe<E_D, E>;
export declare function isOk(maybe: any): maybe is {
    status: "OK";
};
export declare const ok: <D>(data: D) => Readonly<{
    status: "OK";
    data: D;
}>;
export declare type OkData<T> = T extends Maybe<infer D, "OK"> ? D : never;
export declare type ExcludeOk<T> = T extends Maybe<any, "OK"> ? never : T;
