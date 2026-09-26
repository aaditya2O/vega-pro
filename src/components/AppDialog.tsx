import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {ScrollView, StyleSheet, Text, View, Pressable} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {useM3Colors} from '../theme/M3PaletteContext';
import {LiquidTokens} from '../theme/liquidGlass/tokens';
import MaterialDialogSurface from './ui/MaterialDialogSurface';
import Button from './ui/Button';

export type AppDialogVariant = 'info' | 'success' | 'warning' | 'error';

export interface AppDialogAction {
  label: string;
  onPress?: () => void;
  variant?: 'default' | 'primary' | 'destructive';
  testID?: string;
  disabled?: boolean;
  dismissOnPress?: boolean;
}

interface AppDialogProps {
  visible: boolean;
  title: string;
  message: string;
  messageFormat?: 'plain' | 'markdown';
  primary: string;
  variant?: AppDialogVariant;
  actions?: AppDialogAction[];
  onDismiss: () => void;
}

const variantStyles: Record<
  AppDialogVariant,
  {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    colorRole: 'primary' | 'tertiary' | 'secondary' | 'error';
  }
> = {
  info: {icon: 'information-outline', colorRole: 'primary'},
  success: {icon: 'check-circle-outline', colorRole: 'tertiary'},
  warning: {icon: 'alert-outline', colorRole: 'secondary'},
  error: {icon: 'alert-circle-outline', colorRole: 'error'},
};

const AppDialog = ({
  visible,
  title,
  message,
  messageFormat = 'plain',
  variant = 'info',
  actions = [{label: 'OK', variant: 'primary'}],
  onDismiss,
}: AppDialogProps) => {
  const appearance = variantStyles[variant];
  const colors = useM3Colors();
  const iconColor = colors[appearance.colorRole] || LiquidTokens.colors.accentViolet;

  const handleAction = (action: AppDialogAction) => {
    action.onPress?.();
    if (action.dismissOnPress !== false) {
      onDismiss();
    }
  };

  return (
    <MaterialDialogSurface visible={visible} onDismiss={onDismiss}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name={appearance.icon} size={28} color={iconColor} />
        <Text
          testID="app-dialog-title"
          style={[styles.title, {color: colors.onSurface}]}>
          {title}
        </Text>
      </View>

      <View style={styles.bodyWrap}>
        {messageFormat === 'markdown' ? (
          <ScrollView
            nestedScrollEnabled
            style={styles.markdownScroll}
            contentContainerStyle={{paddingRight: 8}}>
            <Markdown
              style={{
                body: {color: colors.onSurfaceVariant, fontSize: 14},
                bullet_list: {marginVertical: 4},
                code_inline: {
                  backgroundColor: colors.surfaceContainerHighest,
                  color: colors.onSurface,
                },
                fence: {
                  backgroundColor: colors.surfaceContainerHighest,
                  borderColor: colors.outlineVariant,
                  color: colors.onSurface,
                },
                heading1: {
                  color: colors.onSurface,
                  fontSize: 20,
                  marginVertical: 8,
                },
                heading2: {
                  color: colors.onSurface,
                  fontSize: 18,
                  marginVertical: 7,
                },
                heading3: {
                  color: colors.onSurface,
                  fontSize: 16,
                  marginVertical: 6,
                },
                link: {color: colors.primary},
                ordered_list: {marginVertical: 4},
                paragraph: {marginBottom: 8, marginTop: 0},
              }}>
              {message}
            </Markdown>
          </ScrollView>
        ) : (
          <Text
            testID="app-dialog-message"
            style={[styles.message, {color: colors.onSurfaceVariant}]}>
            {message}
          </Text>
        )}
      </View>

      <View style={styles.actionsRow}>
        {actions.map((action, idx) => (
          <Button
            key={idx}
            testID={action.testID}
            compact
            variant={
              action.variant === 'destructive'
                ? 'destructive'
                : action.variant === 'primary'
                  ? 'filled'
                  : 'tonal'
            }
            disabled={action.disabled}
            onPress={() => handleAction(action)}>
            {action.label}
          </Button>
        ))}
      </View>
    </MaterialDialogSurface>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  bodyWrap: {
    marginBottom: 20,
  },
  message: {
    fontSize: 14.5,
    lineHeight: 21,
  },
  markdownScroll: {
    maxHeight: 280,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});

export default AppDialog;
