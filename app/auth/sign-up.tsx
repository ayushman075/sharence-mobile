import * as React from 'react';
import { Text, TextInput, Button, View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn  } = useSignIn();
  const router = useRouter();
    const { isSignedIn } = useAuth();


     React.useEffect(() => {
       if (isLoaded && isSignedIn) {
         router.replace('/'); 
       }
     }, [isLoaded, isSignedIn, router]);

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      if(!emailAddress || !password){
          Toast.show({
            type:"error",
            text1:"Email or Password is empty."
      })
      }
      else{
      await signUp.create({
        emailAddress,
        password,
      });

 Toast.show({
          type:'success',
          text1:'Signup Successfully.'
        })
        router.replace('/')
      }
    } catch (err) {
       Toast.show({
              type:"error",
              text1: 'Error Loggin In.',
            })
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
       <SafeAreaView style={{flex:1}}>
              <View style={{...styles.logoContainer,width:"100%",backgroundColor:"white",marginTop:20}}>
          <Image
            source={require('../../assets/images/shareableLogo.png')} // Replace with your logo path
            style={styles.logo}
            resizeMode="contain" // Keeps the image's aspect ratio
          />
        </View>
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title="Continue" onPress={onSignUpPress} />
      <View style={styles.signinContainer}>
        <Text>Already have an account?</Text>
        <Link href="/auth/sign-in">
          <Text style={styles.signinText}>Sign In</Text>
        </Link>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center', // Center the logo horizontally
    justifyContent: 'center', // Center the logo vertically
    height: 100, // Adjust height of the container as needed
    width: 100, // Adjust width of the container as needed
    backgroundColor: '#f5f5f5', // Optional: background color for the div
    borderRadius: 50, // Optional: make the div circular
  },
  logo: {
    height: '100%', // Let the image scale within the container
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  signinContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signinText: {
    color: '#007bff',
    marginLeft: 4,
  },
});
