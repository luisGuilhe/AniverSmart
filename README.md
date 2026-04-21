# AniverSmart

Assistente de aniversários para Android. Cadastre contatos, sincronize com o Google Calendar e envie mensagens personalizadas via WhatsApp.

---

## Funcionalidades

- Cadastro de aniversários com tipo de relacionamento, foto e WhatsApp
- Dashboard com próximos aniversários ordenados por data, busca e filtros
- Geração automática de mensagens personalizadas por tipo de relacionamento
- Envio de mensagens direto para o WhatsApp via deep linking
- Sincronização de aniversários do Google Calendar (local, sem backend)
- Backup e restauração local dos dados (arquivo JSON)
- Criptografia dos números de telefone no banco de dados
- 100% offline após cadastrar os contatos

---

## Requisitos

- Android 12+
- WhatsApp instalado para envio de mensagens
- Node.js 18+ e npm
- Expo CLI (`npm install -g expo-cli`)

---

## Instalação e execução

```bash
# Instalar dependências
npm install

# Iniciar o app (Expo Go no celular ou emulador)
npm start

# Ou direto no Android
npm run android
```

---

## Build do APK (Release)

### Com EAS Build (recomendado)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

### Build local

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
# APK em: android/app/build/outputs/apk/release/app-release.apk
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
ENCRYPTION_KEY=chave_32_caracteres
```

> A sincronização com Google Calendar usa as permissões nativas do Android (expo-calendar), sem necessidade de OAuth configurado para uso básico.

---

## Estrutura de pastas

```
src/
├── screens/       # Telas principais (Dashboard, Contatos, Sincronizar, Perfil)
├── components/    # Componentes reutilizáveis (ContactCard, ContactForm, MessagePreview)
├── services/      # Lógica de negócio (banco de dados, WhatsApp, geração de mensagens)
├── hooks/         # Custom hooks (useContacts, useMessages, useCalendarSync)
├── context/       # AppContext (estado global de contatos)
├── navigation/    # RootNavigator (bottom tabs)
├── styles/        # Cores, espaçamento, tipografia
└── utils/         # Validações, formatação, criptografia, constantes
```

---

## Troubleshooting

**WhatsApp não abre:** Verifique se o WhatsApp está instalado. O número deve ter DDD (ex: 11999999999).

**Sincronização falha:** Aceite as permissões de calendário quando solicitado. Requer eventos com "aniversário" ou "birthday" no título.

**Banco de dados corrompido:** Exporte o backup em Perfil > Exportar, reinstale o app e importe o backup.

**Build falha com Google Sign-In:** O Google Sign-In não é necessário para funcionalidade básica. A sincronização usa o calendário do dispositivo diretamente via expo-calendar.
