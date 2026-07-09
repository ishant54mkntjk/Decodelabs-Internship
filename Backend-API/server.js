const express=require('express');
const app=express();
app.use(express.json());
const userRoutes=require('./routes/users');
app.use('/users',userRoutes);
app.get('/',(req,res)=>res.send('Backend API is Running Successfully'));
app.listen(3000);