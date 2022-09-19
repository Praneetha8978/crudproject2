const express = require('express')
const app = express()

const admin = require('firebase-admin');
const credentials = require('./firekey.json')

admin.initializeApp({
    credential:admin.credential.cert(credentials)
})
app.use(express.json());
const db = admin.firestore();
app.post('/create',async (req,res) => {
    try{
        console.log(req.body);
        const id = req.body.email
        const userJson={
        email:req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    }
        const response = db.collection("users").add(userJson)
        res.send(response)
    }
    catch(error){
        res.send(error)
    }
});
app.get('/read/all',async(req,res) => {
    try{
        const userRef = db.collection('users')
        const response = await userRef.get()
        let responseArr = [];
        response.forEach((docs)=>{
            responseArr.push(docs.data());
            console.log(docs.data())
        })
        res.send(responseArr)
    }
    catch(error){
        res.send(error);
    }
})

app.get('/read/:id',async(req,res) => {
    try{
        console.log(req);
        const usersRef = db.collection('users').doc(req.params.id);
        const response = await usersRef.get()
        res.send(response.data());
        console.log(response.data());
    }
    catch(error){
        res.send(error);
    }
})
app.post('/update',async(req,res)=>{
    try{
        const id = req.body.id;
        console.log(req.body.id);
        const newFirstName = "ammmm"
        const useRef = await db.collection('users').doc(id).update({
            firstName : newFirstName
        })
        console.log(useRef);
        res.send(useRef);
    }
    catch(error){
        res.send(error);
    }
})

app.delete('/delete/:id',async(req,res)=>{
    try{

        const response = await db.collection('users').doc(req.params.id).delete();
        res.send(response);
        console.log(response);
    }
    catch(error){
        res.send(error);
    }
})



const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}.`);
})