import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { ChevronDown, ListMusic, Heart } from 'lucide-react-native';
import { usePlayer } from '../hooks/usePlayer';
import PlayerControls from '../components/PlayerControls';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { getImageUrl } from '../services/api';

const { width } = Dimensions.get('window');
const ART_SIZE = width - 64;

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const PlayerScreen: React.FC = () => {
  const { currentTrack, progress, duration, seekTo, isPlaying } = usePlayer();
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSlidingStart = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const handleSlidingComplete = useCallback(
    (value: number) => {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
      seekTo(value);
    },
    [seekTo, scaleAnim]
  );

  if (!currentTrack) return null;

  const imageUrl = getImageUrl(currentTrack, '500x500');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <ChevronDown size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>Now Playing</Text>
          <Text style={styles.headerAlbum} numberOfLines={1}>
            {currentTrack.album?.name || currentTrack.primaryArtists}
          </Text>
        </View>

        <TouchableOpacity style={styles.headerBtn}>
          <ListMusic size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.artWrapper}>
        <Animated.View
          style={[
            styles.artContainer,
            {
              transform: [{ scale: isPlaying ? 1 : 0.93 }],
            },
          ]}
        >
          <Image source={{ uri: imageUrl }} style={styles.albumArt} resizeMode="cover" />
        </Animated.View>
      </View>

      {/* Song Info */}
      <View style={styles.infoRow}>
        <View style={styles.songInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.primaryArtists}
          </Text>
        </View>
        <TouchableOpacity style={styles.heartBtn}>
          <Heart size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Seek Bar */}
      <View style={styles.seekContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration > 0 ? duration : 1}
          value={progress}
          onSlidingStart={handleSlidingStart}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#3a3a3a"
          thumbTintColor="#fff"
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(progress)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <PlayerControls />

      {/* Bottom padding */}
      <View style={{ height: 30 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    padding: 8,
    width: 44,
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerLabel: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  headerAlbum: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    maxWidth: 200,
  },
  artWrapper: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 8,
  },
  artContainer: {
    width: ART_SIZE,
    height: ART_SIZE,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#1e1e1e',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 24,
  },
  songInfo: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  artist: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 4,
  },
  heartBtn: {
    padding: 8,
  },
  seekContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -4,
  },
  timeText: {
    color: '#777',
    fontSize: 12,
  },
});

export default PlayerScreen;
