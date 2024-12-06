import react, {useState, useEffect } from 'react'
import {backendUrl, currency} from "../App"
import axios from 'axios'
import { toast } from 'react-toastify'
const List = ({token})=>{

    const [list,setList] = useState([])
    const fetchList = async()=>{
        try{
            const response = await axios.get(backendUrl + '/api/product/list')
            // console.log(response)
            
            if(response.data.products){
                setList(response.data.products)
                // console.log(list)
            }
            else{
                toast.error(response.message)
            }
        }
        catch(err){
            console.log(err)
            toast.error(err.message)
            localStorage.removeItem('token')
        }
    }
    useEffect(()=>{
        fetchList()
    },[])

    const removeProduct = async (id)=>{
        try{
            const response = await axios.post(backendUrl + '/api/product/remove',{id},{headers:{token}})
            if(response.data.success){
                toast.success(response.data.message)
                await fetchList()
            }
            else{
                toast.error(response.data.message)
            }
        }
        catch(err){
            console.log(err)
            toast.error(err.message)
        }
    }

    return(
       <>
            <p className='mb-2'>All Products List</p>
            <div className='flex flex-col gap-2'>
                {/* --------list table title----- */}

                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                    <b>Image</b> 
                    <b>Name</b>
                    <b>Category</b>
                    <b>Full Price</b>
                    <b>Half Price</b>
                    <b className='text-center'>Action</b>
                </div>

                {/* Product List */}

                {
                    list.map((item,index)=>(
                        <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
                            <img className='w-12' src={item.image[0]} alt=""></img>
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>{currency}{item.fullprice}</p>
                            <p>{currency}{item.halfprice}</p>
                            <p className='block sm:hidden'></p>
                            <p onClick={()=>removeProduct(item._id)} className='ml-4 md:text-center cursor-pointer text-lg text-red-600'>X</p>
                        </div>
                    ))
                }

            </div>
       </>
    )
}

export default List