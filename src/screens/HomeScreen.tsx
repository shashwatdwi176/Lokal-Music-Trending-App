import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { Search, Music } from 'lucide-react-native';
import { debounce } from 'lodash';
import { searchSongs, getTrendingSongs, Song } from '../services/api';
import SongCard from '../components/SongCard';
import { usePlayer } from '../hooks/usePlayer';

const HomeScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { playSong } = usePlayer();
  const inputRef = useRef<TextInput>(null);

  // Load trending songs on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await getTrendingSongs();
      setSongs(results);
      setLoading(false);
    })();
  }, []);

  const fetchSongs = async (searchQuery: string, pageNum: number, isNewSearch: boolean) => {
    if (!searchQuery) {
      setLoading(true);
      const results = await getTrendingSongs();
      setSongs(results);
      setLoading(false);
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    const results = await searchSongs(searchQuery, pageNum);

    if (isNewSearch) {
      setSongs(results);
    } else {
      setSongs((prev) => [...prev, ...results]);
    }

    setHasMore(results.length === 20);
    setLoading(false);
  };

  const debouncedSearch = useCallback(
    debounce((q: string) => {
      setPage(1);
      fetchSongs(q, 1, true);
    }, 400),
    []
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const clearSearch = () => {
    setQuery('');
    debouncedSearch('');
    inputRef.current?.blur();
  };

  const loadMore = () => {
    if (!loading && hasMore && query) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSongs(query, nextPage, false);
    }
  };

  const handlePlaySong = (song: Song) => {
    playSong(song, songs);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Music size={28} color="#1DB954" />
          <Text style={styles.title}>Lokal</Text>
        </View>
        <View style={styles.searchContainer}>
          <Search size={18} color="#777" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search songs, artists..."
            placeholderTextColor="#555"
            value={query}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Section label */}
      {!loading && songs.length > 0 && (
        <Text style={styles.sectionLabel}>
          {isSearching ? `Results for "${query}"` : '🔥 Trending Now'}
        </Text>
      )}

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongCard song={item} onPress={handlePlaySong} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator color="#1DB954" style={{ margin: 24 }} />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Music size={48} color="#333" />
              <Text style={styles.emptyText}>
                {query ? 'No songs found' : 'Search for a song to get started'}
              </Text>
            </View>
          ) : null
        }
        keyboardShouldPersistTaps="handled"
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: '#fff',
    fontSize: 15,
  },
  clearBtn: {
    padding: 8,
  },
  clearText: {
    color: '#888',
    fontSize: 14,
  },
  sectionLabel: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    gap: 16,
  },
  emptyText: {
    color: '#555',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default HomeScreen;
