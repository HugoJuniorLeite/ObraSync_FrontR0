import { IMaskInput } from "react-imask";
import { Link } from "react-router-dom";
import styled from "styled-components";



// Definindo cores base (padrão Material Design)

export const colors = {
  background: "#2c2c2c", // cinza grafite
  surface: "#3a3a3a", // cinza médio
  input: "#4a4a4a", // cinza escuro
  border: "#666666",
  text: /*"#f9f9f9"*/"#e0e0e0", // branco suave
  accent: "#fdb000", // amarelo destaque
  error: "#fdb000",
     gray: "#cccccc"
};

export const TextArea = styled.textarea`
  padding: 0.5rem;
  background-color: #1e1e1e;
  border: 1px solid #374151;
  border-radius: 0.25rem;
  color: white;
  width: 100%;
`;

export const Logo = styled.img`
  transform: translateY(-100px);
  width: 100%;
  max-width: 400px;
  height: auto;
  display: block;
  margin: 0 auto 2rem auto;
  @media (max-width: 768px) {
    max-width: 250px;
  }
`;

// Definindo container 
export const FormWrapper = styled.div`
  height: 100vh;
  width: 100%;
  padding: 40px 50px;
  background-color: ${colors.surface};
  box-shadow: 0 0 15px rgba(253, 176, 0, 0.15);
  
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  overflow-y:auto;

`;

//Definindo titulo
export const FormTitle = styled.h2`
  color: ${colors.accent};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
  margin-top:40px;
`;

// Definindo label
export const StyledLabel = styled.label`
  display: block;
  color: ${colors.text};
  margin-bottom: 6px;
  font-size: 16px;
   font-weight: bold;
`;


// Definindo Input
export const StyledInput = styled.input`
  width: 99%;
  padding: 12px;
  background-color: ${colors.input};
  color: ${colors.text};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  font-size: 16px;
  transition: 0.3s ease;
  margin-bottom:6px;
    cursor: pointer;




  &:hover {
       border-color: ${colors.accent};
    outline: none;
    }

    &:focus {
  border: 1px solid #f5a400;
  box-shadow: 0 0 4px rgba(245,164,0,0.6);
  outline: none;
}
/*   
  &:focus {
    border-color: ${colors.accent};
    outline: none;
  } */
   &::placeholder {
     color: ${colors.gray};
   }
`;


export const StyledMaskInput = styled(IMaskInput)`
  width: 100%;
  padding: 12px;
  background-color: ${colors.input};
  color: ${colors.text};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  font-size: 16px;
  transition: 0.3s ease;
  margin-bottom:6px;
    cursor: pointer;
  &:hover {
       border-color: ${colors.accent};
    outline: none;
    }

  &:focus {
    border-color: ${colors.accent};
    outline: none;
  }
   &::placeholder {
     color: ${colors.gray};
   }
`;

//Definindo mensagem de erro
export const ErrorText = styled.p`
  color: ${colors.error};
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

//Definindo botão de envio
export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 30px;
  margin-right:5px;
  background-color: ${colors.accent};
  color: #1f1f1f;
  font-weight: 600;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  transition: 0.3s ease;
  cursor: pointer;
  margin-bottom:5px;

  &:hover {
    background-color: #ffc300;
  }
`;


//Definindo estilos dos botoẽs e inputs do token

export const RowButton = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;


  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;


export const InputWraper = styled.div`
  width: 100%;
  /* margin-top:100px; */
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* transform: translateY(-180px); */
`;

export const RowInput = styled.div`
display:flex;
justify-content:space-between;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    display:flex;
    flex-direction:column;
  }
`;

export const RowInputData = styled.div`
display:flex;
justify-content:space-between;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    display:flex;
    flex-direction:column;
  }
`;

export const RowDespech = styled.div`
display:flex;
/* flex-direction:column; */
justify-content:flex-start;
align-items:center;

/* align-self:center; */

  @media (max-width: 768px) {
    /* grid-template-columns: 1fr; */
    display:flex;
    /* flex-direction:column; */
  }
`;


export const StyledInputToken = styled.input`
    width: 2.2rem;
    height:2.3rem;
   padding: 12px;
  margin:12px;
  background-color: ${colors.input};
  color: ${colors.text};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  font-size: 16px;
  transition: 0.3s ease;
  cursor: pointer;
  &:focus {
    border-color: ${colors.accent};
    outline: none;
  }
   &::placeholder {
     color: ${colors.gray};
   }
`;


//Definindo input com seletor
export const Select = styled.select`
  width: 100%;
  padding: 12px;
  background-color: ${colors.input};
  color: ${colors.text};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  font-size: 16px;
  /* margin-top:6px; */
  margin-bottom:6px;
  transition: 0.3s ease;
  cursor: pointer;
  &:hover {
       border-color: ${colors.accent};
    outline: none;
    }

   &:focus {
    border-color: ${colors.accent};
    outline: none;
  };
    
`;


// Container da listagem
export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

