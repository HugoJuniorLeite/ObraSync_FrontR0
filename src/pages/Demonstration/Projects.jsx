// import {
//   Root as TabsRoot,
//   List as TabsList,
//   Trigger as TabsTrigger,
//   Content as TabsContent,
// } from "@radix-ui/react-tabs";
// import ProjectForm from "../components/ProjectForm";
// import ProjectList from "../components/ProjectList";
// import GetOss from "./GetOSs";

// export default function Projects() {
//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Gestão de Projetos</h1>

//       <TabsRoot defaultValue="list">
//         <TabsList className="flex gap-4 border-b pb-2">
//           <TabsTrigger value="list">📋 Lista de Projetos</TabsTrigger>
//           <TabsTrigger value="create">➕ Novo Projeto</TabsTrigger>
//         </TabsList>

//         <TabsContent value="list" className="pt-4">
// <GetOss/>
//         </TabsContent>

//         <TabsContent value="create" className="pt-4">
//           <ProjectForm />
//         </TabsContent>
//       </TabsRoot>
//     </div>
//   );
// }
