/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

function secondCall() {
  // This comment is useful: ☺
  let f = 2;
  debugger;
  function foo() {}
  if (x) {
    foo();
  }
}

var x = true;
