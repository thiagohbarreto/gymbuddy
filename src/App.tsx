import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import HamburgerMenu from "./components/HamburgerMenu/HamburgerMenu.tsx";
import Layout from "./components/Layout/Layout.tsx";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle.tsx";
import CriarTreino from "./pages/CriarTreino/CriarTreino.tsx";
import Treino from "./pages/Treino/Treino.tsx";
import NovaDivisao from "./pages/NovaDivisao/NovaDivisao.tsx";
import EditarTreino from "./pages/EditarTreino/EditarTreino.tsx";

function App() {
  return (
    <>
      <HamburgerMenu />
      <ThemeToggle />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nova-divisao" element={<NovaDivisao />} />
          <Route path="/treino/:divisao/:letra" element={<Treino />} />
          <Route path="/criar-treino" element={<CriarTreino />} />
          <Route path="/editar-treino/:id" element={<EditarTreino />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
