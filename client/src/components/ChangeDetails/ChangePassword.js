import { useNavigate } from 'react-router-dom'
import { useState, useRef, useContext } from 'react';
import axios from "axios";
import '../Auth/AuthForm.css';
import useInput from "../../hooks/use-input";
import LoadingSpinner from '../UI/LoadingSpinner'
import AuthContext from '../../store/auth-context';

const ChangePassword = () => {
    const history = useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const authCtx = useContext(AuthContext)

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput
  } = useInput((value) => value.trim().length > 6);
  
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput
  } = useInput((value) => value.includes("@"));


  let formIsValid = false;

  if (enteredPasswordIsValid && enteredEmailIsValid) {
    formIsValid = true;
  }
  


  const submitHandler = async (event) => {
    event.preventDefault();

    if (!enteredPasswordIsValid) {
      return;
    }

    resetPasswordInput()
    resetEmailInput()

    setIsLoading(true)

    try {
        const res = await axios.patch(`/users/password`, { 
            email: enteredEmail,
            password: enteredPassword
        }
        );
        setIsLoading(false)
          localStorage.setItem('userId', res.data.user._id)
          localStorage.setItem('isAdmin', res.data.user.isAdmin)
          authCtx.login(res.data.token, res.data.expiresIn);
        history('/me', {replace: true})
    } catch (e) {
        setError(true)
        setErrorMessage('לא נמצא חשבון עם כתובת האימייל הזו.')
        setIsLoading(false)
        console.log(e.message);   
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
        <h1>שינוי סיסמה</h1>
        <form onSubmit={submitHandler}>
        <div className={emailInputClasses}>
          <label htmlFor='email'>אימייל:</label>
          <input type='email' id='email' required onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          value={enteredEmail}/>
          {emailInputHasError && (
          <p className="error-text">כתובת אימייל אינה תקינה.</p>
        )}
        </div>
        <div className={passwordInputClasses}>
          <label htmlFor='password'>סיסמה חדשה:</label>
          <input type='password' id='password' required onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          value={enteredPassword}/>
          {passwordInputHasError && (
          <p className="error-text">אורך הסיסמה חייב להיות 7 תווים לפחות.</p>
        )}
        </div>
        {error && <p className='errorMessage'>{errorMessage}</p>}
        <div className='actions'>
          {!isLoading && <button disabled={!formIsValid}>אישור</button>}
          {isLoading && !error && <LoadingSpinner />}
        </div>
      </form>
    </section>
  )
}

export default ChangePassword;