// Cabeçalho da tabela
export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 1.5fr 1fr 2fr 1.2fr 1fr 1fr 1fr 1.5fr 1fr 1fr 1fr;
  background-color: #f3f4f6;
  padding: 0.75rem;
  font-weight: 600;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  align-items: center;
`;

// Cada cartão de serviço (linha da listagem)
export const Card = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 1.5fr 1fr 2fr 1.2fr 1fr 1fr 1fr 1.5fr 1fr 1fr 1fr;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #1f2937;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #2563eb;
  }
`;


export const RowItem = styled.div`
  flex: 1;
  padding: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
`;


export const TableRow = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;



export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #2c2c2e;
  padding: 20px;
  border-radius: 12px;
`;
export const ListItem = styled.div`
  background-color: #333d40;
  border: 1px solid #fdb000;
  border-radius: 10px;
  padding: 16px;
  color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(253, 176, 0, 0.3);
  }
`;
export const ListTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #fdb000;
  margin-bottom: 8px;
`;

export const ListSubtitle = styled.p`
  font-size: 14px;
  color: #ccc;
  margin: 0;
`;
export const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

export const Field = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 0.25rem;
`;

export const P = styled.p`
  color: ${colors.text};
  font-size: 25px;
  margin-top: 4px;
`;


export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;


  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;


// continua


export const Container = styled.div`
height:100vh;
width: 100vw;
    background-color: ${colors.surface};
`

export const StyledLink = styled(Link)`
  font-size: 14pxk;
  line-height: 17px;
  text-decoration: underline;
  color: white;
  padding-left:15px;
  
`

export const Section = styled.section`


`

export const Main = styled.section`
 
`

// export const StyledSelect = styled.select`
//   width: 100%;
//   min-height: 100px;
//   padding: 10px;
//   background-color: #2e2e2e;
//   color: #f0e68c;
//   border: 1px solid #f0e68c;
//   border-radius: 10px;
//   font-size: 14px;
//   font-family: 'Segoe UI', sans-serif;
//   outline: none;
//   transition: border 0.3s ease, box-shadow 0.3s ease;

//   &:focus {
//     border: 1px solid #ffeb3b;
//     box-shadow: 0 0 5px 2px rgba(255, 235, 59, 0.5);
//   }

//   option {
//     background-color: #3a3a3a;
//     color: #f0e68c;
//     padding: 5px;
//   }
// `;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 12px;
  background-color: ${colors.input};
  color: ${colors.text};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  font-size: 16px;
  /* margin-top:6px; */
  margin-bottom:6px;
  transition: 0.3s ease;
    cursor: pointer;
    &:hover {
       border-color: ${colors.accent};
    outline: none;
    }
   &:focus {
    border-color: ${colors.accent};
    outline: none;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const ContractCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: sans-serif;
`;

export const ContractTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
`;

export const ContractDates = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const ContractPrice = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin-top: 0.5rem;
  text-align: right;
`;


export const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
`;

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  position: relative;
    color: ${colors.text};
    margin-bottom:15px;
margin-top:10px;
`;

export const StyledCheckbox = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 4px;
  border: 2px solid ${colors.input};
  transition: all 150ms;
  position: relative;
    cursor: pointer;
  &:hover {
       border-color: ${colors.accent};
    outline: none;
    }
  // Quando marcado, muda a cor
  ${HiddenCheckbox}:checked + & {
    background: ${colors.accent};
    padding-bottom: 10px; 
  }
  // Ícone de check
  &::after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 0px;
    width: 5px;
    height: 10px;
    border: solid ${colors.background};
    border-width: 0 4px 4px 0;
    transform: rotate(45deg);
  }
  ${HiddenCheckbox}:checked + &::after {
    display: block;
  }
`;


export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    width: "100%",
    backgroundColor: colors.input,
    color: colors.text,
    border: `1px solid ${state.isFocused ? colors.accent : colors.border}`,
    borderRadius: 12,
    marginBottom:"6px",
    padding: "12px",
    fontSize: 16,
    transition: "0.3s ease",
    boxShadow: "none",
    cursor: "pointer",
    "&:hover": {
      borderColor: colors.accent,
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: colors.gray,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: colors.text,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: colors.input,
    borderRadius: 12,
    marginTop: 4,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? colors.accent : colors.input,
    color: colors.text,
    cursor: "pointer",
    ":active": {
      backgroundColor: colors.accent,
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: colors.accent,
    borderRadius: 6,
    padding: "2px 6px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: colors.text,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: colors.text,
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.error,
      color: colors.text,
    },
  }),
};



export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* garante que fique acima do conteúdo */
`;

export const ModalContent = styled.div`
  background: ${colors.surface};
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* opcional, deixa mais elegante */
`;

export const ButtonSecondary = styled.button`
  width: 100%;
  padding: 0.7rem;
  margin-top: 0.8rem;
  margin-bottom:8px;
  background: transparent;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  background: #444;
  color: #f5a400;
  border: 1px solid #f5a400;

  &:hover {
    background: #f5a400;
    color: #000;
  }

  &:active {
    transform: scale(0.97);
  }
`
