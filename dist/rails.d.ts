import { OkData, Maybe, ExcludeOk } from "./maybe";
declare type SyncMapper<T, U> = (d: T) => U;
declare type Resolved<T> = T extends Promise<infer U> ? U : T;
declare type Rail<M> = {
    done(): M;
    map<M2 extends Maybe<any, any> | Promise<Maybe<any, any>>>(mapper: SyncMapper<OkData<M>, M2>): M2 extends Promise<Maybe<any, any>> ? AsyncRail<Resolved<M2> | ExcludeOk<M>> : Rail<M2 | ExcludeOk<M>>;
};
declare type AsyncRail<M> = {
    done(): Promise<M>;
    map<M2 extends Maybe<any, any> | Promise<Maybe<any, any>>>(mapper: SyncMapper<OkData<M>, M2>): AsyncRail<Resolved<M2> | ExcludeOk<M>>;
};
export declare const Rail: <D>(data: D) => D extends Promise<any> ? AsyncRail<Readonly<{
    status: "OK";
    data: Resolved<D>;
}>> : Rail<Readonly<{
    status: "OK";
    data: D;
}>>;
export declare const continueAsyncRail: <M extends Readonly<{
    status: any;
    data: any;
}>>(item: Promise<M>) => AsyncRail<M>;
export declare const continueRail: <M extends Readonly<{
    status: any;
    data: any;
}>>(item: M) => Rail<M>;
export {};
