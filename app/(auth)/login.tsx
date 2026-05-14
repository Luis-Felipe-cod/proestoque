import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <View style={styles.header}>
            <LogoProEstoque size="lg" />
            <Text style={styles.subtitle}>Bem-vindo de volta</Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="E-mail" placeholder="joao@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
            />
            <Input 
              label="Senha" placeholder="••••••••" value={senha} onChangeText={setSenha} secureTextEntry={true}
            />
            
            <TouchableOpacity onPress={() => router.push('/(auth)/recuperar-senha')} style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button label="Entrar" onPress={handleLogin} fullWidth />

            <View style={styles.footer}>
              <Text>Não tem conta? </Text>
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
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
  form: { gap: 16 },
  forgotPassword: { alignSelf: 'flex-end' },
  forgotText: { color: '#7c3aed', fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerText: { color: '#7c3aed', fontWeight: 'bold' }
});