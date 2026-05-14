import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Cadastro() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [erroSenha, setErroSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleCadastro = async () => {
    setErroSenha('');
    
    if (!form.nome || !form.email || !form.senha) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setErroSenha('As senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(form.email, form.senha, form.nome);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <LogoProEstoque size="md" />
              <Text style={styles.title}>Criar conta</Text>
            </View>

            <View style={styles.form}>
              <Input 
                label="Nome completo" 
                placeholder="João Silva" 
                value={form.nome} 
                onChangeText={(t) => updateForm('nome', t)} 
              />
              <Input 
                label="E-mail" 
                placeholder="joao@email.com" 
                value={form.email} 
                onChangeText={(t) => updateForm('email', t)} 
                keyboardType="email-address" 
                autoCapitalize="none" 
              />
              <Input 
                label="Senha" 
                placeholder="••••••" 
                value={form.senha} 
                onChangeText={(t) => updateForm('senha', t)} 
                secureTextEntry 
              />
              <Input 
                label="Confirmar senha" 
                placeholder="••••" 
                value={form.confirmarSenha} 
                onChangeText={(t) => updateForm('confirmarSenha', t)} 
                secureTextEntry 
                error={erroSenha} 
              />

              <Button 
                label="Criar Conta" 
                onPress={handleCadastro} 
                fullWidth 
                loading={isLoading} 
                disabled={isLoading} 
              />

              <TouchableOpacity onPress={() => router.back()} style={styles.footerLink}>
                <Text style={styles.footerText}>Já tenho conta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  form: { gap: 16 },
  footerLink: { alignItems: 'center', marginTop: 16 },
  footerText: { color: '#7c3aed', fontWeight: 'bold' },
});