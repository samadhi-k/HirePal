import React, { useState, useReducer, useContext } from 'react'
import reducer from './reducer'
import axios from 'axios'
import {DISPLAY_ALERT, CLEAR_ALERT, 
        REGISTER_USER_BEGIN, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR,
        LOGIN_USER_BEGIN, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR,
        UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR,
        TOGGLE_SIDEBAR, LOGOUT_USER
    } from "./actions";

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '', 
  jobLocation: userLocation || '',
  showSidebar: false
}

const AppContext = React.createContext()
const AppProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer,initialState)
  
  const authFetch = axios.create({
    baseURL:'/api/v1',
    headers: {
<<<<<<< Updated upstream
    Authorization: `Bearer ${state.token}`,
  },
=======
      Authorization: `Bearer ${state.token}`,}
>>>>>>> Stashed changes
  })
  

  axios.interceptors.request.use(
    (config)=> {
      //config.headers.common['Authorization'] = `Bearer ${state.token}`
      return config
    },
    (error)=> {
      return Promise.reject(error)
    })

  axios.interceptors.response.use(
    (response)=> {
      return response
    },
    (error)=> {
      if(error.response.status === 401){
        logoutUser()
      }
      return Promise.reject(error)
    })

  const displayAlert = () => {
    dispatch({type:DISPLAY_ALERT})
    clearAlert()
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({type:CLEAR_ALERT})
    }, 3000)
  }

  const addUserToLocalStorage = ({user, token, location}) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token',token)
    localStorage.setItem('location', location)
  }

  const removeUserFromLocalStorage = ({user, token, location}) => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('location')
  
  }

  const registerUser = async (currentUser) => {
    dispatch({type: REGISTER_USER_BEGIN})
    try {
      const response = await axios.post('/api/v1/auth/register', currentUser)
      //console.log(response)
      const {user, token, location} = response.data
      
      //console.log(response)

      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {user, token, location}  
      })
      
      addUserToLocalStorage({user, token, location})

    } catch (error) {
      //console.log(error.response);
      dispatch({
        type:REGISTER_USER_ERROR,
        payload: {
          msg: error.response.data.msg
        },

      })
    }
    clearAlert()
  }

  const loginUser = async (currentUser) => {
    dispatch({type: LOGIN_USER_BEGIN})
    try {
      const {data} = await axios.post('/api/v1/auth/login', currentUser)
      
      const {user, token, location} = data

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {user, token, location}  
      })
      
      addUserToLocalStorage({user, token, location})

    } catch (error) {
      //console.log(error.response);
      dispatch({
        type:LOGIN_USER_ERROR,
        payload: {
          msg: error.response.data.msg
        },

      })
    }
    clearAlert()
  }

  const toggleSidebar = () => {
    dispatch({type: TOGGLE_SIDEBAR})
  }

  const logoutUser = () => {
      dispatch({type: LOGOUT_USER})
      removeUserFromLocalStorage()
  }

  const updateUser = async (currentUser) => {
    dispatch({type: UPDATE_USER_BEGIN})

    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser)
      const {user, location, token} = data

      dispatch({type:UPDATE_USER_SUCCESS, payload:{user, location, token}})
      addUserToLocalStorage({user, location, token})
    } catch (error) {
      if( error.response.status !== 401){
        dispatch({type: UPDATE_USER_ERROR, payload:{msg:error.response.data.msg}})
      }
    }
    clearAlert()
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider }