import { useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { produtoSchema, type ProdutoFormData } from "../../../src/schemas/produtoSchema";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { CATEGORIAS_MOCK } from "../../../src/data/mockData";
import { Input } from "../../../src/components/Input";
import { Button } from "../../../src/components/Button";
import ImagePickerField from "../../../src/components/ImagePicker";
import { Colors, Spacing, Radius } from "../../../src/constants/theme";

const UNIDADES = ["un", "kg", "cx", "L", "m"];

export default function FormularioProduto() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const modoEdicao = !!id;

  const { adicionarProduto, editarProduto, deletarProduto, getProdutoById } = useProducts();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: { 
      nome: "", 
      categoriaId: CATEGORIAS_MOCK[0].id, 
      quantidade: 0, 
      quantidadeMinima: 0, 
      preco: 0, 
      unidade: "un", 
      observacao: "", 
      foto: "" 
    },
  });

  useEffect(() => {
    if (modoEdicao && id) {
      const produto = getProdutoById(id);
      if (produto) {
        reset({
          nome: produto.nome, 
          categoriaId: produto.categoriaId, 
          quantidade: produto.quantidade,
          quantidadeMinima: produto.quantidadeMinima, 
          preco: produto.preco, 
          unidade: produto.unidade as any,
          observacao: produto.observacao ?? ""
        });
      }
    }
  }, [id]);

  const onSubmit = async (data: ProdutoFormData) => {
  try {
    if (modoEdicao && id) {
      await editarProduto(id, data);
    } else {
      await adicionarProduto(data);
    }
    router.back();
  } catch (error: any) {
    Alert.alert(
      "Não foi possível salvar",
      error.message ?? "Verifique sua conexão e tente novamente.",
      [{ text: "OK" }]
    );
  }
};

const handleDeletar = () => {
  Alert.alert("Excluir produto", "Esta ação não pode ser desfeita.", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Excluir",
      style: "destructive",
      onPress: async () => {
        try {
          if (id) await deletarProduto(id);
          router.back();
        } catch (error: any) {
          Alert.alert("Erro ao excluir", error.message);
        }
      },
    },
  ]);
};

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      

      <Controller control={control} name="foto" render={({ field: { value, onChange } }) => (
        <ImagePickerField value={value ?? null} onChange={onChange} />
      )} />

      <Controller control={control} name="nome" render={({ field: { value, onChange, onBlur } }) => (
        <Input label="Nome do produto *" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.nome?.message} />
      )} />

      <Controller control={control} name="categoriaId" render={({ field: { value, onChange } }) => (
        <View style={{marginBottom: 16}}>
          <Text style={styles.label}>Categoria *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIAS_MOCK.map(c => (
              <TouchableOpacity key={c.id} onPress={() => onChange(c.id)} style={[styles.chip, value === c.id && styles.chipSelected]}>
                <Text style={value === c.id ? {color: Colors.white} : {color: Colors.textSecondary}}>{c.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.categoriaId && <Text style={styles.errorText}>{errors.categoriaId.message}</Text>}
        </View>
      )} />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Controller control={control} name="quantidade" render={({ field: { value, onChange, onBlur } }) => (
            <Input label="Estoque *" value={value === 0 ? "" : String(value)} onChangeText={(t) => onChange(t === "" ? 0 : Number(t))} onBlur={onBlur} error={errors.quantidade?.message} keyboardType="numeric" />
          )} />
        </View>
        
        <View style={{ width: 100, marginLeft: 12 }}>
           <Controller control={control} name="unidade" render={({ field: { value, onChange } }) => (
            <View>
              <Text style={styles.label}>Unidade *</Text>
              <View style={styles.unidadeContainer}>
                {UNIDADES.map(u => (
                  <TouchableOpacity key={u} onPress={() => onChange(u)} style={[styles.miniChip, value === u && styles.chipSelected]}>
                    <Text style={[styles.miniChipText, value === u && {color: Colors.white}]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )} />
        </View>
      </View>

      <Controller control={control} name="quantidadeMinima" render={({ field: { value, onChange, onBlur } }) => (
        <Input label="Quantidade mínima (alerta) *" value={value === 0 ? "" : String(value)} onChangeText={(t) => onChange(t === "" ? 0 : Number(t))} onBlur={onBlur} error={errors.quantidadeMinima?.message} keyboardType="numeric" />
      )} />

      <Controller control={control} name="preco" render={({ field: { value, onChange, onBlur } }) => (
        <Input label="Preço (R$) *" value={value === 0 ? "" : String(value)} onChangeText={(t) => onChange(t === "" ? 0 : Number(t.replace(",", ".")))} onBlur={onBlur} error={errors.preco?.message} keyboardType="decimal-pad" />
      )} />

      <Controller control={control} name="observacao" render={({ field: { value, onChange, onBlur } }) => (
        <Input 
          label="Observações (opcional)" 
          value={value ?? ""} 
          onChangeText={onChange} 
          onBlur={onBlur} 
          error={errors.observacao?.message}
          multiline
          numberOfLines={3}
          style={{ height: 40, textAlignVertical: 'top' }} 
        />
      )} />

      <Button label={modoEdicao ? "Salvar alterações" : "Cadastrar produto"} onPress={handleSubmit(onSubmit)} loading={isSubmitting} fullWidth />
      
      {modoEdicao && (
        <View style={{marginTop: 16}}>
          <Button label="Excluir produto" onPress={handleDeletar} variant="danger" fullWidth />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing[6], paddingBottom: Spacing[10] },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.neutral[100], marginRight: 8, borderWidth: 1, borderColor: Colors.border },
  chipSelected: { backgroundColor: Colors.primary[600], borderColor: Colors.primary[600] },
  miniChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: Colors.neutral[100], marginBottom: 4, marginRight: 4, borderWidth: 1, borderColor: Colors.border },
  miniChipText: { fontSize: 10, fontWeight: 'bold', color: Colors.textSecondary },
  unidadeContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  errorText: { color: Colors.danger.text, fontSize: 12, marginTop: 4 },
});