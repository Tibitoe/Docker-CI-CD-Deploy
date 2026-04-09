import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ message: 'API is running' })
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

test('shows loading state initially', () => {
  render(<App />)
  expect(screen.getByText('Connecting...')).toBeInTheDocument()
})

test('shows API message after fetch resolves', async () => {
  render(<App />)
  await waitFor(() => {
    expect(screen.getByText('API is running')).toBeInTheDocument()
  })
})

test('shows offline state when fetch fails', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
  render(<App />)
  await waitFor(() => {
    expect(screen.getByText('Could not reach the API')).toBeInTheDocument()
  })
})
