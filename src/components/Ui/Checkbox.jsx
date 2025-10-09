import { CheckboxContainer, HiddenCheckbox, StyledCheckbox } from "../../layouts/Theme";



export default function Checkbox({ label, register, name, defaultChecked }) {
  return (
    <CheckboxContainer>
      <HiddenCheckbox {...register(name)} defaultChecked={defaultChecked} />
      {label}
      <StyledCheckbox />
    </CheckboxContainer>
  );
}