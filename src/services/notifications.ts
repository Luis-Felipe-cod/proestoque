import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function solicitarPermissaoNotificacoes(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn("Notificações não funcionam no simulador");
    return false;
  }

  const { status: statusAtual } = await Notifications.getPermissionsAsync();

  if (statusAtual === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function notificarEstoqueCritico(produtos: Array<{ nome: string; quantidade: number; quantidadeMinima: number }>) {
  const temPermissao = await solicitarPermissaoNotificacoes();
  if (!temPermissao) return;

  if (produtos.length === 0) return;

  const paraNotificar = produtos.slice(0, 3);

  for (const produto of paraNotificar) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Estoque crítico",
        body: `${produto.nome}: ${produto.quantidade}/${produto.quantidadeMinima} (abaixo do mínimo)`,
        data: { produtoNome: produto.nome },
        badge: produtos.length,
      },
      trigger: null,
    });
  }

  if (produtos.length > 3) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Mais alertas de estoque",
        body: `+${produtos.length - 3} produtos com estoque crítico. Verifique o ProEstoque.`,
        badge: produtos.length,
      },
      trigger: null,
    });
  }
}

export async function agendarVerificacaoDiaria() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📦 ProEstoque",
      body: "Verifique o estoque de hoje. Toque para abrir.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}

export async function limparBadge() {
  await Notifications.setBadgeCountAsync(0);
}
