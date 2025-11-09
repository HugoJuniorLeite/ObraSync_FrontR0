// AutocompleteSelect.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
position:relative;
width:100%;
margin-bottom:1rem;
`;
const Input = styled.input`
  width:100%; padding:10px; border:1px solid #38bdf8; border-radius:8px;
  background:#0f172a; color:#fff; outline:none;
  &:focus{ box-shadow:0 0 0 2px #38bdf866; }
`;
const List = styled.ul`
  position:absolute; width:100%; margin-top:4px; background:#0f172a;
  border:1px solid #38bdf8; border-radius:8px; max-height:200px;
  overflow-y:auto; padding:6px 0; z-index:10;
`;
const Option = styled.li`
  padding:8px 12px; cursor:pointer; color:#e2e8f0;
  background:${p => (p.$active ? "#1e293b" : "transparent")};
  &:hover{ background:#1e293b; }
`;

export default function AutocompleteSelect({
  value,                // { value, label } ou null
  onChange,             // (opt) => void
  options = [],         // [{value,label}]
  placeholder = "Selecione...",
  strict = true         // true = só aceita itens da lista
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);

  const text = query || value?.label || "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter(o => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  // fecha ao clicar fora
  useEffect(() => {
    const onClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) {
        // strict: descarta texto solto e volta ao selecionado
        if (strict) setQuery("");
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [strict]);

  const commit = (opt) => {
    onChange?.(opt);
    setQuery("");       // limpa a busca
    setOpen(false);
    setHighlight(0);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight(h => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight(h => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[highlight];
      if (opt) commit(opt);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  // onBlur: em modo estrito, se digitou algo sem escolher, volta ao selecionado
  const onBlur = () => {
    if (strict) setQuery("");
  };

  return (
    <Wrapper ref={wrapRef}>
      <Input
        value={text}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        aria-expanded={open}
        aria-autocomplete="list"
        role="combobox"
      />

      {open && (
        <List role="listbox">
          {filtered.length === 0 && <Option>Nenhum resultado</Option>}
          {filtered.map((opt, i) => (
            <Option
              key={opt.value}
              $active={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => e.preventDefault()} // evita blur antes do click
              onClick={() => commit(opt)}
              role="option"
              aria-selected={i === highlight}
            >
              {opt.label}
            </Option>
          ))}
        </List>
      )}
    </Wrapper>
  );
}
