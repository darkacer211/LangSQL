import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hasConnectedDatabase: false,
  connections: [],
  activeConnection: null,
  isConnecting: false,
  error: null,
}

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    addConnection: (state, action) => {
      state.connections.push(action.payload)
      state.hasConnectedDatabase = true
      localStorage.setItem('hasConnectedDatabase', 'true')
    },
    removeConnection: (state, action) => {
      state.connections = state.connections.filter(conn => conn.id !== action.payload)
      if (state.connections.length === 0) {
        state.hasConnectedDatabase = false
        localStorage.removeItem('hasConnectedDatabase')
      }
    },
    setActiveConnection: (state, action) => {
      state.activeConnection = action.payload
    },
    setConnecting: (state, action) => {
      state.isConnecting = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetConnections: (state) => {
      state.connections = []
      state.activeConnection = null
      state.hasConnectedDatabase = false
      state.isConnecting = false
      state.error = null
      localStorage.removeItem('hasConnectedDatabase')
    },
  },
})

export const {
  addConnection,
  removeConnection,
  setActiveConnection,
  setConnecting,
  setError,
  clearError,
  resetConnections,
} = databaseSlice.actions

export default databaseSlice.reducer 