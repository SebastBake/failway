import { OkData, Maybe, ExcludeOk, isOk, ok, Ok } from "./maybe";

type SyncMapper<T, U> = (d: T) => U;
type Resolved<T> = T extends Promise<infer U> ? U : T;

type Rail<M> = {
  done(): M;
  map<M2 extends Maybe<any, any> | Promise<Maybe<any, any>>>(
    mapper: SyncMapper<OkData<M>, M2>
  ): Promise<any> extends M2
    ? AsyncRail<Resolved<M2> | ExcludeOk<M>>
    : Rail<M2 | ExcludeOk<M>>;
};

type AsyncRail<M> = {
  done(): Promise<M>;
  map<M2 extends Maybe<any, any> | Promise<Maybe<any, any>>>(
    mapper: SyncMapper<OkData<M>, M2>
  ): AsyncRail<Resolved<M2> | ExcludeOk<M>>;
};

export const Rail = <D>(
  data: D
): Promise<any> extends D ? AsyncRail<Ok<Resolved<D>>> : Rail<Ok<D>> => {
  if (data instanceof Promise) {
    const maybe = data.then(ok);
    // @ts-ignore
    return continueAsyncRail(maybe);
  } else {
    const maybe = ok(data);
    // @ts-ignore
    return continueRail(maybe);
  }
};

export const continueAsyncRail = <M extends Maybe<any, any>>(
  item: Promise<M>
): AsyncRail<M> =>
  Object.freeze({
    done() {
      return item;
    },
    map(mapper) {
      const mapped = item.then(async resolved => {
        if (isOk(resolved)) {
          return mapper(resolved.data);
        } else {
          return resolved as ExcludeOk<M>;
        }
      });
      // @ts-ignore
      return continueAsyncRail(mapped);
    }
  });

export const continueRail = <M extends Maybe<any, any>>(item: M): Rail<M> =>
  Object.freeze({
    done() {
      return item;
    },
    map(mapper) {
      if (isOk(item)) {
        const mapped = mapper(item.data);
        if (mapped instanceof Promise) {
          return continueAsyncRail(mapped);
        } else {
          // @ts-ignore
          return continueRail(mapped);
        }
      } else {
        return continueRail(item);
      }
    }
  });
