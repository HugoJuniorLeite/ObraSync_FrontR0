import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 14px 12px 6px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #f5f5f5;
  font-size: 1rem;
  outline: none;
  transition: border 0.25s;
  /* margin-bottom:10px; */
  height:3rem;

  &:focus {
    border-color: #38bdf8;
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 6px;
    font-size: 0.7rem;
    color: #38bdf8;
  }
`;

const StyledLabel = styled.label`
  position: absolute;
  left: 10px;
  top: 14px;
  color: #94a3b8;
  pointer-events: none;
  transition: 0.25s;
  background: #0f172a;
  padding: 0 4px;
`;

export default function FloatingInput({ label, value, onChange, ...props }) {
  return (
    <Wrapper>
      <StyledInput placeholder=" " value={value} onChange={onChange} {...props} />
      <StyledLabel>{label}</StyledLabel>
    </Wrapper>
  );
}
