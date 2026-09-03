import {SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import { authStyles as styles } from "../theme/authStyles";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<
  AuthStackParamList,
  "ForgotPassword"
>;

export default function ForgotPasswordScreen({navigation}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>PETSHOP</Text>
        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.subtitle}>Informe seu e-mail para receber as instruções de recuperação.</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor="#5B9AD9" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
          <TouchableOpacity style={styles.button} activeOpacity={0.8} >
            <Text style={styles.buttonText}> Enviar recuperação </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} >
            <Text style={styles.link}>Voltar para o login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}