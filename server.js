const express=require('express')
const cors=require('cors')
const axios=require('axios')
require('dotenv').config();
const mongoose=require('mongoose')

const server=express()
server.use(cors());
server.use(express.json());
mongoose.connect('mongodb://localhost:27017/digimon',{ useNewUrlParser: true, useUnifiedTopology: true });

const digimonSchema = new  mongoose.Schema({
    name:String,
    img:String,
    level:String
})
var digimonModel = mongoose.model("digimonColl", digimonSchema);

PORT=process.env.PORT

server.get('/getDigimon',getDigimonHandler)
server.post('/favDigimon',favHandler)
server.get('/getFavorit',getFavorit)
server.delete('/deleteFav/:id',deleteFav)
server.put('/updateData/:id',updataHandler)

function getDigimonHandler(req,res){
    // const Digimon=req.query.;
    const url=(`https://digimon-api.vercel.app/api/digimon`)
    axios.get(url).then(result=>{
      const  DigimonArray =result.data.map(item=>{
            return new Digimon(item)
        })
        res.send(DigimonArray)
    })
}

function favHandler(req,res){
const{name,img,level}=req.body;
const newDigimon= new digimonModel({
    name:name,
    img:img,
    level:level
})
newDigimon.save()
}

function getFavorit(req,res){
   digimonModel.find({},(error,favData)=>{
       res.send(favData)
})
}

function deleteFav(req,res){
    const id=req.params.id;
   const deletedArr=digimonModel.remove({_id:id},(error,deletedData)=>{
    deletedArr.save()
}) 
deletedArr.digimonModel.find({},(error,data)=>{
     res.send(data)
    })
}

function updataHandler(req,res){
    const {name, img,level}=req.body
    const id=req.params.id;
     digimonModel.findOne({_id:id},(error,obj)=>{
     obj.save().then(()=>{
      obj.find({},(error,newObj)=>{
          res.send(newObj)
      })
     })
  })
}

class Digimon{
    constructor(item){
        this.name=item.name;
        this.img=item.img;
        this.level=item.level;
    }
}

server.listen(PORT,()=>{
    console.log(`listen on PORT ${PORT}`)
})


