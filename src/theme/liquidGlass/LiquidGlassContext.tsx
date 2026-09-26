import React, {createContext, useContext, useState, useCallback, useMemo} from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {LiquidTokens} from './tokens';

export type LiquidThemeMode = 'default' | 'cyber' | 'void' | 'amber';

export interface LiveActivityState {
  title: string;
  subtitle: string;
  poster?: string;
  isPlaying: boolean;
  progress: number; // 0 to 1
  currentTime: number; // seconds
  duration: number; // seconds
  formatBadge?: string;
}

export interface LiquidGlassContextType {
  mode: LiquidThemeMode;
  setMode: (mode: LiquidThemeMode) => void;
  tokens: typeof LiquidTokens;
  isFaceIdLocked: boolean;
  setFaceIdLocked: (locked: boolean) => void;
  isFaceIdAuthenticated: boolean;
  setFaceIdAuthenticated: (auth: boolean) => void;
  triggerFaceIdPrompt: (onSuccess?: () => void) => void;
  faceIdModalVisible: boolean;
  setFaceIdModalVisible: (visible: boolean) => void;
  warpActive: boolean;
  setWarpActive: (active: boolean) => void;
  warpPingMs: number;
  triggerHaptic: (type?: 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess') => void;
  liveActivity: LiveActivityState | null;
  updateLiveActivity: (state: Partial<LiveActivityState> | null) => void;
  airPlayRemoteVisible: boolean;
  setAirPlayRemoteVisible: (visible: boolean) => void;
}

const defaultContext: LiquidGlassContextType = {
  mode: 'default',
  setMode: () => {},
  tokens: LiquidTokens,
  isFaceIdLocked: false,
  setFaceIdLocked: () => {},
  isFaceIdAuthenticated: true,
  setFaceIdAuthenticated: () => {},
  triggerFaceIdPrompt: () => {},
  faceIdModalVisible: false,
  setFaceIdModalVisible: () => {},
  warpActive: true,
  setWarpActive: () => {},
  warpPingMs: 12,
  triggerHaptic: () => {},
  liveActivity: null,
  updateLiveActivity: () => {},
  airPlayRemoteVisible: false,
  setAirPlayRemoteVisible: () => {},
};

export const LiquidGlassContext = createContext<LiquidGlassContextType>(defaultContext);

export const LiquidGlassProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [mode, setMode] = useState<LiquidThemeMode>('default');
  const [isFaceIdLocked, setFaceIdLocked] = useState<boolean>(false);
  const [isFaceIdAuthenticated, setFaceIdAuthenticated] = useState<boolean>(true);
  const [faceIdModalVisible, setFaceIdModalVisible] = useState<boolean>(false);
  const [warpActive, setWarpActive] = useState<boolean>(true);
  const [warpPingMs] = useState<number>(12);
  const [airPlayRemoteVisible, setAirPlayRemoteVisible] = useState<boolean>(false);
  const [liveActivity, setLiveActivity] = useState<LiveActivityState | null>({
    title: 'Stardust Echoes',
    subtitle: 'Beyond the void, hope remains',
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    isPlaying: true,
    progress: 0.54,
    currentTime: 4470,
    duration: 8280,
    formatBadge: 'ATMOS',
  });

  const triggerHaptic = useCallback(
    (type: 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' = 'impactLight') => {
      try {
        ReactNativeHapticFeedback.trigger(type, {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      } catch {
        // No-op on unsupported platforms
      }
    },
    [],
  );

  const triggerFaceIdPrompt = useCallback((onSuccess?: () => void) => {
    setFaceIdModalVisible(true);
    triggerHaptic('impactMedium');
    setTimeout(() => {
      setFaceIdAuthenticated(true);
      setFaceIdModalVisible(false);
      triggerHaptic('notificationSuccess');
      onSuccess?.();
    }, 1400);
  }, [triggerHaptic]);

  const updateLiveActivity = useCallback((state: Partial<LiveActivityState> | null) => {
    if (state === null) {
      setLiveActivity(null);
    } else {
      setLiveActivity(prev => (prev ? {...prev, ...state} : (state as LiveActivityState)));
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      tokens: LiquidTokens,
      isFaceIdLocked,
      setFaceIdLocked,
      isFaceIdAuthenticated,
      setFaceIdAuthenticated,
      triggerFaceIdPrompt,
      faceIdModalVisible,
      setFaceIdModalVisible,
      warpActive,
      setWarpActive,
      warpPingMs,
      triggerHaptic,
      liveActivity,
      updateLiveActivity,
      airPlayRemoteVisible,
      setAirPlayRemoteVisible,
    }),
    [
      mode,
      isFaceIdLocked,
      isFaceIdAuthenticated,
      faceIdModalVisible,
      warpActive,
      warpPingMs,
      triggerHaptic,
      triggerFaceIdPrompt,
      liveActivity,
      updateLiveActivity,
      airPlayRemoteVisible,
    ],
  );

  return <LiquidGlassContext.Provider value={value}>{children}</LiquidGlassContext.Provider>;
};

export const useLiquidGlass = () => useContext(LiquidGlassContext);
