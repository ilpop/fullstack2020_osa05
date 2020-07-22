import React, { useState, useEffect } from 'react'
import './index.css'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'


const App = () => {

  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)



  const blogFormRef = React.createRef()



  useEffect(() => {
    blogService.getAll()
      .then(blogs =>
        setBlogs(byLikes( { blogsToSort : blogs }) )
      )
  }, [])

  const byLikes = ({ blogsToSort }) => {
    return blogsToSort.sort((b1, b2) => b2.likes - b1.likes)

  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])




  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))

        setErrorMessage(`a new blog "${blogObject.title}" by ${blogObject.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

      })
  }

  const likeBlog = async ({ blog }) => {

    blog.likes += 1

    const returnedBlog = await blogService.update(blog)
    setBlogs(byLikes({ blogsToSort :
        blogs.map((b) => b === blog  ? returnedBlog : b) }))

    setErrorMessage(
      `Liked the blog '${blog.title}'`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }



  const removeBlog = async  ({ blog }) => {

    if (window.confirm(`remove blog ${blog.title}?`)){

      await blogService.deleteObject(blog)

      setBlogs(byLikes({ blogsToSort : blogs.filter((b) => b !== blog) }))
      setErrorMessage(`blog "${blog.title}" removed!`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    }
  }





  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}> log in </button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>

        </div>
      </div>
    )
  }


  const blogForm = () => (

    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )
  const logout = () => {

    window.localStorage.removeItem('loggedUser')
    window.location.href='/api/login'
  }

  return (
    <div>
      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
          <p> {user.name} logged in</p>
          {blogForm()}
          <div>
            <br></br>
            <button onClick = {logout}> Logout </button>
          </div>

          <h2>Blogs</h2>

          <Blogs blogs={blogs}
            blog={blogs}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />

        </div>

      }

    </div>
  )
}

export default App