const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Missing arguments. Run the script by: `npm mongo.js <db-password> <OPTIONAL new-person-name> <OPTIONAL new-person-number>"
  );
  process.exit(1);
}

const password = process.argv[2];

let newPersonName = undefined;
let newPersonNumber = undefined;
if (process.argv.length === 5) {
  newPersonName = process.argv[3];
  newPersonNumber = process.argv[4];
}

const url = `mongodb+srv://fullstack:${password}@cluster0.sdicy.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

if (newPersonName && newPersonNumber) {
  const person = new Person({
    name: newPersonName,
    number: newPersonNumber,
  });

  person.save().then((response) => {
    console.log(
      `Added ${newPersonName} with number ${newPersonNumber} to phonebook-app database.`
    );
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}
