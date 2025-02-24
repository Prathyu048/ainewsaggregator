const app=require('express')();
const PORT=5000;
app.listen(
    PORT,
    ()=>console.log(`server running on ${PORT}`)
);
app.get('/',(req,res)=>{
    res.send({
        apple:2,
        banana:12
    })
})