import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import { usePlayer } from '../hooks/usePlayer';
import { useNavigation } from '@react-navigation/native';
import { getImageUrl } from '../services/api';

const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, progress, duration, togglePlayback, skipNext } = usePlayer();
  const navigation = useNavigation<any>();

  if (!currentTrack) return null;

  const imageUrl = getImageUrl(currentTrack, '150x150');
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('Player')}
    >
      {/* Progress bar at top */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.content}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>{currentTrack.name}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.primaryArtists}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation?.(); togglePlayback(); }}
            style={styles.controlButton}
          >
            {isPlaying ? (
              <Pause size={24} color="#fff" fill="#fff" />
            ) : (
              <Play size={24} color="#fff" fill="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation?.(); skipNext(); }}
            style={styles.controlButton}
          >
            <SkipForward size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282828',
    borderTopWidth: 1,
    borderTopColor: '#333',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 20,
  },
  progressBarBg: {
    height: 2,
    backgroundColor: '#444',
    width: '100%',
  },
  progressBarFill: {
    height: 2,
    backgroundColor: '#1DB954',
  },
  content: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  image: {
    width: 46,
    height: 46,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 10,
  },
});

export default MiniPlayer;
