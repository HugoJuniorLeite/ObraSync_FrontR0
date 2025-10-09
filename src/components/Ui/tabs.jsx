// // import * as TabsPrimitive from "@radix-ui/react-tabs";
// import styled from "styled-components";

// // Wrapper root
// export const Tabs = TabsPrimitive.Root;

// // Lista de abas
// export const TabsList = styled(TabsPrimitive.List)`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 0.5rem;
//   padding: 0.25rem;
//   background: #f3f4f6;
//   border-radius: 0.5rem;
// `;

// // Cada botão de aba
// export const TabsTrigger = styled(TabsPrimitive.Trigger)`
//   all: unset;
//   padding: 0.5rem 1rem;
//   text-align: center;
//   font-size: 0.875rem;
//   font-weight: 500;
//   border-radius: 0.375rem;
//   cursor: pointer;
//   color: #6b7280;
//   transition: all 0.2s ease-in-out;
//   background-color: transparent;

//   &[data-state='active'] {
//     background-color: #ffffff;
//     color: #7c3aed; /* purple-700 */
//     box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//   }

//   &:hover {
//     color: #7c3aed;
//   }
// `;

// // Conteúdo de cada aba (caso precise)
// export const TabsContent = styled(TabsPrimitive.Content)`
//   margin-top: 1rem;
//   background: #ffffff;
//   padding: 1rem;
//   border-radius: 0.375rem;
//   border: 1px solid #e5e7eb;
// `;







import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  width: 100%;
  margin: 2rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const TabsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 8px;
  gap: 0.5rem;
`;

export const TabButton = styled.button`
  all: unset;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: ${({ isActive }) => (isActive ? "#ffffff" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#7c3aed" : "#6b7280")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #7c3aed;
  }
`;

export const ContentBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: gray;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151;
`;
