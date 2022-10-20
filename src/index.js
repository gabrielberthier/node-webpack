import { isPrime } from "./primes";

[...Array(100).keys()]
  .filter(isPrime)
  .forEach((el) => console.log(`${el} is a prime number`));
