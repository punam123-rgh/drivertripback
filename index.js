
const express = require('express')
const multer = require('multer');
const cors = require('cors');
const jwt  = require ('jsonwebtoken');
const jwtkey = 'e-driver'

require('./db/Config');
const user = require ('./db/User');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

app.get('/user',async(req,resp)=>{
let result = await user.find();


    resp.send(result)

}
)

const upload = multer({ storage: storage });

app.post('/user', upload.single('image'), async (req, resp) => {
    let userData = req.body;

    // If you want to store image path in DB
    if (req.file) {
       userData.imagePath = req.file.path;
    }

    const data = new user(userData);
    let result = await data.save();
    
    if (result){
        jwt.sign({result},jwtkey ,{expiresIn:"2h"},(err,token) => {
if(err){
    console .log({result:"something went to wrong"})
}
else {
                resp.send({ result, auth: token });
            }
        } )
    }
});
app.put('/user/:id',upload.single('image'), verification,async(req,resp)=>{
    let data= req.body
     if (req.file) {
       data.imagePath = req.file.path;
    }

    let result  =  await user.updateOne({_id:req.params.id},{$set:data})
    resp.send(result)
})
app.get('/singleuser/:_id', verification,async(req,resp)=>{
const data = await user.findOne({_id:req.params._id})
resp.send(data)
})
app.delete('/delete/:id',  verification,async (req, res) => {
    try {
        const result = await user.deleteOne({ _id: req.params.id });
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: "Delete failed" });
    }
});
function verification(req,resp,next){
    let token = req.headers['authorization']
    if (token){
token = token.split(' ')[1]
console.log('middleware called',token)
jwt.verify(token ,jwtkey,(err,valid)=>{
if(err){
    resp.status(401).send({result:'please provide valid token'})
}
else{
    next()
}
})
    }
    else{
      resp.status(403).send({result:"please add token with geader"})  
    }


}
app.listen(5000)