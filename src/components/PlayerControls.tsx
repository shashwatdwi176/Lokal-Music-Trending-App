import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Play as LucidePlay,
  Pause as LucidePause,
  SkipBack as LucideSkipBack,
  SkipForward as LucideSkipForward,
  Shuffle as LucideShuffle,
  Repeat as LucideRepeat,
  Repeat1 as LucideRepeat1,
} from 'lucide-react-native';
import { usePlayer } from '../hooks/usePlayer';


const Play = LucidePlay as any;
const Pause = LucidePause as any;
const SkipBack = LucideSkipBack as any;
const SkipForward = LucideSkipForward as any;
const Shuffle = LucideShuffle as any;
const Repeat = LucideRepeat as any;
const Repeat1 = LucideRepeat1 as any;

const PlayerControls: React.FC = () => {
  const {
    isPlaying,
    togglePlayback,
    skipNext,
    skipPrevious,
    repeatMode,
    setRepeatMode,
    shuffleMode,
    setShuffleMode,
  } = usePlayer();

  const cycleRepeatMode = () => {
    const next = ((repeatMode as number) + 1) % 3;
    setRepeatMode(next as 0 | 1 | 2);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 1) return <Repeat1 size={22} color="#1DB954" />;
    if (repeatMode === 2) return <Repeat size={22} color="#1DB954" />;
    return <Repeat size={22} color="#888" />;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShuffleMode(!shuffleMode)} style={styles.sideBtn}>
        <Shuffle size={22} color={shuffleMode ? '#1DB954' : '#888'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={skipPrevious} style={styles.skipBtn}>
        <SkipBack size={32} color="#fff" fill="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
        {isPlaying ? (
          <Pause size={44} color="#000" fill="#000" />
        ) : (
          <Play size={44} color="#000" fill="#000" />
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={skipNext} style={styles.skipBtn}>
        <SkipForward size={32} color="#fff" fill="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={cycleRepeatMode} style={styles.sideBtn}>
        {getRepeatIcon()}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sideBtn: {
    padding: 8,
    width: 44,
    alignItems: 'center',
  },
  skipBtn: {
    padding: 8,
  },
  playButton: {
    backgroundColor: '#1DB954',
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default PlayerControls;
