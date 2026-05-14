import React from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/contexts/AuthContext";
import { Button } from "../../src/components/Button";
import { Colors, Spacing, Typography, Radius } from "../../src/constants/theme";

export default function Configuracoes() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        style: "destructive", 
        onPress: async () => await logout() 
      },
    ]);
  };

  if (!user) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Configurações</Text>

        <View style={styles.perfilCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetra}>
              {user.nome ? user.nome.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
          <View style={styles.perfilInfo}>
            <Text style={styles.nome}>{user.nome}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            <Text style={styles.menuItemText}>Notificações</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="color-palette-outline" size={24} color={Colors.textPrimary} />
            <Text style={styles.menuItemText}>Aparência</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.textPrimary} />
            <Text style={styles.menuItemText}>Ajuda</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        <Button
          label="Sair da conta"
          onPress={handleLogout}
          variant="danger"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing[6] },
  titulo: { fontSize: 24, fontWeight: "bold", color: Colors.textPrimary, marginBottom: Spacing[6] },
  perfilCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: Spacing[4], 
    padding: Spacing[4], 
    backgroundColor: Colors.surface, 
    borderRadius: Radius.lg, 
    borderWidth: 1, 
    borderColor: Colors.border,
    marginBottom: Spacing[6]
  },
  avatar: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    backgroundColor: Colors.primary[600], 
    alignItems: "center", 
    justifyContent: "center" 
  },
  avatarLetra: { color: Colors.white, fontSize: 22, fontWeight: "bold" },
  perfilInfo: { flex: 1 },
  nome: { fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.textPrimary },
  email: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  menuGroup: { 
    backgroundColor: Colors.surface, 
    borderRadius: Radius.lg, 
    borderWidth: 1, 
    borderColor: Colors.border, 
    overflow: 'hidden' 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: Spacing[4], 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.border 
  },
  menuItemText: { 
    flex: 1, 
    fontSize: Typography.fontSize.base, 
    color: Colors.textPrimary, 
    marginLeft: Spacing[3] 
  },
});