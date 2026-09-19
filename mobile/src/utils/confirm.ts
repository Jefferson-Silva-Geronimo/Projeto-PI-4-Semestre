import {
  Alert,
  Platform,
} from 'react-native';

interface ConfirmActionOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export function confirmAction({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  destructive = false,
}: ConfirmActionOptions): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (
      typeof window === 'undefined' ||
      typeof window.confirm !==
        'function'
    ) {
      return Promise.resolve(false);
    }

    return Promise.resolve(
      window.confirm(
        `${title}\n\n${message}`,
      ),
    );
  }

  return new Promise<boolean>(
    (resolve) => {
      let resolved = false;

      function finish(
        result: boolean,
      ): void {
        if (resolved) {
          return;
        }

        resolved = true;
        resolve(result);
      }

      Alert.alert(
        title,
        message,
        [
          {
            text: cancelText,
            style: 'cancel',

            onPress: () => {
              finish(false);
            },
          },
          {
            text: confirmText,

            style: destructive
              ? 'destructive'
              : 'default',

            onPress: () => {
              finish(true);
            },
          },
        ],
        {
          cancelable: true,

          onDismiss: () => {
            finish(false);
          },
        },
      );
    },
  );
}