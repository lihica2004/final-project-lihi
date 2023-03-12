import { useNavigate } from 'react-router-dom'
import { useState, useRef, useContext } from 'react';
import axios from "axios";
import '../Auth/AuthForm.css';
import useInput from "../../hooks/use-input";
import LoadingSpinner from '../UI/LoadingSpinner'
import AuthContext from '../../store/auth-context';

const ChangePassword = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  let message = 'הפרטים שונו בהצלחה!'
  const [success, setSuccess] = useState(false);

  const authCtx = useContext(AuthContext)

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput((value) => value.trim().length > 6);
  
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => value.includes("@"));

  const submitHandlerEmail = async (event) => {
    event.preventDefault();
    try {
      await axios.patch(`/users/email`, { 
        email: enteredEmail
      },{
          headers: { 'Authorization': "Bearer " + authCtx.token },
      }
      );
      setSuccess(true)
      setError(false)
      setTimeout(() => {
        navigate('/me', {replace: true})
        console.log("hello")
      }, 3000)
    } catch (e) {
      console.log(e.message)
      setError(true)
      setErrorMessage('קיים חשבון עם כתובת האימייל שהוכנסה')
    }    
  }

  const submitHandlerPassword = async (event) => {
    event.preventDefault();
    try {
      await axios.patch(`/users/changePassword`, { 
        password: enteredPassword
      },{
          headers: { 'Authorization': "Bearer " + authCtx.token },
      }
      );
      setSuccess(true)
      setError(false)
      setTimeout(() => {
        navigate('/me', {replace: true})
        console.log("hello")
      }, 3000)
    } catch (e) {
      console.log(e.message)
  } 
}


    const passwordInputClasses = passwordInputHasError
    ? "control invalid"
    : "control";

    const emailInputClasses = emailInputHasError
      ? "control invalid"
      : "control";
    
  
    return (
        <section className='auth'>
        <h1>שינוי פרטים</h1>
        <form onSubmit={submitHandlerEmail}>
        <div className={emailInputClasses}>
          <label htmlFor='email' className='label'>אימייל:</label>
          <input type='email' id='email' required onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          value={enteredEmail}/>
          {emailInputHasError && (
          <p className="error-text">כתובת אימייל אינה תקינה.</p>
        )}
        </div>
        {error && <p className='errorMessage'>{errorMessage}</p>}
        <div className='actions'>
          {!isLoading && <button disabled={!enteredEmailIsValid}>אישור</button>}
          {isLoading && !error && <LoadingSpinner />}
        </div>
      </form>
      <form onSubmit={submitHandlerPassword}>
      <div className={passwordInputClasses}>
          <label htmlFor='password' className='label'>סיסמה חדשה:</label>
          <input type='password' id='password' required onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          value={enteredPassword}/>
          {passwordInputHasError && (
          <p className="error-text">אורך הסיסמה חייב להיות 7 תווים לפחות.</p>
        )}
        </div>
        <div className='actions'>
          {!isLoading && <button disabled={!enteredPasswordIsValid}>אישור</button>}
          {isLoading && !error && <LoadingSpinner />}
        </div>
      </form>
      {success && <p className='successMsg'>{message}</p>}
    </section>
  )
}

export default ChangePassword;