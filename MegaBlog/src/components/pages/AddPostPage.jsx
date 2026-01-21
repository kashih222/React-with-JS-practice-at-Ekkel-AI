import React, { useEffect } from 'react'
import Container from "../container/Container"
import PostForm from '../post-form/PostForm'

const AddPostPage = () => {
  useEffect(() => {
      document.title = "Add Post - MegaBlog";
    }, []);
  return (
    <div className=''>
        <Container>
            <PostForm/>
        </Container>
    </div>
  )
}

export default AddPostPage