const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

try {
  mongoose.connect(
    "mongodb+srv://lihica2004:lihica2004@cluster0.kxcs4nh.mongodb.net/final-project",
    {
      useNewUrlParser: true,
    }
  );
  console.log('connected succesfuly')
} catch (e) {
    console.log(e)
}

