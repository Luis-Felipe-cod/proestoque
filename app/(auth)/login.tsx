import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { useAuth } from '../../src/contexts/AuthContext';
import { Colors, Spacing } from '../../src/constants/theme';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    try {
      await login(email, senha);
    } catch (error) {
      Alert.alert("Erro", "Falha ao realizar o login. Tente novamente.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <View style={styles.header}>
            <LogoProEstoque size="lg" />
            <Text style={styles.subtitle}>Bem-vindo de volta 👋</Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="E-mail" 
              placeholder="joao@email.com" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address" 
              autoCapitalize="none"
            />
            <Input 
              label="Senha" 
              placeholder="••••••••" 
              value={senha} 
              onChangeText={setSenha} 
              secureTextEntry={true}
            />
            
            <TouchableOpacity onPress={() => router.push('/(auth)/recuperar-senha')} style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button label="Entrar" onPress={handleLogin} fullWidth loading={isLoading} disabled={isLoading} />

            <View style={styles.footer}>
              <Text style={{ color: Colors.textSecondary }}>Não tem conta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
                <Text style={styles.registerText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing[6], justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: Spacing[10] },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: Spacing[2] },
  form: { gap: Spacing[4] },
  forgotPassword: { alignSelf: 'flex-end' },
  forgotText: { color: Colors.primary[600], fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing[6] },
  registerText: { color: Colors.primary[600], fontWeight: 'bold' }
});