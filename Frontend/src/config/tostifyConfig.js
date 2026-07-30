import toast from "react-hot-toast"



export const successToast = (message) =>{
    toast.success(message,{
        style:{
            backgroundColor:"green",
            color:"white"
        }
    })
}

export const errorToast = (error)=>{
    toast.error(error,{
        style:{
            backgroundColor:'red',
            color:'white'
        }
    })
}