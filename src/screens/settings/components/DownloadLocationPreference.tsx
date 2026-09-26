import React, {useState} from 'react';
import {View} from 'react-native';
import Toast from '../../../lib/utils/toast';
import {
  getDownloadLocationDisplayValue,
  selectDownloadLocation,
} from '../../../lib/downloadLocation';
import {settingsStorage} from '../../../lib/storage';
import {syncFromSharedFolder} from '../../../lib/sync/syncService';
import IconButton from '../../../components/ui/IconButton';
import SettingsRow from '../../../components/ui/SettingsRow';
import SettingsSection from '../../../components/ui/SettingsSection';

type DownloadLocationPreferenceProps = {
  primary: string;
};

const DownloadLocationPreference = ({
  primary: _primary,
}: DownloadLocationPreferenceProps) => {
  const [downloadLocation, setDownloadLocation] = useState(
    settingsStorage.getDownloadLocation(),
  );
  const [isPickingFolder, setIsPickingFolder] = useState(false);

  const saveDownloadLocation = (
    location: NonNullable<
      ReturnType<typeof settingsStorage.getDownloadLocationConfig>
    >,
  ) => {
    settingsStorage.setDownloadLocation(location);
    setDownloadLocation(getDownloadLocationDisplayValue(location));
    syncFromSharedFolder().catch(e =>
      console.warn('[VegaSync] Folder change sync failed:', e),
    );
    Toast.show('Download location updated', Toast.SHORT);
  };

  const pickDownloadLocation = async () => {
    if (isPickingFolder) {
      return;
    }

    setIsPickingFolder(true);
    try {
      const pickedLocation = await selectDownloadLocation();
      if (pickedLocation) {
        saveDownloadLocation(pickedLocation);
        return;
      }

      Toast.show('No folder selected', Toast.SHORT);
    } catch (error) {
      console.log('Error picking download folder:', error);
      Toast.show('Unable to open folder picker', Toast.SHORT);
    } finally {
      setIsPickingFolder(false);
    }
  };

  return (
    <View className="mb-6">
      <SettingsSection title="Downloads">
        <SettingsRow
          title="Download location"
          description={downloadLocation}
          divider
          trailing={
            <IconButton
              icon="folder-open-outline"
              label="Choose download location"
              disabled={isPickingFolder}
              onPress={pickDownloadLocation}
            />
          }
        />
        <SettingsRow
          title="Reset download location"
          description="Choose a folder again on the next download"
          divider={false}
          trailing={
            <IconButton
              icon="restore"
              label="Reset download location"
              onPress={() => {
                settingsStorage.resetDownloadLocation();
                setDownloadLocation('Select a download folder');
                Toast.show(
                  'Download location cleared',
                  Toast.SHORT,
                );
              }}
            />
          }
        />
      </SettingsSection>
    </View>
  );
};

export default DownloadLocationPreference;
