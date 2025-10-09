import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// import { BrowserRouter } from 'react-router-dom'
// import GlobalStyle from './layouts/GlobalStyle.jsx'
// import RdoForm from './components/RdoForms/RdoFomrExtensionInative.jsx'
// import { FormProvider } from './components/RdoForms/FormContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BrowserRouter> */}
      {/* <GlobalStyle /> */}
        {/* <FormProvider> */}
             {/* <RdoForm /> */}
      <App />

        {/* </FormProvider> */}
    {/* </BrowserRouter> */}
  </StrictMode>,
)
