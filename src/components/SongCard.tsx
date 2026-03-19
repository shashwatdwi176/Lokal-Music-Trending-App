import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Song, getImageUrl } from '../services/api';
import { usePlayer } from '../hooks/usePlayer';
import { Play, Plus } from 'lucide-react-native';

interface SongCardProps {
  song: Song;
  onPress: (song: Song) => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const SongCard: React.FC<SongCardProps> = ({ song, onPress }) => {
  const { currentTrack, isPlaying, addToQueue } = usePlayer();
  const isActive = currentTrack?.id === song.id;
  const imageUrl = getImageUrl(song, '150x150');

  const handleAddToQueue = useCallback(
    (e: any) => {
      e.stopPropagation?.();
      addToQueue(song);
    },
    [song, addToQueue]
  );

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={() => onPress(song)}
      activeOpacity={0.7}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {isActive && (
          <View style={styles.playingOverlay}>
            <Play size={16} color="#1DB954" fill="#1DB954" />
          </View>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.name, isActive && styles.activeName]} numberOfLines={1}>
          {song.name}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {song.primaryArtists}
        </Text>
        <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
      </View>
      <TouchableOpacity onPress={handleAddToQueue} style={styles.queueButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Plus size={20} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 8,
  },
  activeContainer: {
    backgroundColor: '#1e2d23',
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  imageWrapper: {
    position: 'relative',
    width: 54,
    height: 54,
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  playingOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 3,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  activeName: {
    color: '#1DB954',
  },
  artist: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  duration: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
  queueButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default React.memo(SongCard);
