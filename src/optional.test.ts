/*
Copyright (c) 2024 Move Your Digital, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { describe, test } from "node:test";
import assert from "node:assert";
import { Optional } from "./optional";

describe('optional', () => {
  const person = Optional.of({ name: 'Alice', age: 30 });

  test('can map over some value', () => {
    const subject = person
      .map((x) => ({ ...x, age: x.age + 1 }))
      .map((x) => ({ ...x, name: 'Alice Cooper' }))
    
    assert.equal(subject.x.age, 31)
    assert.equal(subject.x.name, 'Alice Cooper')
  })

  test('can apply functor over some value', () => {
    const subject = person
      .apply(Optional.of((x) => ({ ...x, age: x.age + 1 })))
      .map((x) => ({ ...x, name: 'Alice Cooper' }))

    assert.equal(subject.x.age, 31)
    assert.equal(subject.x.name, 'Alice Cooper')
  })

  test('can bind functor over some value', () => {
    const subject = person
      .bind((x) => Optional.of({ ...x, age: x.age + 1 }))
      .map((x) => ({ ...x, name: 'Alice Cooper' }))

    assert.equal(subject.x.age, 31)
    assert.equal(subject.x.name, 'Alice Cooper')
  });

  [
    [Optional.of(42).concat(1), Optional.of(43)],
    [Optional.of(42n).concat(1n), Optional.of(43n)],
    [Optional.of('foo').concat('bar'), Optional.of('foobar')],
    [Optional.of([1, 2, 3]).concat([4, 5]), Optional.of([1, 2, 3, 4, 5])],
    [Optional.of({ foo: 'bar', bar: '' }).concat({ bar: 'baz' }), Optional.of({
      foo: 'bar', bar: 'baz',
    })],
  ].forEach(([subject, expected]) => {
    test(`can concat(${typeof subject.x})`, () => {
      assert.deepEqual(subject.x, expected.x)
    })
  })

  const matchers = {
    Some: (x: typeof person.x) => x,
    None: () => ({ name: 'John Doe', age: 0 })
  }

  test('person.match() -> Some', () => {
    assert.deepEqual(
      person.match(matchers),
      person.x
    )
  })

  test('empty.match() -> None', () => {
    assert.deepEqual(
      Optional.of<typeof person.x>(undefined)
        .match(matchers),
      { name: 'John Doe', age: 0 }
    )
  })
})
