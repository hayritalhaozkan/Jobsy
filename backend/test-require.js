console.log("starting test");
console.log("requiring express");
const express = require("express");
console.log("requiring ./src/app");
try {
    const app = require("./src/app");
    console.log("app loaded");
} catch (e) {
    console.log("error", e);
}
console.log("done");
