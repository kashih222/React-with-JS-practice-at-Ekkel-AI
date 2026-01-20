import React from 'react'
import { useEffect, useState } from 'react'
import appwriteService from "../../appwrite/config"
import Container from '../container/Container'
import PostCard from '../PostCard'
import { useSelector } from 'react-redux'

const HomePage = () => {
    const [posts, setPosts] = useState([])
    console.log(posts)
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(()=>{
        if (authStatus) {
            appwriteService.getPosts().then((posts)=>{
                if (posts) {
                    setPosts(posts.documents)
                }
            })
        } 
    },[authStatus])
   
  if (!posts || posts.length === 0) {
    return(
        <div className='w-full  mt-4 text-center'>
            <Container>
                <div className='flex flex-wrap'>
                    <div className='p-2 w-full'>
                        <h1 className='text-2xl font-bold hover:text-gray-500'>
                            Login to Read Post
                        </h1>

                    </div>
                </div>
            </Container>

        </div>
    )
  }

  return (
    <div className='w-full'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post)=>(
                    <div className='p-2 w-1/4' key={post.$id}>
                        <PostCard {...post}/>
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default HomePage