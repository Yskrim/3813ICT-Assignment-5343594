function server (http) {
    const PORT = 3000;

    http
        .listen(PORT, ()=>{
        console.log(`Server is running on http://loaclhost:${PORT}`)
    })
        .on("error", (err)=>{
        console.log("Server failed to start");
        if(err.code === "EADDRINUSE"){
            console.log(`Port ${PORT} is already in use.`)
        } 
    })

}

module.exports = { server }
