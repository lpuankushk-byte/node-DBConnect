const express = require('express')
const app = express()
const PORT = 8003;
const mongoose = require('mongoose');

app.use(express.json());

//Connection

mongoose.connect('mongodb://127.0.0.1:27017/DbOne')
.then(()=>console.log('connected'))
.catch((err)=>console.log('Mongo Err : ',err))

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
        match:[/^\S+@\S+\.\S+$/, '......']
              
    }
});
userSchema.index({email:1},{unique:true})

// Model

const User = mongoose.model('User',userSchema)
User.init();

app.post('/users',async (req,res)=>{
    const body = req.body;
    try{
        const user = await User.create({
            firstName:body.firstName,
            lastName:body.lastName,
            email:body.email
        });
        res.status(201).json({
            message:"Data Added",
            data:user
        });
    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
})

app.get('/getAll', async (req,res)=>{
    try {
        const users = await User.find();
        res.status(200).json({
            message:"Data Fetched",
            data:users
        })

    }catch(error){
        res.status(500).json({            
            error:error.message
        })
    }

});

app.delete('/delete/:id',async (req,res)=>{
    try{
        const deletedUser = await User.deleteOne({email: req.params.id})
        res.status(200).json({
            message:'Record Deleted',
            data:deletedUser
        })

    }catch(error){
        error:error.message
    }
})

app.put('/update/:id',async (req,res)=>{
    try{
        const updatedUser = await User.findOneAndUpdate(
            {email:req.params.id},
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
        )           
        res.status(200).json({
        message:'Data Updated',
        data:updatedUser
        }) 
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
})



app.listen(PORT,()=>console.log(`Server Running at Port : ${PORT}`))
