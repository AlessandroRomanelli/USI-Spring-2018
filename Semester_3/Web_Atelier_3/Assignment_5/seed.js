/**
* Standalond db seed
*/
var seed = require('./test/seed').seed;

seed(function(seedData){
  console.log("Seeding complete!")
  process.exit();
})
