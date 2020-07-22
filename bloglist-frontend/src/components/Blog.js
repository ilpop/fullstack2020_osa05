/* eslint-disable linebreak-style */
import React, { useState } from 'react'
const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [view, setView] = useState( false )

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginbottom: 5
  }

  const viewAll = () => (
    <div>
      <strong>author: </strong>{blog.author} <br></br>
      <strong>       URL:      </strong>
      {blog.url} <br></br>
      <strong>       likes:    </strong>
      {blog.likes}

    </div>

  )

  return (
    <div className = 'blog' id='blogtitle' style={blogStyle}>
      <br></br>
      <strong> {blog.title} </strong>
      <br></br>
      <button id='view' onClick={() => setView(!view)}>view</button>
      {view && viewAll()}
      <button id='like' onClick={() => {likeBlog( { blog :blog })}}>
      like</button>
      <div>
        {
          <button id='delete' onClick={() => removeBlog({ blog: blog })}>
      delete</button>}
      </div>


    </div>

  )}


export default Blog
