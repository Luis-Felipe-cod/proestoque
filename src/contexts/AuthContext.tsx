import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const STORAGE_KEYS = {
  TOKEN: '@proestoque:token',
  USER: '@proestoque:user'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadStorageData() {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    }
    loadStorageData();
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { usuario, token } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)]
      ]);

      setUser(usuario);
    } catch (error: any) {
      const mensagem = error.response?.data?.erro ?? 'Erro ao iniciar sessão';
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registrar = useCallback(async (nome: string, email: string, senha: string) => {
    setIsLoading(true);
    try {

      const response = await api.post('/auth/registro', { nome, email, senha });
      const { usuario, token } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)]
      ]);

      setUser(usuario);
    } catch (error: any) {
      const mensagem = error.response?.data?.erro ?? 'Erro ao criar conta';
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}