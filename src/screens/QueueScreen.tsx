import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ChevronDown, Trash2, ArrowUp, ArrowDown } from 'lucide-react-native';
import { usePlayerStore } from '../store/playerStore';
import { usePlayer } from '../hooks/usePlayer';
import { useNavigation } from '@react-navigation/native';
import { getImageUrl } from '../services/api';

const QueueScreen: React.FC = () => {
  const { queue, removeFromQueue, moveQueueItem, currentTrack } = usePlayerStore();
  const { playSong } = usePlayer();
  const navigation = useNavigation();

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      moveQueueItem(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < queue.length - 1) {
      moveQueueItem(index, index + 1);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isActive = currentTrack?.id === item.id;
    const imageUrl = getImageUrl(item, '150x150');

    return (
      <View style={[styles.itemContainer, isActive && styles.activeItem]}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={[styles.name, isActive && styles.activeText]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {item.primaryArtists}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleMoveUp(index)} disabled={index === 0}>
            <ArrowUp size={20} color={index === 0 ? '#333' : '#888'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMoveDown(index)}
            disabled={index === queue.length - 1}
          >
            <ArrowDown size={20} color={index === queue.length - 1 ? '#333' : '#888'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeFromQueue(item.id)}>
            <Trash2 size={20} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronDown size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Queue</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={queue}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Queue is empty</Text>
          </View>
        }
      />
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  activeItem: {
    backgroundColor: '#1e2d23',
    borderColor: '#1DB954',
    borderWidth: 1,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 4,
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
  activeText: {
    color: '#1DB954',
  },
  artist: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#555',
    fontSize: 16,
  },
});

export default QueueScreen;
