const express = require("express");
const app = express();
PORT = 8000;
const mongoose = require('mongoose')
//Connection
mongoose.connect('mongodb://127.0.0.1:27017/bcaDB')
.then(()=>console.log('Connected'))
.catch(err=>console.log('Mongo ERR',err));

// Middleware (Important for POST)
app.use(express.json());

const userSchema = new mongoose.Schema({
firstName:{
    type:String,
    required:true
},
lastName:{
    type:String,
    required:true
},
 email: {
        type: String,
        required: true,    
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']     
    }

});
userSchema.index({ email: 1 }, { unique: true });

// Model

const User = mongoose.model('User',userSchema)
User.init().then(() => console.log("Index created"));

app.get('/',(req,res)=>{
    res.end('Working.....')
});

app.post('/user',async (req,res)=>{
    try{
        const body = req.body;
        const user = await User.create({
            firstName:body.firstName,
            lastName:body.lastName,
            email:body.email
        });
        res.status(201).json({
            message:'Data Added',
            data:user
        });
    }
    catch(error){
        res.status(500).json({
            error: error.message    
        })
    }
})

app.get('/getAll',async (req,res)=>{
    try {
        const data = await User.find();
        res.status(201).json({
            message: 'Data Fetched',
            data:data
        })

    } catch(err){
        res.status(500).json({
            error:err.message
        });
    }

})

app.delete('/delUser/:id',async (req,res)=>{
    try{        
        const deletedUser = await User.deleteOne({ email: req.params.id });
        
        
         if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        } else{
                  res.json({ message: "Deleted", data: deletedUser });
        }  

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }

})

app.listen(PORT,()=>{
    console.log(`Server Running at Port Number: ${PORT}`);
    
})