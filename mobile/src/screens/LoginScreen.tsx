import {SafeAreaView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { authStyles as styles } from "../theme/authStyles";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({navigation}: Props) {
    return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.logo}>PETSHOP</Text>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>Entre com credenciais para continuar.</Text>

            <View style={styles.form}>
                <TextInput style={styles.input} placeholder="Digite seu Email" keyboardType='email-address' autoCapitalize='none' />
                <TextInput style={styles.input} placeholder="Digite sua Senha" secureTextEntry={true} />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("ForgotPassword")} >
                    <Text style={styles.link}>Esqueci minha senha</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Register")} >
                    <Text style={styles.link}>Criar conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
    );
}