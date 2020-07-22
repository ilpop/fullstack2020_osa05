import React from 'react'
import Blog from './Blog'

const Blogs = ({ blogs, likeBlog, removeBlog }) => (
  <div>
    {blogs.map(blog  =>
      <Blog id = 'blogs'
        key={blog.id}
        blog={blog}
        likeBlog={likeBlog}
        removeBlog={removeBlog}/>
    )}
  </div>
)
export default Blogs