import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { LogoProEstoque } from '@/src/components/LogoProEstoque';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/src/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> 
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 60, default: 0 })}>
        <ThemedView style={styles.container}>
          <LogoProEstoque size="lg" />
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            icon="envelope"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry={!showPassword}
            icon="lock.fill"
            rightIcon={showPassword ? 'eye.slash' : 'eye.fill'}
            onRightIconPress={() => setShowPassword((current) => !current)}
          />
          <View style={styles.forgotRow}>
            <Link href="/recuperar-senha" style={[styles.link, { color: theme.tint }]}>Esqueci minha senha</Link>
          </View>
          <Button
            title="Entrar"
            fullWidth
            onPress={() => router.replace('/')}
            style={styles.primaryButton}
          />
          <View style={styles.footerRow}>
            <ThemedText>Não tem conta?</ThemedText>
            <Link href="/cadastro" style={[styles.link, { color: theme.tint }]}>Criar conta</Link>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 20,
  },
  logo: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
  },
  forgotRow: {
    alignItems: 'flex-end',
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
  },
});
