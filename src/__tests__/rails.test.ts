import { continueRail, continueAsyncRail, Rail } from "../rails";
import { ok, err } from "..";
import { isOk, Maybe } from "../maybe";

const SAMPLE_DATA = { testKey: "testVal" };
const SAMPLE_DATA_2 = { testKey2: "testVal2" };

test("Rail function", async done => {
  const input = new Promise<typeof SAMPLE_DATA>(resolve => resolve(SAMPLE_DATA));

  const rail = Rail(SAMPLE_DATA).done();
  expect(rail).toMatchObject({ status: "OK", data: SAMPLE_DATA });

  const asyncRail = await Rail(input).done();
  expect(asyncRail).toMatchObject({ status: "OK", data: SAMPLE_DATA });

  done();
});

test("ok function", () => {
  const item = ok(SAMPLE_DATA);
  expect(item).toMatchObject({ status: "OK", data: SAMPLE_DATA });
});

test("ok typeguard", () => {
  const okItem = ok(SAMPLE_DATA);
  expect(isOk(okItem)).toBe(true);

  const notOkItem = err("TEST_ERROR");
  expect(isOk(notOkItem)).toBe(false);
});

test("err function", () => {
  const item = err("TEST_ERROR", SAMPLE_DATA);
  const item2 = err("TEST_ERROR");
  expect(item2).toMatchObject({ status: "TEST_ERROR", data: undefined });
  expect(item).toMatchObject({ status: "TEST_ERROR", data: SAMPLE_DATA });
});

describe("Synchronous Rail", () => {
  it("chains function calls using map", () => {
    const thing = continueRail(ok(SAMPLE_DATA))
      .map(item => {
        expect(item).toMatchObject(SAMPLE_DATA);
        return ok(SAMPLE_DATA_2);
      })
      .done();

    const thing2 = continueRail(ok(SAMPLE_DATA))
      .map(item => {
        expect(item).toMatchObject(SAMPLE_DATA);
        return ok(SAMPLE_DATA_2);
      })
      .map(item => {
        expect(item).toMatchObject(SAMPLE_DATA_2);
        return ok(SAMPLE_DATA);
      })
      .done();

    expect(thing).toMatchObject(ok(SAMPLE_DATA_2));
    expect(thing2).toMatchObject(ok(SAMPLE_DATA));
  });

  it("Skips subsequent maps when an error occurs", () => {
    const thing2 = continueRail(ok(SAMPLE_DATA))
      .map(item => {
        expect(item).toMatchObject(SAMPLE_DATA);
        return err("TEST_ERROR", SAMPLE_DATA_2);
      })
      .map(() => {
        expect("This should be unreachable").toBe("");
        return ok(SAMPLE_DATA);
      })
      .map(() => {
        expect("This should be unreachable").toBe("");
        return err("TEST_ERROR_2", SAMPLE_DATA_2);
      })
      .done();

    expect(thing2).toMatchObject(err("TEST_ERROR", SAMPLE_DATA_2));
  });

  it("Maps to a async rail when given a async function", async done => {
    const thing2 = await continueRail(ok(SAMPLE_DATA))
      .map(async () => {
        return err("TEST_ERROR", SAMPLE_DATA_2);
      })
      .done();

    expect(thing2).toMatchObject(err("TEST_ERROR", SAMPLE_DATA_2));

    done();
  });
});

describe("Asynchronous Rail", () => {
  it("chains function calls using map", async done => {
    const input = new Promise<Maybe<typeof SAMPLE_DATA, "OK">>(resolve => resolve(ok(SAMPLE_DATA)));

    const thing = await continueAsyncRail(input)
      .map(item => {
        expect(item).toMatchObject(SAMPLE_DATA);
        return ok(SAMPLE_DATA_2);
      })
      .done();

    const thing2 = await continueAsyncRail(input)
      .map(item => {
        expect(item).toMatchObject(SAMPLE_DATA);
        return ok(SAMPLE_DATA_2);
      })
      .map(item => {
        expect(item).toMatchObject(SAMPLE_DATA_2);
        return ok(SAMPLE_DATA);
      })
      .done();

    expect(thing).toMatchObject(ok(SAMPLE_DATA_2));
    expect(thing2).toMatchObject(ok(SAMPLE_DATA));

    done();
  });

  it("Skips subsequent maps when an error occurs", async done => {
    const input = new Promise<Maybe<typeof SAMPLE_DATA, "OK">>(resolve => resolve(ok(SAMPLE_DATA)));

    const thing2 = await continueAsyncRail(input)
      .map(async item => {
        expect(item).toMatchObject(SAMPLE_DATA);
        return err("TEST_ERROR", SAMPLE_DATA_2);
      })
      .map(async () => {
        expect("This should be unreachable").toBe("");
        return ok(SAMPLE_DATA);
      })
      .map(() => {
        expect("This should be unreachable").toBe("");
        return err("TEST_ERROR_2", SAMPLE_DATA_2);
      })
      .done();

    expect(thing2).toMatchObject(err("TEST_ERROR", SAMPLE_DATA_2));

    done();
  });
});
