import { Linking, Alert } from 'react-native';
import { extractDigits } from '../utils/formatting';

export async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  const digits = extractDigits(phone);

  if (digits.length < 10 || digits.length > 13) {
    Alert.alert(
      'Número inválido',
      'Este contato não possui um número de WhatsApp válido.',
      [{ text: 'OK' }]
    );
    return false;
  }

  const internationalNumber = digits.startsWith('55') ? digits : `55${digits}`;
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${internationalNumber}?text=${encodedMessage}`;

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert(
      'WhatsApp não encontrado',
      'O WhatsApp não está instalado neste dispositivo. Instale o WhatsApp e tente novamente.',
      [{ text: 'OK' }]
    );
    return false;
  }

  await Linking.openURL(url);
  return true;
}
