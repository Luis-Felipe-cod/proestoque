import { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const { registrar, isLoading } = useAuth();

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await registrar(nome, email, senha);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erro no Registo', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os seus dados para começar</Text>
        </View>

        <View style={styles.form}>
          <Input label="Nome completo" placeholder="Digite o seu nome" value={nome} onChangeText={setNome} autoCapitalize="words" />
          <Input label="E-mail" placeholder="Digite o seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Senha" placeholder="Crie uma senha" value={senha} onChangeText={setSenha} secureTextEntry />
          <Input label="Confirmar Senha" placeholder="Confirme a sua senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

          {isLoading ? (
            <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 20 }} />
          ) : (
            <Button label="Registar" onPress={handleCadastro} />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Iniciar Sessão</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc', justifyContent: 'center' },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b' },
  form: { gap: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: '#64748b', fontSize: 14 },
  loginLink: { color: '#0284c7', fontSize: 14, fontWeight: 'bold' },
});