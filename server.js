//create express app
const exp=require('express');
const app=exp()
require('dotenv').config() //process.env.PORT
const mongoClient=require('mongodb').MongoClient;
const path=require('path')

//deploy react build in this server
// app.use(exp.static(path.join(__dirname,'../client/build')))
//to parse the body of req
app.use(exp.json())
const cors = require('cors');

app.use(cors({
  origin: 'https://celebrated-baklava-0cf54d.netlify.app' // Replace with your frontend's origin
}));


//connect to DB
mongoClient.connect(process.env.DB_URL)
.then(client=>{
    //get db obj
    const blogdb=client.db('blogdb')
    //get collection obj
    const userscollection=blogdb.collection('userscollections')
    const articlescollection=blogdb.collection('articlescollections')
    const authorscollection=blogdb.collection('authorscollections')
    const adminscollection=blogdb.collection('adminscollections')

    //share colelction obj with express app
    app.set('userscollection',userscollection)
    app.set('articlescollection',articlescollection)
    app.set('authorscollection',authorscollection)
    app.set('adminscollection',adminscollection)

    //confirm db connection status
    console.log("DB connection success")
})
.catch(err=>console.log("Err in DB connection",err))


//import API routes
const userApp=require('./APIs/user-api')
const authorApp=require('./APIs/author-api')
const adminApp=require('./APIs/admin-api')

//if path starts with user-api, send req to userApp
app.use('/user-api',userApp)
//if path starts with author-api, send req to authorApp
app.use('/author-api',authorApp)
//if path starts with admin-api, send req adminApp
app.use('/admin-api',adminApp)

//deals with page refresh

// app.use((req,res,next)=>{
//     res.sendFile(path.join(__dirname,'../client/build/index.html'))
// })
app.get('/', (req, res) => {
    res.send('Hello from your Backend!');  // Replace with your desired response
});

//express error handler
app.use((err,req,res,next)=>{
    res.send({message:"error",payload:err.message})
})
//assign port number
const port=process.env.PORT || 4000;
app.listen(port,()=>console.log(`Web server on port ${port}`))
// app.listen(() => console.log(`Web Server started on ${process.env.RENDER_URL}`));
