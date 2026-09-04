import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D6CDF',
    textAlign: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },

  form: {
    gap: 16,
  },

  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },

  inputError: {
    borderColor: '#DC2626',
  },

  inputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },

  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#2D6CDF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  link: {
    textAlign: 'center',
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '500',
  },

  linkHighlight: {
    color: '#D97706',
    fontWeight: '600',
  },

  errorText: {
    color: '#DC2626',
    fontSize: 14,
    lineHeight: 20,
    marginTop: -8,
  },

  successText: {
    color: '#15803D',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  helperText: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    marginTop: -8,
  },
  tokenContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
  },
  tokenText: {
    color: '#92400E',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginTop: 8,
  }
});