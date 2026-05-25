import { z } from "zod";

export const produtoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(80, "Nome muito longo"),
  
  categoriaId: z.string().min(1, "Selecione uma categoria"),
  
  quantidade: z.number().min(0, "Informe a quantidade").int().min(0, "Não pode ser negativa"),
  
  quantidadeMinima: z.int().min(1, "Informe a quantidade mínima").int().min(0, "Não pode ser negativa"),
  
  preco: z.number().min(1, "Informe o preço").positive("Preço deve ser maior que zero"),
  
  unidade: z.enum(["un", "kg", "cx", "L", "m"], { 
    message: "Selecione uma unidade" 
  }),
  
  observacao: z.string().max(200, "Máximo 200 caracteres").optional(),
  foto: z.string().optional()
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;