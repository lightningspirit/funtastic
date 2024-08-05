# Why FP?

Functional Programming (FP) offers a paradigm shift that can fundamentally transform how we approach coding, problem-solving, and software architecture. The principles of FP emphasize immutability, pure functions, and higher-order functions, which collectively foster code that is more predictable, reusable, and easier to test.

## Key Benefits of Functional Programming
- **Immutability**: In FP, data is immutable by default. This means once a data structure is created, it cannot be modified. This eliminates a whole class of bugs related to state changes and side effects, making your code more predictable and easier to reason about.

- **Pure Functions**: Functions in FP are pure, meaning they always produce the same output given the same input and have no side effects. This leads to more reliable and testable code since functions do not depend on or alter the state of the system.

- **Higher-Order Functions**: FP leverages higher-order functions, which can take other functions as arguments or return them as results. This enables more abstract and concise code, allowing for powerful patterns like function composition and currying.

- **Declarative Code**: FP encourages writing declarative code, which focuses on what to do rather than how to do it. This leads to clearer and more readable code, as the intention of the code is more apparent.

- **Concurrency and Parallelism**: Due to immutability and pure functions, FP naturally lends itself to concurrent and parallel programming. Without mutable state, it becomes easier to run code in parallel without running into issues related to shared state.

## Why Choose FP for Your Project?

Adopting FP principles can significantly enhance the quality and maintainability of your codebase. By emphasizing immutability and pure functions, FP helps in building software that is robust and less prone to bugs. The modular nature of functional code makes it easier to test and reuse, leading to more efficient development processes.

## Install
```
npm i @lightningspirit/fp
```

## Usage
```ts
import {
  Optional, Result, Effect, List, curry, compose, empty, is, match, map
} from '@lightningspirit/fp';

// Using Optional
const person = Optional
  .of({ name: 'Alice', age: 30 })
  .map((x) => ({ ...x, age: x.age + 1 }))
  .map((x) => ({ ...x, name: 'Alice Cooper' }));

person.match({
  Some: console.log,
  None: () => 'Phew!'
}) // { name: 'Alice Cooper', age: 31 }

const getPersonByName = new Effect(async (name: string) => {
  const response = await fetch(`http://api.example.com/people?s=${mame}`)
  return Optional.of(await response.json())
})
  .map(transformSomethingInPerson)

getPersonByName
  .call('Alice')
  .map(applyAnotherTransformer)
  .match({
    Some: (x) => console.log(x) // { name: 'Alice Cooper', age: 31 }
    None: () => 'No person with that name'
  })
```
