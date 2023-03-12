import { useNavigate } from 'react-router-dom'
import { useState, useRef, useContext } from 'react';
import axios from "axios";
import './AuthForm.css';
import useInput from "../../hooks/use-input";
import LoadingSpinner from '../UI/LoadingSpinner'
import AuthContext from '../../store/auth-context';
import ChangePassword from '../ChangeDetails/ChangePassword';

const AuthForm = () => {
  const history = useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [changePassword, setChangePassword] = useState(false);

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
  

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!enteredPasswordIsValid) {
      return;
    }

    resetPasswordInput()
    resetEmailInput()

    setIsLoading(true)

    if (isLogin) {
      try {
        const res = await axios.post("/users/login", {
          email: enteredEmail, 
          password: enteredPassword, 
        })
        setIsLoading(false)
        localStorage.setItem('userId', res.data.user._id)
        localStorage.setItem('isAdmin', res.data.user.isAdmin)
        authCtx.login(res.data.token, res.data.expiresIn);
        history('/me', {replace: true})
      } catch (e) {
        setError(true)
        setIsLoading(false)
        setErrorMessage('אחד או יותר מפרטי ההתחברות שגויים')
        console.log(e.message);
      }
    } else {
        try {
          const res = await axios.post("/users", {
            email: enteredEmail, 
            password: enteredPassword, 
          })
          setIsLoading(false)
          localStorage.setItem('userId', res.data.user._id)
          localStorage.setItem('isAdmin', res.data.user.isAdmin)
          authCtx.login(res.data.token, res.data.expiresIn);
          console.log(res.data);
          history('/me', {replace: true})
        } catch (e) {
          setError(true)
          setIsLoading(false)
          setErrorMessage('קיים חשבון עם כתובת אימייל זו')
          console.log(e.message);
        }
    }
    }

    const passwordInputClasses = passwordInputHasError
    ? "control invalid"
    : "control";

    const emailInputClasses = emailInputHasError
      ? "control invalid"
      : "control";

      const changePasswordHandler = () => {
        setChangePassword(true)
      }
    
  

  return (
    <>
    {!changePassword && <section className='auth'>
      <h1>{isLogin ? 'התחברות' : 'הרשמה'}</h1>
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
          <label htmlFor='password'>סיסמה:</label>
          <input type='password' id='password' required onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          value={enteredPassword}/>
          {passwordInputHasError && (
          <p className="error-text">אורך הסיסמה חייב להיות 7 תווים לפחות.</p>
        )}
        </div>
        {error && <p className='errorMessage'>{errorMessage}</p>}
        <div className='actions'>
          {!isLoading && <button disabled={!formIsValid}>{isLogin ? 'כניסה' : 'יצירת חשבון'}</button>}
          {isLoading && !error && <LoadingSpinner />}
          <button
            type='button'
            className='toggle'
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'יצירת חשבון' : 'כניסה עם משתמש קיים'}
          </button>
          <button type='button' onClick={changePasswordHandler}
            className='toggle'>שכחתי סיסמה</button>
        </div>
      </form>
    </section>}
            {changePassword && <ChangePassword />}
    </>
  );
};

export default AuthForm;