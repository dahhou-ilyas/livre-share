const { default: mongoose } = require('mongoose');
const app=require('./app/index');


const port = process.env.PORT || '3000'
mongoose.connect("mongodb://127.0.0.1:27017/userlivre", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    app.listen(port,()=>{
        console.log("app listen in http://localhost:3000");
    })
})
.catch((error) => {
  console.error("Erreur de connexion à MongoDB :", error.message);
});
