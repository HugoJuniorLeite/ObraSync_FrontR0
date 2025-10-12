// import { ErrorText, StyledInput, StyledLabel, StyledMaskInput } from "../../layouts/Theme";


// export function Input({label, register, name, mask, definitions, error, ...rest }) {

//   return (
//     <div>
//       {label && <StyledLabel >{label}</StyledLabel>}

//       {mask ? (
//         <StyledMaskInput
//           mask={mask}
//           definitions={definitions}
//           {...register(name)}
//           {...rest}
//           className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//           />
//       ) : (
//         <StyledInput
//         {...(register && name ? register(name) : {})} // <- só aplica register se existir
//           {...rest}
//         />
//       )}
//       {error && <ErrorText>{error.message}</ErrorText>}
//     </div>
//   );
// }

import { ErrorText, StyledInput, StyledLabel, StyledMaskInput } from "../../layouts/Theme";

export function Input({ label, register, name, mask, definitions, error, ...rest }) {
  const registerProps = typeof register === "function" && name ? register(name) : {};

  return (
    <div>
      {label && <StyledLabel>{label}</StyledLabel>}

      {mask ? (
        <StyledMaskInput
          mask={mask}
          definitions={definitions}
          {...registerProps}   // aplica register se existir
          {...rest}            // aplica value, onChange, type, etc.
          className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <StyledInput
          {...registerProps}   // aplica register se existir
          {...rest}            // aplica value, onChange, type, etc.
        />
      )}

      {error && <ErrorText>{error.message}</ErrorText>}
    </div>
  );
}

