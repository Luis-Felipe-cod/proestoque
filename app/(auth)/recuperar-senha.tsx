import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';

export default function RecuperarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sucesso, setSucesso] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#000" />
             <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            {!sucesso ? (
              <>
                <Text style={styles.title}>Recuperar senha</Text>
                <Text style={styles.description}>Informe seu e-mail e enviaremos um link de recuperação</Text>
                <Input label="E-mail" placeholder="joao@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <View style={{ marginTop: 24 }}>
                  <Button label="Enviar" onPress={() => email && setSucesso(true)} fullWidth />
                </View>
              </>
            ) : (
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>✉️</Text>
                <Text style={styles.title}>E-mail enviado!</Text>
                <Text style={styles.description}>Verifique sua caixa de entrada</Text>
                <View style={{ marginTop: 24 }}>
                  <Button label="Voltar ao Login" onPress={() => router.replace('/(auth)/login')} variant="outline" fullWidth />
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  backText: { marginLeft: 8, fontSize: 16 },
  content: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  description: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },
  successContainer: { alignItems: 'center' },
  successIcon: { fontSize: 64, marginBottom: 16 }
});