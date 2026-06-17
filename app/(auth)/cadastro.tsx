import { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Input } from '../../src/components/Input';
import { Colors, Spacing } from '../../src/constants/theme';

export default function Cadastro() {
  const router = useRouter();  
  const { registrar, isLoading } = useAuth();  
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [erroSenha, setErroSenha] = useState('');

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
    
    if (form.senha.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    try {
      await registrar(form.nome, form.email, form.senha);

    } catch (error: any) {
      Alert.alert("Erro ao criar conta", error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Criar Conta</Text>
          <Text style={styles.subtitulo}>Preencha os dados para se cadastrar</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome completo</Text>
          <Input 
            placeholder="Seu nome" 
            value={form.nome} 
            onChangeText={(text: string) => updateForm('nome', text)} 
          />

          <Text style={styles.label}>E-mail</Text>
          <Input 
            placeholder="seu@email.com" 
            keyboardType="email-address" 
            autoCapitalize="none"
            value={form.email} 
            onChangeText={(text: string) => updateForm('email', text)} 
          />

          <Text style={styles.label}>Senha</Text>
          <Input 
            placeholder="No mínimo 6 caracteres" 
            secureTextEntry 
            value={form.senha} 
            onChangeText={(text: string) => updateForm('senha', text)} 
          />

          <Text style={styles.label}>Confirmar Senha</Text>
          <Input 
            placeholder="Repita sua senha" 
            secureTextEntry 
            value={form.confirmarSenha} 
            onChangeText={(text: string) => updateForm('confirmarSenha', text)} 
          />
          {erroSenha ? <Text style={styles.erroText}>{erroSenha}</Text> : null}

          <TouchableOpacity 
            style={[styles.botao, isLoading && styles.botaoDisabled]} 
            onPress={handleCadastro}
            disabled={isLoading}
          >
            <Text style={styles.botaoTexto}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.link}>Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: Spacing[6], justifyContent: 'center' },
  
  header: { marginBottom: Spacing[6] },
  titulo: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing[2] },
  subtitulo: { fontSize: 16, color: Colors.textSecondary },
  
  form: { gap: Spacing[3] },
  label: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: -4, marginTop: Spacing[2] },
  erroText: { color: Colors.danger.text, fontSize: 12, marginTop: -4 },
  
  botao: { backgroundColor: Colors.primary[600], padding: Spacing[4], borderRadius: 8, alignItems: 'center', marginTop: Spacing[4] },
  botaoDisabled: { opacity: 0.7 },
  botaoTexto: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing[6], gap: Spacing[2] },
  footerText: { color: Colors.textSecondary, fontSize: 14 },
  link: { color: Colors.primary[600], fontSize: 14, fontWeight: 'bold' },
});