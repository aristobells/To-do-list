import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt, { hash } from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv"

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized: true,
}))
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
})
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res)=> {
  res.render("home.ejs")
})

app.get("/register", (req, res)=>{
  res.render("register.ejs")
})

app.get("/login", (req, res)=> {
  res.render("login.ejs")
})

app.get("/todolist", async (req, res) => {
  
  if(req.isAuthenticated()){
    const userId = req.user.id
      try {
         const userItems = await db.query("SELECT * FROM users JOIN items ON users.id = user_id WHERE users.id = $1",
        [userId]
      ) 
    const items = userItems.rows
    res.render("todolist.ejs", {
      listTitle: "Today",
      listItems: items,
    });
    // console.log(req.body)    
  } catch (error) {
    console.log(error)
  }
  }
  else{
    res.redirect("/login");
  }
});


// Reegistration Route

app.post("/register", async (req, res)=> {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const checkList = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if(checkList.rows.length > 0){
      res.render("error.ejs", {error: "Email already exist Try Logging in"});
    }
    else{
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if(err){
          console.log("error Hashing password", err);
        }
        else{
          await db.query("INSERT INTO users(email, password) VALUES ($1, $2)", [email,hash])
          res.render("login.ejs")
        }
      })
    }
    
  } catch (error) {
    console.log(error)
  }  
})

// LOgin route

app.post("/login",passport.authenticate("local", {
  successRedirect:"/todolist",
  failureRedirect : "login"
}))

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const userID = req.user.id;
  try {
    await db.query("INSERT INTO items (title, user_id) VALUES($1, $2)", [item, userID]);

    // items.push({ title: item });
    console.log(userID)
    res.redirect("/todolist");

  } catch (error) {
    console.log(error)    
  }

});

app.post("/edit", async (req, res) => {
  if(req.isAuthenticated()){
      const item = req.body
  const updatedItemId =req.body.updatedItemId
  const updatedItemTitle = req.body.updatedItemTitle
  try {
    await db.query("UPDATE items SET title = $1 WHERE id =$2", [updatedItemTitle, updatedItemId]);
    // console.log(item);
    res.redirect("/todolist");

  } catch (error) {
    console.log(error);
  }
  }
  else{
    res.redirect("/login")
  }

});

app.post("/delete", async (req, res) => {
  const itemID = parseInt(req.body.deleteItemId);
  // console.log(itemID)
  try {
    await db.query("DELETE FROM items WHERE id = $1", [itemID])
    res.redirect("/todolist")
  } catch (error) {
    console.log(error)
  }
});


passport.use("local", 
  new Strategy(async function verify(username, password ,cb){

    try {
    // checking if email exist in the database
    const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [username]);
    if(checkEmail.rows.length > 0){
      const storedPassword = checkEmail.rows[0].password
      const user = checkEmail.rows[0]
     
     bcrypt.compare(password, storedPassword, async (err, result)=> {
      if(err){
        console.log("Error hashing password", err)
        return cb(err)
      }
      else{
        if(result){
          return cb(null, user)
        }
        else{
          return cb(null, false)
        }
      }
     })      
    }
    else{
      return cb("User not found")
    }
  } catch (error) {
    console.log(error)
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
