import {SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import { authStyles as styles } from "../theme/authStyles";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({navigation}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>PETSHOP</Text>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados para continuar</Text>
        <View style={styles.form}>
          <TextInput placeholder="Nome completo" style={styles.input} />
          <TextInput placeholder="Digite seu e-mail" style={styles.input} />
          <TextInput placeholder="Digite sua senha" secureTextEntry style={styles.input} />
          <TextInput placeholder="Confirmar senha" secureTextEntry style={styles.input} />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity> 
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} >
            <Text style={styles.link}> Já possui uma conta? Entrar </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}