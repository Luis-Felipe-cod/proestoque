import { useState } from 'react';
import { ScrollView, SafeAreaView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { LogoProEstoque } from '@/src/components/LogoProEstoque';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/src/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  function handleCreateAccount() {
    if (password !== confirmPassword) {
      setPasswordError('As senhas não correspondem');
      return;
    }

    setPasswordError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> 
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ThemedView style={styles.container}>
          <LogoProEstoque size="md" />
          <ThemedText type="title" style={styles.title}>
            Criar conta
          </ThemedText>
          <Input label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="envelope"
          />
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
            icon="lock.fill"
          />
          <Input
            label="Confirmar senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="********"
            secureTextEntry
            icon="lock.fill"
            error={passwordError}
          />

          <Button title="Criar Conta" fullWidth loading={loading} onPress={handleCreateAccount} />

          <View style={styles.footerRow}>
            <ThemedText>Já tem conta?</ThemedText>
            <Link href="/login" style={[styles.link, { color: theme.tint }]}>Voltar ao Login</Link>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    gap: 18,
  },
  title: {
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  link: {
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
