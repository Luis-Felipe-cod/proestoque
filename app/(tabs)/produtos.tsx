import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { PRODUTOS_MOCK, CATEGORIAS_MOCK, type Produto } from '../../src/data/mockData';
import { Colors, Typography, Spacing, Radius } from '../../src/constants/theme';

export default function ProdutosScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState<string | 'Todos'>('Todos');
  
  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter(produto => {
      const matchCategoria = categoriaSelecionadaId === 'Todos' || produto.categoriaId === categoriaSelecionadaId;
      const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
      
      return matchCategoria && matchBusca;
    });
  }, [busca, categoriaSelecionadaId]);

  const renderBadge = (produto: Produto) => {
    const semEstoque = produto.quantidade === 0;
    const emAlerta = produto.quantidade < produto.quantidadeMinima;

    return (
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
    );
  };

  const renderProduto = ({ item }: { item: Produto }) => {
    const iconeCategoria = CATEGORIAS_MOCK.find((c) => c.id === item.categoriaId)?.icone ?? "cube-outline";

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoIconContainer}>
          <Ionicons name={iconeCategoria as any} size={24} color={Colors.textSecondary} />
        </View>

        <View style={styles.produtoInfo}>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text style={styles.produtoQuantidade}>
            {item.quantidade} {item.unidade}
          </Text>
        </View>

        {renderBadge(item)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.pageTitle}>Produtos</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={Colors.textSecondary}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.chipsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: 'Todos', nome: 'Todos' }, ...CATEGORIAS_MOCK]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: Spacing[6] }}
          renderItem={({ item }) => {
            const isSelected = categoriaSelecionadaId === item.id;
            return (
              <TouchableOpacity 
                style={[styles.chip, isSelected && styles.chipAtivo]}
                onPress={() => setCategoriaSelecionadaId(item.id)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextAtivo]}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pageTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[6],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing[6],
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing[3],
    marginLeft: Spacing[2],
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.base,
  },
  chipsContainer: {
    marginTop: Spacing[4],
    marginBottom: Spacing[4],
  },
  chip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    marginRight: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipAtivo: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  chipText: {
    color: Colors.textSecondary,
    fontWeight: "500",
    fontSize: Typography.fontSize.sm,
  },
  chipTextAtivo: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[10],
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
    marginBottom: 2,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing[12],
  },
  emptyText: {
    color: Colors.textSecondary,
    marginTop: Spacing[2],
    fontSize: Typography.fontSize.md,
  },
});