import { SignedIn, useAuth, useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, Button, View, StyleSheet, SafeAreaView, TextInputBase, Image } from 'react-native';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/'); 
    }
  }, [isLoaded, isSignedIn, router]);

  const [emailAddress, setEmailAddress] = React.useState(null);
  const [password, setPassword] = React.useState(null);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;
  
   
    
    try {
      if(!emailAddress || !password){
        Toast.show({
          type:"error",
          text1: 'Email or password is empty.',
        })
      }
      else{
        
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        Toast.show({
          type:'success',
          text1:'Logged In Successfully.'
        })
        router.replace('/'); 
      } else {
        Toast.show({
          type:"error",
          text1: 'Error Loggin In.',
        })
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    }
    } catch (err) {
      Toast.show({
        type:"error",
        text1: 'Error Loggin In.',
      })
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

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
      
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={onSignInPress} />
      <View style={styles.signupContainer}>
        <Text>Don't have an account?</Text>
        <Link href="/auth/sign-up">
          <Text style={styles.signupText}>Sign Up</Text>
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
  signupContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: '#007bff',
    marginLeft: 4,
  },
});
