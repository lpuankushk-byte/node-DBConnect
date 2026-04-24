const express = require('express');
const app = express();
const PORT = 8001;
const mongoose = require('mongoose');



app.use(express.json());

//Connection
mongoose.connect('mongodb://127.0.0.1:27017/oneDB')
.then(()=>console.log('connected'))
.catch((err)=>console.log('Mongo ERR:',err));

//Schema

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        match:[/^\S+@\S+\.\S+$/, '......'],
                     
    }
    
});

userSchema.index({email:1},{unique:true})

//Model

const User = mongoose.model('User',userSchema);
User.init();

app.get('/',(req,res)=>res.end('Hello...'))

app.post('/users',async (req,res)=>{
    const body = req.body;
    try{
        const user = await User.create({
            firstName:body.firstName,
            lastName:body.lastName,
            email:body.email
        });
        res.status(201).json({
            message:'Data Added',
            data:user
        })

    }
    catch(error){
        res.status(500).json({
            error: error.message
        })
    }
})


app.get('/getAll', async (req,res)=>{
    try{
        const fetchedUsers = await User.find();
        res.status(200).json({
            message: "Data Fetched",
            data: fetchedUsers
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
})




app.listen(PORT,()=>console.log(`Server Running at PORT:${PORT}`))