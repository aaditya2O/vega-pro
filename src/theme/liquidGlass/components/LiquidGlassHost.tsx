import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useLiquidGlass} from '../LiquidGlassContext';
import {DynamicIslandLiveActivity} from './DynamicIslandLiveActivity';
import {FaceIdLockModal} from './FaceIdLockModal';
import {AirPlayRemoteModal} from './AirPlayRemoteModal';

export const LiquidGlassHost: React.FC = () => {
  const {
    faceIdModalVisible,
    setFaceIdModalVisible,
    airPlayRemoteVisible,
    setAirPlayRemoteVisible,
  } = useLiquidGlass();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Dynamic Island Live Activity HUD */}
      <DynamicIslandLiveActivity />

      {/* Face ID Biometric Verification Modal */}
      <FaceIdLockModal
        visible={faceIdModalVisible}
        onSuccess={() => setFaceIdModalVisible(false)}
      />

      {/* Apple TV Siri Remote Glass Controller Modal */}
      <AirPlayRemoteModal
        visible={airPlayRemoteVisible}
        onClose={() => setAirPlayRemoteVisible(false)}
      />
    </View>
  );
};

export default LiquidGlassHost;
