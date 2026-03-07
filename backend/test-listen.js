const app = require("./src/app");
app.listen(3000, () => console.log("Test raw listen on 3000"));
setInterval(() => console.log("loop"), 5000);
