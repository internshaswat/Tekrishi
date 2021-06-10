import * as React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native'
import * as FirebaseRecaptcha from 'expo-firebase-recaptcha'
import * as firebase from 'firebase'

// PROVIDE VALID FIREBASE CONFIG HERE
// https://firebase.google.com/docs/web/setup
const FIREBASE_CONFIG: any = {
  apiKey: 'AIzaSyACle6ZKYJTWA5GTqJEjTUT4A6d7SfnNpI',
  authDomain: 'hellofire-53e9e.firebaseapp.com',
  projectId: 'hellofire-53e9e',
  storageBucket: 'hellofire-53e9e.appspot.com',
  messagingSenderId: '907674660327',
  appId: '1:907674660327:web:06f467d34252fa00fde142',
  measurementId: 'G-40NVPMCY85',
}

try {
  if (FIREBASE_CONFIG.apiKey) {
    firebase.initializeApp(FIREBASE_CONFIG)
  }
} catch (err) {
  // ignore app already initialized error on snack
}

export default function PhoneAuthScreen({ navigation }) {
  const recaptchaVerifier = React.useRef(null)
  const verificationCodeTextInput = React.useRef(null)
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [verificationId, setVerificationId] = React.useState('')
  const [verifyError, setVerifyError] = React.useState()
  const [verifyInProgress, setVerifyInProgress] = React.useState(false)
  const [verificationCode, setVerificationCode] = React.useState('')
  const [confirmError, setConfirmError] = React.useState()
  const [confirmInProgress, setConfirmInProgress] = React.useState(false)
  const isConfigValid = !!FIREBASE_CONFIG.apiKey

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={FIREBASE_CONFIG}
        />
        <Text style={styles.title}>कृपया लॉग इन करें</Text>
        <Text style={styles.text}>फोन नंबर दर्ज</Text>
        <TextInput
          style={styles.textInput}
          autoFocus={isConfigValid}
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          placeholder="अपना १० अंकों का फ़ोन नंबर दर्ज करें"
          editable={!verificationId}
          onChangeText={(phoneNumber: string) =>
            setPhoneNumber('+91' + phoneNumber)
          }
        />
        <Button
          title={`${verificationId ? 'फिर से भेजें' : 'भेजें'} सत्यापन कोड`}
          disabled={!phoneNumber}
          onPress={async () => {
            const phoneProvider = new firebase.auth.PhoneAuthProvider()
            try {
              setVerifyError(undefined)
              setVerifyInProgress(true)
              setVerificationId('')
              const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                // @ts-ignore
                recaptchaVerifier.current
              )
              setVerifyInProgress(false)
              setVerificationId(verificationId)
              verificationCodeTextInput.current?.focus()
            } catch (err) {
              setVerifyError(err)
              setVerifyInProgress(false)
            }
          }}
        />
        {verifyError && (
          <Text style={styles.error}>{`Error: ${verifyError.message}`}</Text>
        )}
        {verifyInProgress && <ActivityIndicator style={styles.loader} />}
        {verificationId ? (
          <Text style={styles.success}>
            आपके फ़ोन पर एक सत्यापन कोड भेज दिया गया है
          </Text>
        ) : undefined}
        <Text style={styles.text}>सत्यापन कोड दर्ज करें</Text>
        <TextInput
          ref={verificationCodeTextInput}
          style={styles.textInput}
          editable={!!verificationId}
          placeholder="123456"
          onChangeText={(verificationCode: string) =>
            setVerificationCode(verificationCode)
          }
        />
        <Button
          title="सत्यापन कोड की पुष्टि करें"
          disabled={!verificationCode}
          onPress={async () => {
            try {
              setConfirmError(undefined)
              setConfirmInProgress(true)
              const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              )
              const authResult = await firebase
                .auth()
                .signInWithCredential(credential)
              console.log(authResult)
              setConfirmInProgress(false)
              setVerificationId('')
              setVerificationCode('')
              verificationCodeTextInput.current?.clear()
              Alert.alert('फ़ोन प्रमाणीकरण सफल!')
            } catch (err) {
              setConfirmError(err)
              setConfirmInProgress(false)
            }
          }}
        />
        {confirmError && (
          <Text style={styles.error}>{`Error: ${confirmError.message}`}</Text>
        )}
        {confirmInProgress && <ActivityIndicator style={styles.loader} />}
      </View>
      {!isConfigValid && (
        <View style={styles.overlay} pointerEvents="none">
          <Text style={styles.overlayText}>
            आरंभ करने के लिए, App.tsx में एक मान्य FIREBASE_CONFIG सेट करें।
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    marginTop: 30,
  },
  title: {
    marginBottom: 2,
    fontSize: 29,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 10,
    opacity: 0.35,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 30,
    marginBottom: 4,
  },
  textInput: {
    marginBottom: 8,
    fontSize: 17,
    fontWeight: 'bold',
  },
  error: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'red',
  },
  success: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'blue',
  },
  loader: {
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFFC0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontWeight: 'bold',
  },
})