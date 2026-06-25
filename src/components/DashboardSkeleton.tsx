import { View, StyleSheet } from "react-native";
import { Skeleton } from "./Skeleton";
import { Colors, Spacing } from "@/src/constants/theme";

// Skeleton para os 3 cards de resumo do dashboard
function CardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={40} height={40} borderRadius={8} />
      <Skeleton width="50%" height={20} style={{ marginTop: Spacing[3] }} />
      <Skeleton width="70%" height={13} style={{ marginTop: 4 }} />
    </View>
  );
}

// Skeleton para um item de produto no dashboard
function ProdutoItemSkeleton() {
  return (
    <View style={styles.produtoItem}>
      <Skeleton width="55%" height={14} />
      <Skeleton width={60} height={14} />
    </View>
  );
}

// Skeleton completo do dashboard: saudação + cards + lista
export function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Saudação */}
      <View style={styles.saudacao}>
        <Skeleton width={120} height={16} />
        <Skeleton width={180} height={28} style={{ marginTop: 4 }} />
      </View>

      {/* Cards de resumo */}
      <View style={styles.cardsContainer}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </View>

      {/* Título da seção */}
      <Skeleton width={160} height={18} style={{ marginBottom: Spacing[3], marginTop: Spacing[2] }} />

      {/* Lista de produtos */}
      {Array.from({ length: 5 }).map((_, i) => (
        <ProdutoItemSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing[6], paddingBottom: 100 },
  saudacao: { marginBottom: Spacing[6] },
  cardsContainer: { flexDirection: "row", flexWrap: "wrap", gap: Spacing[3], marginBottom: Spacing[6] },
  card: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.surface,
    padding: Spacing[4],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "flex-start",
  },
  produtoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing[4],
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
