import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LogoProEstoque({ size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: 18 },
    md: { icon: 32, text: 24 },
    lg: { icon: 48, text: 32 },
  };

  const { icon, text } = sizeMap[size];

  return (
    <View style={styles.container}>
      <Ionicons name="cube-outline" size={icon} color={Colors.primary[600]} />
      <Text style={[styles.text, { fontSize: text, color: Colors.primary[600] }]}>
        ProEstoque
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: 'bold',
  },
});