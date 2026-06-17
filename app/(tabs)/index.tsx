import { useMemo, useCallback, useState } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAuth } from "../../src/contexts/AuthContext";
import { useProducts } from "../../src/contexts/ProductsContext";
import { LoadingView } from "../../src/components/LoadingView";
import { formatarPreco } from "../../src/utils/formatters";
import { Colors, Spacing } from "../../src/constants/theme";

export default function HomeScreen() {
  const { user } = useAuth();
  const { produtos, isLoading, carregarProdutos } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const alertas = useMemo(
    () => produtos.filter(p => p.quantidade < p.quantidadeMinima),
    [produtos]
  );

  const valorTotalEstoque = useMemo(
    () => produtos.reduce((acc, p) => acc + p.quantidade * p.preco, 0),
    [produtos]
  );

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const primeiroNome = user?.nome?.split(" ")[0] ?? "Usuário";

  const cardsResumo = useMemo(() => [
    { id: "total", titulo: "Produtos", valor: produtos.length, icone: "cube-outline" as const, cor: Colors.primary[600] },
    { id: "alertas", titulo: "Alertas", valor: alertas.length, icone: "alert-circle-outline" as const, cor: Colors.warning.text },
    { id: "valor", titulo: "Valor em estoque", valor: formatarPreco(valorTotalEstoque), icone: "cash-outline" as const, cor: Colors.success.text },
  ], [produtos.length, alertas.length, valorTotalEstoque]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  if (isLoading && produtos.length === 0) {
    return <LoadingView mensagem="Carregando dashboard..." />;
  }

  const DashboardHeader = () => (
    <View style={styles.headerContainer}>
      {/* Saudação */}
      <View style={styles.saudacaoContainer}>
        <Text style={styles.saudacao}>{saudacao},</Text>
        <Text style={styles.nome}>{primeiroNome} 👋</Text>
      </View>
      <View style={styles.cardsContainer}>
        {cardsResumo.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: card.cor + "15" }]}>
              <Ionicons name={card.icone} size={24} color={card.cor} />
            </View>
            <Text style={styles.cardValor}>{card.valor}</Text>
            <Text style={styles.cardTitulo}>{card.titulo}</Text>
          </View>
        ))}
      </View>
      {alertas.length > 0 && (
        <View style={styles.alertasContainer}>
          <View style={styles.alertasHeader}>
            <Ionicons name="warning" size={20} color={Colors.warning.text} />
            <Text style={styles.alertasTitulo}>Estoque crítico ({alertas.length})</Text>
          </View>
          
          {alertas.slice(0, 3).map(p => (
            <TouchableOpacity 
              key={p.id} 
              style={styles.alertaItem}
              onPress={() => router.push(`/(tabs)/produtos/${p.id}`)}
            >
              <Text style={styles.alertaNome}>{p.nome}</Text>
              <Text style={styles.alertaQtd}>{p.quantidade} / {p.quantidadeMinima} {p.unidade}</Text>
            </TouchableOpacity>
          ))}
          
          {alertas.length > 3 && (
            <TouchableOpacity onPress={() => router.push("/(tabs)/produtos")}>
              <Text style={styles.verMais}>Ver todos os produtos em alerta</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Text style={styles.sectionTitle}>Todos os Produtos</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(tabs)/produtos/${item.id}`)} style={styles.produtoItem}>
            <Text style={styles.produtoNome}>{item.nome}</Text>
            <Text style={styles.produtoPreco}>{formatarPreco(item.preco)}</Text>
          </TouchableOpacity>
        )}
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
  safe: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: Spacing[6], paddingBottom: 100 },
  headerContainer: { marginBottom: Spacing[4] },
  
  saudacaoContainer: { marginBottom: Spacing[6] },
  saudacao: { fontSize: 16, color: Colors.textSecondary },
  nome: { fontSize: 28, fontWeight: "bold", color: Colors.textPrimary },
  
  cardsContainer: { flexDirection: "row", flexWrap: "wrap", gap: Spacing[3], marginBottom: Spacing[6] },
  card: { flex: 1, minWidth: "45%", backgroundColor: Colors.surface, padding: Spacing[4], borderRadius: 16, borderWidth: 1, borderColor: Colors.border, alignItems: "flex-start" },
  iconContainer: { padding: Spacing[2], borderRadius: 8, marginBottom: Spacing[3] },
  cardValor: { fontSize: 20, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 2 },
  cardTitulo: { fontSize: 13, color: Colors.textSecondary },
  
  alertasContainer: { backgroundColor: Colors.warning.bg, padding: Spacing[4], borderRadius: 16, marginBottom: Spacing[6], borderWidth: 1, borderColor: Colors.warning.border },
  alertasHeader: { flexDirection: "row", alignItems: "center", gap: Spacing[2], marginBottom: Spacing[3] },
  alertasTitulo: { fontSize: 16, fontWeight: "bold", color: Colors.warning.text },
  alertaItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: Spacing[2], borderBottomWidth: 1, borderBottomColor: Colors.warning.border },
  alertaNome: { fontSize: 14, color: Colors.textPrimary, fontWeight: "500" },
  alertaQtd: { fontSize: 14, color: Colors.warning.text, fontWeight: "bold" },
  verMais: { marginTop: Spacing[3], textAlign: "center", color: Colors.warning.text, fontWeight: "600", fontSize: 14 },
  
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: Colors.textPrimary, marginBottom: Spacing[3], marginTop: Spacing[2] },
  produtoItem: { flexDirection: "row", justifyContent: "space-between", padding: Spacing[4], backgroundColor: Colors.surface, borderRadius: 12, marginBottom: Spacing[2], borderWidth: 1, borderColor: Colors.border },
  produtoNome: { fontSize: 15, color: Colors.textPrimary, fontWeight: "500" },
  produtoPreco: { fontSize: 15, color: Colors.success.text, fontWeight: "600" },
});