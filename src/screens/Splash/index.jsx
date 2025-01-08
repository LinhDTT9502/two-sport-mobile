import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const steps = [
  {
    title: 'Chọn sản phẩm',
    description: 'Tìm kiếm sản phẩm phù hợp với nhu cầu của bạn',
    image: require('../../../assets/images/splash1.jpg'), 
  },
  {
    title: 'Thêm vào giỏ hàng hoặc Mua ngay',
    description: 'Chọn thuộc tính và số lượng của sản phẩm, nhấn thêm vào giỏ hàng hoặc mua ngay',
    image: require('../../../assets/images/splash2.jpg'),
  },
  {
    title: 'Hoàn tất quá trình mua hàng',
    description: 'Tiến hành đặt hàng và thanh toán đơn hàng',
    image: require('../../../assets/images/splash3.jpg'),
  },
];

const SplashScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Check if the app is opened for the first time
    const checkFirstTime = async () => {
      const firstTimeFlag = await AsyncStorage.getItem('isFirstTime');
      if (firstTimeFlag) {
        // If not the first time, navigate to HomeController
        setIsFirstTime(false);
        navigation.replace('HomeController');
      }
    };
    checkFirstTime();
  }, [navigation]);

  const finishSplash = async () => {
    // Set the flag to indicate the splash has been shown
    await AsyncStorage.setItem('isFirstTime', 'false');
    navigation.replace('HomeController');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishSplash();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isFirstTime) {
    return null; // Prevent splash screen from rendering if it's not the first time
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>{currentStep + 1}/3</Text>
        <TouchableOpacity onPress={finishSplash}>
          <Text>Bỏ qua</Text>
        </TouchableOpacity>
      </View>
      <Image source={steps[currentStep].image} style={styles.image} />
      <Text style={styles.title}>{steps[currentStep].title}</Text>
      <Text style={styles.description}>{steps[currentStep].description}</Text>
      <View style={styles.footer}>
        <Button title="Trước" onPress={prevStep} disabled={currentStep === 0} />
        <Button title="Sau" onPress={nextStep} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 20,
    
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default SplashScreen;
