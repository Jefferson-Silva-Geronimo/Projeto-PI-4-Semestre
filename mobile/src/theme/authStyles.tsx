import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logo: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#223A52",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#5B9AD9",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },

  form: {
    gap: 16,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#D9E6F2",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },

  button: {
    height: 56,
    backgroundColor: "#1E90FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    textAlign: "center",
    color: "#1975D1",
    fontSize: 15,
  },
});