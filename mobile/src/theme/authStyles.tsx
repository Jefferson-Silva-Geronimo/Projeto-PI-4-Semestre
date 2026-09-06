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
  },
    productsHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  productsHeaderText: {
    marginBottom: 16,
  },

  productsTitle: {
    color: '#1E293B',
    fontSize: 28,
    fontWeight: '700',
  },

  productsSubtitle: {
    color: '#64748B',
    fontSize: 15,
    marginTop: 4,
  },

  createProductButton: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  createProductButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  productsListContent: {
    padding: 20,
  },

  productsEmptyListContent: {
    flexGrow: 1,
  },

  productCard: {
    minHeight: 130,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },

  productInformation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  productName: {
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
  },

  productPrice: {
    color: '#2D6CDF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },

  productStock: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 5,
  },

  productStatus: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },

  activeStatus: {
    color: '#15803D',
    backgroundColor: '#DCFCE7',
  },

  inactiveStatus: {
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
  },

  productSeparator: {
    height: 12,
  },

  productsCenteredContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productsFeedbackText: {
    color: '#475569',
    fontSize: 16,
    marginTop: 18,
  },

  productsErrorText: {
    color: '#DC2626',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 18,
  },

  productsRetryButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  productsEmptyContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productsEmptyTitle: {
    color: '#1E293B',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  productsEmptyText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
    createProductKeyboardView: {
    flex: 1,
  },

  createProductContent: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  createProductHeader: {
    marginBottom: 28,
  },

  createProductTitle: {
    color: '#1E293B',
    fontSize: 28,
    fontWeight: '700',
  },

  createProductSubtitle: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  createProductForm: {
    width: '100%',
  },

  productField: {
    width: '100%',
    marginBottom: 18,
  },

  productFieldLabel: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  productFieldHelper: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  productDescriptionInput: {
    height: 120,
    paddingTop: 16,
    paddingBottom: 16,
  },

  productFieldsRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 18,
  },

  productFieldHalf: {
    flex: 1,
    marginRight: 8,
  },

  createProductErrorText: {
    color: '#DC2626',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

  createProductSuccessText: {
    color: '#15803D',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },

  createProductSubmitButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#2D6CDF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  createProductCancelButton: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  createProductCancelText: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '500',
  },
    clientProductsHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  clientProductsWelcome: {
    flex: 1,
    paddingRight: 16,
  },

  clientProductsLogo: {
    color: '#2D6CDF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },

  clientProductsTitle: {
    color: '#1E293B',
    fontSize: 22,
    fontWeight: '700',
  },

  clientProductsSubtitle: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },

  clientLogoutText: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '600',
    paddingTop: 4,
  },

  clientProductsListContent: {
    padding: 20,
    paddingBottom: 40,
  },

  clientProductCard: {
    minHeight: 150,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  clientProductImage: {
    width: 110,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },

  clientProductInformation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  clientProductName: {
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  clientProductDescription: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },

  clientProductPrice: {
    color: '#2D6CDF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },

  clientProductAvailable: {
    overflow: 'hidden',
    color: '#15803D',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },

  clientProductUnavailable: {
    overflow: 'hidden',
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },
    productsBackText: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
});