import React, { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  PRODUTOS_MOCK,
  CATEGORIAS_MOCK,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque,
  formatarPreco,
  type Produto,
} from "../../src/data/mockData";
import { useAuth } from "../../src/contexts/AuthContext";
import { Colors, Typography, Spacing, Radius } from "../../src/constants/theme";

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const alertas = useMemo(() => getProdutosComEstoqueBaixo(), []);
  const valorTotal = useMemo(() => getValorTotalEstoque(), []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const cardsResumo = [
    {
      id: "total",
      titulo: "Produtos",
      valor: PRODUTOS_MOCK.length,
      icone: "cube-outline" as const,
    },
    {
      id: "alertas",
      titulo: "Alertas",
      valor: alertas.length,
      icone: "alert-circle-outline" as const,
    },
    {
      id: "categorias",
      titulo: "Categorias",
      valor: CATEGORIAS_MOCK.length,
      icone: "grid-outline" as const,
    },
    {
      id: "valor",
      titulo: "Em Estoque",
      valor: formatarPreco(valorTotal),
      icone: "cash-outline" as const,
    },
  ];

  const DashboardHeader = () => {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <View style={styles.userSection}>
          {/* Avatar com a inicial do nome real */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nome?.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>
          
          <View>
            <Text style={styles.greeting}>
              {saudacao}, {user?.nome?.split(" ")[0] || "Usuário"} 👋
            </Text>
            <Text style={styles.subtitle}>Visão geral do estoque</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => router.push("/(tabs)/produtos")}>
          <Ionicons name="add-circle" size={40} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

  const renderProduto = ({ item }: { item: Produto }) => {
    const emAlerta = item.quantidade < item.quantidadeMinima;
    const semEstoque = item.quantidade === 0;

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoIconContainer}>
          <Ionicons
            name={CATEGORIAS_MOCK.find((c) => c.id === item.categoriaId)?.icone as any ?? "cube-outline"}
            size={24}
            color={Colors.textSecondary}
          />
        </View>

        <View style={styles.produtoInfo}>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text style={styles.produtoQuantidade}>
            {item.quantidade} {item.unidade}
          </Text>
        </View>

        <View style={[
          styles.badge, 
          semEstoque ? styles.badgeSemEstoque : emAlerta ? styles.badgeBaixo : styles.badgeNormal
        ]}>
          <Text style={[
            styles.badgeText,
            semEstoque ? styles.textSemEstoque : emAlerta ? styles.textBaixo : styles.textNormal
          ]}>
            {semEstoque ? "Sem estoque" : emAlerta ? "Baixo" : "Normal"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FlatList<Produto>
        data={PRODUTOS_MOCK}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={DashboardHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[600]} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[10],
  },
  headerContainer: {
    marginBottom: Spacing[4],
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[6],
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary[100],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.primary[600],
  },
  greeting: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  resumoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  resumoCard: {
    width: "47.5%",
    backgroundColor: Colors.surface,
    padding: Spacing[4],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardIcon: {
    marginBottom: Spacing[2],
  },
  resumoValor: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  resumoTitulo: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  alertaContainer: {
    backgroundColor: Colors.danger.bg,
    padding: Spacing[4],
    borderRadius: Radius.lg,
    marginBottom: Spacing[6],
    borderWidth: 1,
    borderColor: Colors.danger.border,
  },
  alertaTitulo: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.danger.text,
    marginBottom: Spacing[3],
  },
  alertaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: "rgba(248, 113, 113, 0.2)",
  },
  alertaProduto: {
    color: Colors.danger.text,
  },
  alertaQuantidade: {
    color: Colors.danger.text,
    fontWeight: "bold",
  },
  alertaVerTodos: {
    color: Colors.danger.text,
    fontWeight: "bold",
    marginTop: Spacing[3],
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing[4],
  },
  produtoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: Spacing[4],
    borderRadius: Radius.lg,
    marginBottom: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  produtoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing[3],
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: Typography.fontSize.base,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  produtoQuantidade: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  badge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
  },
  badgeNormal: {
    backgroundColor: Colors.success.bg,
  },
  textNormal: {
    color: Colors.success.text,
  },
  badgeBaixo: {
    backgroundColor: Colors.warning.bg,
  },
  textBaixo: {
    color: Colors.warning.text,
  },
  badgeSemEstoque: {
    backgroundColor: Colors.danger.bg,
  },
  textSemEstoque: {
    color: Colors.danger.text,
  },
});