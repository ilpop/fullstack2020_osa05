import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import{ render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'
import BlogForm from './BlogForm'

const blog = {
  title: 'Testing testing',
  author: 'TestMan',
  url: 'wwww.testing.com'
}

test('renders content', () => {


  const component = render(
    <Blog blog={blog} />
  )
  component.debug()
  console.log(prettyDOM())


  expect(component.container).toHaveTextContent(
    'Testing testing')
  expect(component.container).not.toHaveTextContent(
    'www.testing.com')
})

test('clicking the view button reveals url and likes', () => {
  const component = render(
    <Blog blog={blog} />
  )

  const button = component.container.querySelector('button')
  fireEvent.click(button)
  expect(component.container).toHaveTextContent('likes:')
  expect(component.container).toHaveTextContent('www.testing.com')

})



test('clicking the button twice calls event handler twice', async () => {

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} likeBlog={mockHandler} />
  )
  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'testing of forms' }
  })

  fireEvent.change(author, {
    target: { value: 'testauthor' }
  })
  fireEvent.change(url, {
    target: { value: 'www.test.com' }
  })


  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing of forms')

})