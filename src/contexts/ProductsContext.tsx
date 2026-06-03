import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import type { Produto } from "../data/mockData";
import type { ProdutoFormData } from "../schemas/produtoSchema";

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); 
  const carregarProdutos = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos do banco:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    try {
      const response = await api.post('/produtos', data);
      setProdutos((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      throw error;
    }
  }, []);

  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    try {
      const response = await api.put(`/produtos/${id}`, data);
      setProdutos((prev) => prev.map((p) => (p.id === id ? response.data : p)));
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      throw error;
    }
  }, []);

  const deletarProduto = useCallback(async (id: string) => {
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  }, []);

  const getProdutoById = useCallback((id: string) => {
    return produtos.find((p) => p.id === id);
  }, [produtos]);

  return (
    <ProductsContext.Provider 
      value={{ 
        produtos, 
        isLoading, 
        carregarProdutos, 
        adicionarProduto, 
        editarProduto, 
        deletarProduto, 
        getProdutoById 
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  return context;
}