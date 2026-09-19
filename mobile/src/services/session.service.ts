type UnauthorizedHandler =
  () => void | Promise<void>;

let unauthorizedHandler:
  UnauthorizedHandler | null = null;

export const sessionService = {
  registerUnauthorizedHandler(
    handler: UnauthorizedHandler,
  ): () => void {
    unauthorizedHandler = handler;

    return () => {
      if (
        unauthorizedHandler ===
        handler
      ) {
        unauthorizedHandler = null;
      }
    };
  },

  async notifyUnauthorized():
    Promise<void> {
    if (!unauthorizedHandler) {
      return;
    }

    await unauthorizedHandler();
  },
};