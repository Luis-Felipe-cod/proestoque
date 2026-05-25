import { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { CATEGORIAS_MOCK } from "../../../src/data/mockData";
import { Input } from "../../../src/components/Input";
import { Colors, Spacing } from "../../../src/constants/theme";

export default function ListaProdutos() {
  const { produtos } = useProducts();
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase().trim());
      const categoriaOk = categoriaAtiva ? p.categoriaId === categoriaAtiva : true;
      return buscaOk && categoriaOk;
    });
  }, [produtos, busca, categoriaAtiva]);

  const renderProduto = useCallback(({ item }: any) => {
    const emAlerta = item.quantidade < item.quantidadeMinima;
    const semEstoque = item.quantidade === 0;

    return (
      <TouchableOpacity onPress={() => router.push(`/(tabs)/produtos/${item.id}`)} style={styles.item}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{item.nome}</Text>
          <Text style={styles.itemQtd}>{item.quantidade} {item.unidade}</Text>
        </View>
        <View style={[styles.badge, semEstoque ? styles.badgeSemEstoque : emAlerta ? styles.badgeAlerta : styles.badgeNormal]}>
          <Text style={[styles.badgeText, semEstoque ? {color: Colors.danger.text} : emAlerta ? {color: Colors.warning.text} : {color: Colors.success.text}]}>
            {semEstoque ? "Sem estoque" : emAlerta ? "Baixo" : "Normal"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={{fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8}}>Produtos</Text>
            <Input value={busca} onChangeText={setBusca} placeholder="Buscar produto..." autoCapitalize="none" />
            <View style={styles.chips}>
              {CATEGORIAS_MOCK.map((cat) => (
                <TouchableOpacity key={cat.id} style={[styles.chip, categoriaAtiva === cat.id && styles.chipAtivo]} onPress={() => setCategoriaAtiva(p => p === cat.id ? null : cat.id)}>
                  <Text style={[styles.chipText, categoriaAtiva === cat.id && styles.chipTextoAtivo]}>{cat.nome}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        ListFooterComponent={<View style={{ height: 80 }} />}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="cube-outline" size={48} color={Colors.neutral[400]} />
            <Text style={styles.vazioText}>Nenhum produto encontrado</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing[6] }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/(tabs)/produtos/novo")}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: { paddingTop: Spacing[6], gap: Spacing[3], marginBottom: Spacing[4] },

  chips: { flexDirection: "row", gap: Spacing[2], flexWrap: "wrap" },

  chip: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderRadius: 999, backgroundColor: Colors.neutral[100] },

  chipAtivo: { backgroundColor: Colors.primary[600] },

  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: "500" },
  
  chipTextoAtivo: { color: Colors.white },
  
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: Spacing[4], backgroundColor: Colors.surface, borderRadius: 12, marginBottom: Spacing[2], borderWidth: 1, borderColor: Colors.border },
  
  itemInfo: { flex: 1 },
  
  itemNome: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary },
  
  itemQtd: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  
  badgeNormal: { backgroundColor: Colors.success.bg },
  
  badgeAlerta: { backgroundColor: Colors.warning.bg },
  
  badgeSemEstoque: { backgroundColor: Colors.danger.bg },
  
  badgeText: { fontSize: 12, fontWeight: "bold" },
  
  vazio: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: Spacing[3] },
  
  vazioText: { color: Colors.textSecondary, fontSize: 16 },
  
  fab: { position: "absolute", bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary[600], alignItems: "center", justifyContent: "center", elevation: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6 },
});